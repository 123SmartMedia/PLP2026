# PLP2026 — Project Status
Last updated: 2026-04-01

## Live Supabase Project
- URL: https://wdqblzzmtafmfqwxsavb.supabase.co
- Admin user: michael.cabales18@gmail.com (ID: e8befb36-ee14-4bc5-ab33-263021b1f20a)

## What's Built

### Marketing Site (public)
- `/` — Homepage (hero, services, coaches, testimonials, CTA)
- `/services` — Services detail page with anchors
- `/coaches` — Full coaching staff page (hardcoded, not DB-driven)
- `/facility` — Facility rentals page
- `/contact` — Contact form (simulated send, not wired to email yet)

### Auth
- `/login` — Email/password login
- `/signup` — Sign up with full name, email confirmation
- `/auth/callback` — Supabase OAuth callback handler

### Customer Dashboard (`/dashboard`)
- `/dashboard` — Overview: stats, next session, recent bookings
- `/dashboard/bookings` — Full booking list, cancel button
- `/dashboard/profile` — Edit name and phone

### Booking Wizard (`/book`)
- Step 1: Choose service (grouped by type: lesson/clinic/rental)
- Step 2: Choose coach (skipped for rentals)
- Step 3: Pick date & time (slots generated from default 8am–8pm, checks existing bookings)
- Step 4: Confirm & notes → saves to Supabase as `pending`

### Admin Panel (`/admin`)
- `/admin` — Overview: pending/confirmed/completed/cancelled counts + revenue
- `/admin/bookings` — Full booking table, Confirm/Complete/Cancel actions
- `/admin/coaches` — Toggle coaches active/inactive

## Immediate TODO (next session)

### 1. Finish admin access
Run this SQL to give yourself admin access (not done yet):
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'e8befb36-ee14-4bc5-ab33-263021b1f20a';
```

### 2. Fix admin RLS policies
Run these in Supabase SQL Editor if not already done:
```sql
-- Allow admins to view all profiles (needed for booking table customer names)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update coaches
CREATE POLICY "Admins can update coaches"
  ON public.coaches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Remaining Roadmap

### 3. Stripe payments
- Add Stripe checkout to the booking wizard before confirming
- Requires: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY in .env.local
- Booking status stays `pending` until payment succeeds

### 4. Email notifications
- Send confirmation email when booking is created (customer)
- Send notification email when admin confirms a booking (customer)
- Recommended: Resend (resend.com) — simple API, free tier

### 5. Coach availability
- Currently all time slots show every day 8am–8pm for all coaches
- Need UI for admin to set each coach's weekly schedule
- Table `availability` was not created in your Supabase project yet

### 6. Deploy to Vercel
- Connect GitHub repo (123SmartMedia/PLP2026) to Vercel
- Add all .env.local values as Vercel environment variables
- Set NEXT_PUBLIC_APP_URL to your production domain

### 7. Real content
- Replace placeholder coach bios (Danny, Mike, Richie, Anthony)
- Add real coach photos (currently initials avatars)
- Add real address/phone/email to contact page
- Add Google Maps embed to contact page
- Update facility pricing (currently "Contact for Pricing")

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3 + custom navy/gold brand colors
- shadcn/ui with @base-ui/react (Button uses `render={<Link />}` not `asChild`)
- Supabase Auth + PostgreSQL + @supabase/ssr
- GitHub: 123SmartMedia/PLP2026

## Known Issues
- OneDrive creates conflict copies (e.g. `page-MCABALES-LAPTOP.tsx`) that break builds
  - Fix: delete them and run `npm install` if dev server fails
  - Use `powershell -Command "Remove-Item -Recurse -Force '.next'"` to clear build cache
- node_modules occasionally corrupted by OneDrive sync — fix with `npm install`
