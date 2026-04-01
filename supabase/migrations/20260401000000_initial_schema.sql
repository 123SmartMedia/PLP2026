-- ============================================================
-- Play Like a Pro — Initial Schema
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────
-- Extends auth.users with app-level data
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Coaches ─────────────────────────────────────────────────
create table public.coaches (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  role        text not null,
  bio         text[] not null default '{}',
  specialties text[] not null default '{}',
  sports      text[] not null default '{}',
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── Services ────────────────────────────────────────────────
create table public.services (
  id                 uuid primary key default uuid_generate_v4(),
  name               text not null,
  category           text not null check (category in ('lesson', 'clinic', 'rental')),
  duration_minutes   integer not null,
  price_cents        integer not null,
  description        text,
  active             boolean not null default true,
  created_at         timestamptz not null default now()
);

-- ─── Coach Services (many-to-many) ───────────────────────────
create table public.coach_services (
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  service_id  uuid not null references public.services(id) on delete cascade,
  primary key (coach_id, service_id)
);

-- ─── Availability ────────────────────────────────────────────
-- Weekly recurring availability per coach
create table public.availability (
  id           uuid primary key default uuid_generate_v4(),
  coach_id     uuid not null references public.coaches(id) on delete cascade,
  day_of_week  integer not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time   time not null,
  end_time     time not null,
  active       boolean not null default true
);

-- ─── Bookings ────────────────────────────────────────────────
create table public.bookings (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid not null references public.profiles(id) on delete restrict,
  coach_id                  uuid references public.coaches(id) on delete set null,
  service_id                uuid not null references public.services(id) on delete restrict,
  facility_type             text check (facility_type in ('cage', 'turf_full', 'turf_half')),
  start_at                  timestamptz not null,
  end_at                    timestamptz not null,
  status                    text not null default 'pending'
                              check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes                     text,
  stripe_payment_intent_id  text,
  price_cents               integer not null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint no_overlap check (start_at < end_at)
);

-- ─── Testimonials ────────────────────────────────────────────
create table public.testimonials (
  id           uuid primary key default uuid_generate_v4(),
  author_name  text not null,
  author_type  text not null default 'player' check (author_type in ('parent', 'player', 'coach', 'team')),
  quote        text not null,
  rating       integer not null default 5 check (rating between 1 and 5),
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────
create index bookings_user_id_idx    on public.bookings(user_id);
create index bookings_coach_id_idx   on public.bookings(coach_id);
create index bookings_start_at_idx   on public.bookings(start_at);
create index bookings_status_idx     on public.bookings(status);
create index availability_coach_idx  on public.availability(coach_id, day_of_week);

-- ─── Row Level Security ───────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.coaches      enable row level security;
alter table public.services     enable row level security;
alter table public.coach_services enable row level security;
alter table public.availability enable row level security;
alter table public.bookings     enable row level security;
alter table public.testimonials enable row level security;

-- profiles: users see/edit only their own row; admins see all
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- coaches: public read; admin write
create policy "Coaches are publicly readable"
  on public.coaches for select
  using (true);

create policy "Admins can manage coaches"
  on public.coaches for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- services: public read; admin write
create policy "Services are publicly readable"
  on public.services for select
  using (true);

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- coach_services: public read; admin write
create policy "Coach services are publicly readable"
  on public.coach_services for select
  using (true);

create policy "Admins can manage coach services"
  on public.coach_services for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- availability: public read; admin write
create policy "Availability is publicly readable"
  on public.availability for select
  using (true);

create policy "Admins can manage availability"
  on public.availability for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- bookings: users see/manage their own; admins see all
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can cancel their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id)
  with check (status = 'cancelled');

create policy "Admins can manage all bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- testimonials: public read; admin write
create policy "Testimonials are publicly readable"
  on public.testimonials for select
  using (active = true);

create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Seed: Coaches ───────────────────────────────────────────
insert into public.coaches (name, slug, role, bio, specialties, sports, sort_order) values
(
  'Chris Scura',
  'chris-scura',
  'Lead Hitting Instructor',
  array[
    'Coach Chris Scura is the lead hitting instructor at Play Like a Pro in Hauppauge, NY, where he works with baseball and softball players of all ages to develop consistent, game-ready swings.',
    'Drawing on his professional playing background in multiple independent leagues and his experience at respected college programs, Chris blends real-game insight with a modern, detail-oriented approach to hitting.',
    'In each lesson, Chris uses a clear, positive, and player-first teaching style, making adjustments that match the athlete''s age, ability level, and long-term goals.'
  ],
  array['Hitting', 'Swing Mechanics', 'Pitch Recognition'],
  array['Baseball', 'Softball'],
  1
),
(
  'Danny Russo',
  'danny-russo',
  'Pitching Instructor',
  array[
    'Coach Danny Russo brings over fifteen years of competitive pitching experience to the mound at Play Like a Pro.',
    'Danny''s teaching philosophy centers on sustainable mechanics and long-term arm health.',
    'From youth pitchers learning to throw strikes to high school arms preparing for the college recruiting process, Danny meets athletes where they are.'
  ],
  array['Pitching', 'Arm Care', 'Velocity Development'],
  array['Baseball'],
  2
),
(
  'Mike DeLuca',
  'mike-deluca',
  'Infield & Baserunning Instructor',
  array[
    'Coach Mike DeLuca is one of the sharpest defensive minds on the Play Like a Pro staff.',
    'Mike''s lessons are fast-paced, rep-heavy, and detail-oriented.',
    'Mike works with players across all skill levels and age groups, from youth athletes to varsity and travel ball players.'
  ],
  array['Infield Defense', 'Baserunning', 'Fundamentals'],
  array['Baseball', 'Softball'],
  3
),
(
  'Richie Falco',
  'richie-falco',
  'Outfield & Catching Instructor',
  array[
    'Coach Richie Falco joined the Play Like a Pro staff after an impressive playing career that included four years as a starting catcher at the collegiate level.',
    'Richie is equally at home working with outfielders, where his strong throwing background and understanding of routes and reads have helped countless Long Island athletes.',
    'Whether he''s working with a 10-year-old learning to receive or a high school catcher trying to cut down pop times, Richie brings the same focused intensity.'
  ],
  array['Outfield Defense', 'Catching', 'Throwing Mechanics'],
  array['Baseball', 'Softball'],
  4
),
(
  'Anthony Marino',
  'anthony-marino',
  'Softball Specialist & Hitting Instructor',
  array[
    'Coach Anthony Marino is Play Like a Pro''s dedicated softball specialist, bringing a deep understanding of the fastpitch game to every lesson and clinic.',
    'Anthony''s softball-specific hitting instruction addresses the unique timing and mechanical demands of hitting off a rise ball, drop, and changeup.',
    'He is deeply committed to the growth of the sport on Long Island and is known for creating a welcoming, encouraging environment.'
  ],
  array['Softball Hitting', 'Fastpitch Mechanics', 'Youth Development'],
  array['Softball', 'Baseball'],
  5
);

-- ─── Seed: Services ──────────────────────────────────────────
insert into public.services (name, category, duration_minutes, price_cents, description) values
('30-Minute Hitting Lesson',   'lesson', 30,  6000,  'Individual hitting instruction — swing mechanics, pitch recognition, at-bat approach.'),
('60-Minute Hitting Lesson',   'lesson', 60, 10000,  'Extended individual hitting session with video analysis available.'),
('30-Minute Pitching Lesson',  'lesson', 30,  6000,  'Individual pitching instruction — mechanics, command, pitch development.'),
('60-Minute Pitching Lesson',  'lesson', 60, 10000,  'Extended individual pitching session with bullpen work.'),
('30-Minute Fielding Lesson',  'lesson', 30,  6000,  'Infield, outfield, or catching fundamentals.'),
('60-Minute Fielding Lesson',  'lesson', 60, 10000,  'Extended defensive session covering footwork, hands, and throwing.'),
('Group Clinic',               'clinic', 90, 4000,   'Small-group skill clinic. Price per player.'),
('Batting Cage Rental',        'rental', 60, 5000,   'Single batting cage rental per hour.'),
('Half Turf Field Rental',     'rental', 60, 8000,   'Half indoor turf field rental per hour.'),
('Full Turf Field Rental',     'rental', 60, 15000,  'Full indoor turf field rental per hour.');

-- ─── Seed: Testimonials ──────────────────────────────────────
insert into public.testimonials (author_name, author_type, quote, rating, sort_order) values
('Parent of a 14U Player', 'parent', 'Chris completely transformed my son''s swing in just a few sessions. The improvement in contact and confidence was immediate.', 5, 1),
('Travel Ball Coach',      'coach',  'Best facility on Long Island. The turf field rental was perfect for our team''s pre-season prep.', 5, 2),
('High School Player',     'player', 'I''ve been working with Chris for two years. Going from JV to starting varsity is a testament to the quality of coaching here.', 5, 3);
