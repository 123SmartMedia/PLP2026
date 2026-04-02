# PLP2026 — Project Status
Last updated: 2026-04-01

## Live URLs
- **Production**: https://plp-2026.vercel.app
- **GitHub**: https://github.com/123SmartMedia/PLP2026
- **Supabase**: https://wdqblzzmtafmfqwxsavb.supabase.co
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

### Infrastructure
- Deployed to Vercel (auto-deploys on every GitHub push)
- Supabase Auth configured with production redirect URLs
- RLS policies fixed with `is_admin()` security definer function (no recursion)

## Completed This Session
- ✅ Full booking flow working end-to-end (service → coach → date/time → confirm)
- ✅ Admin panel with booking management and coach toggles
- ✅ Admin access set up (michael.cabales18@gmail.com is admin)
- ✅ RLS policies fixed — no more infinite recursion
- ✅ Deployed to https://plp-2026.vercel.app
- ✅ Supabase auth URLs updated for production

## Remaining Roadmap

### 1. Stripe payments
- Add Stripe checkout to the booking wizard before confirming
- Requires: add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to Vercel env vars
- Booking status stays `pending` until payment succeeds

### 2. Email notifications
- Send confirmation email when booking is created (customer)
- Send notification to admin when a new booking comes in
- Send confirmation to customer when admin confirms
- Recommended: Resend (resend.com) — simple API, free tier
- Requires: add RESEND_API_KEY to Vercel env vars

### 3. Coach availability
- Currently all time slots show every day 8am–8pm for all coaches
- Need an admin UI to set each coach's weekly schedule
- Requires creating `availability` table in Supabase (not done yet)

### 4. Real content
- Replace placeholder coach bios (Danny, Mike, Richie, Anthony) with real info
- Add real coach photos (currently initials avatars)
- Add real address, phone, email to the contact page (`app/(marketing)/contact/page.tsx`)
- Add Google Maps embed to contact page
- Update facility pricing (currently "Contact for Pricing")
- Wire contact form to an email service (Resend)

### 5. Nice-to-haves
- Coaches page driven by DB instead of hardcoded
- Testimonials pulled from DB (`testimonials` table exists, content column)
- Password reset flow

## Tech Stack
- Next.js 15 (App Router) — auto-deploys via Vercel git integration
- TypeScript strict mode
- Tailwind CSS v3 + custom navy/gold brand colors
- shadcn/ui with @base-ui/react (Button uses `render={<Link />}` not `asChild`)
- Supabase Auth + PostgreSQL + @supabase/ssr v0.6.1
- GitHub: 123SmartMedia/PLP2026

## Known Issues
- OneDrive creates conflict copies (e.g. `page-MCABALES-LAPTOP.tsx`) that break builds
  - Fix: delete them, run `npm install`, clear cache with `powershell -Command "Remove-Item -Recurse -Force '.next'"`
- node_modules occasionally corrupted by OneDrive sync — fix with `npm install`
- Stripe keys in .env.local are placeholders — Stripe not yet integrated
