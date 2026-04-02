-- ============================================================
-- Coach Portal — Migration
-- ============================================================

-- ─── 1. Update profiles role constraint to include 'coach' ───
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
    check (role in ('customer', 'admin', 'coach'));

-- ─── 2. Add contact fields to coaches ────────────────────────
alter table public.coaches
  add column if not exists profile_id  uuid references auth.users(id) on delete set null,
  add column if not exists email       text,
  add column if not exists phone       text;

create unique index if not exists coaches_profile_id_idx on public.coaches(profile_id)
  where profile_id is not null;

-- ─── 3. Blocked times (manual schedule blocks) ───────────────
create table public.blocked_times (
  id          uuid primary key default uuid_generate_v4(),
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  start_at    timestamptz not null,
  end_at      timestamptz not null,
  reason      text,
  created_at  timestamptz not null default now(),
  constraint blocked_times_order check (start_at < end_at)
);

create index blocked_times_coach_idx on public.blocked_times(coach_id, start_at);

alter table public.blocked_times enable row level security;

-- ─── 4. RLS: coaches can read their own bookings ─────────────
create policy "Coaches can view their own bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.coaches
      where coaches.id = bookings.coach_id
        and coaches.profile_id = auth.uid()
    )
  );

-- ─── 5. RLS: coaches can manage their own availability ───────
drop policy if exists "Admins can manage availability" on public.availability;

create policy "Admins can manage availability"
  on public.availability for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Coaches can manage their own availability"
  on public.availability for all
  using (
    exists (
      select 1 from public.coaches
      where coaches.id = availability.coach_id
        and coaches.profile_id = auth.uid()
    )
  );

-- ─── 6. RLS: coaches can manage their own blocked times ──────
create policy "Coaches can manage their own blocked times"
  on public.blocked_times for all
  using (
    exists (
      select 1 from public.coaches
      where coaches.id = blocked_times.coach_id
        and coaches.profile_id = auth.uid()
    )
  );

create policy "Admins can manage all blocked times"
  on public.blocked_times for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── 7. RLS: coaches can update their own coach record ───────
create policy "Coaches can update their own record"
  on public.coaches for update
  using (profile_id = auth.uid());
