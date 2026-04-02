# PLP2026 — Project Status
Last updated: 2026-04-02

## Live URLs
- **Production**: https://plp-2026.vercel.app
- **GitHub**: https://github.com/123SmartMedia/PLP2026
- **Supabase**: https://wdqblzzmtafmfqwxsavb.supabase.co
- Admin user: michael.cabales18@gmail.com (ID: e8befb36-ee14-4bc5-ab33-263021b1f20a)

## What's Built

### Marketing Site (public)
- `/` — Homepage (hero, services, coaches, testimonials, CTA)
- `/services` — Services detail page with anchors
- `/coaches` — Full coaching staff page (hardcoded, not DB-driven yet)
- `/facility` — Facility rentals page
- `/contact` — Contact form (simulated send, not wired to email yet)
- Navbar shows smart Login button — routes to correct portal by role (guest → /login, admin → /admin, coach → /coach, customer → /dashboard)

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
- Step 4: Confirm & notes → Stripe payment → saved as `confirmed`

### Admin Panel (`/admin`)
- `/admin` — Overview: pending/confirmed/completed/cancelled counts + revenue
- `/admin/bookings` — Full booking table, Confirm/Complete/Cancel actions
- `/admin/coaches` — Add/edit coaches with headshot upload, bio, specialties, sports, contact info, display order; toggle active/inactive; create/remove coach portal logins

### Coach Portal (`/coach`)
- `/coach` — Upcoming & past bookings (customer name, phone, service, status)
- `/coach/availability` — Set weekly recurring hours per day
- `/coach/blocked` — Block specific dates/times with optional reason
- `/coach/profile` — Edit phone & notification email
- Access created by admin from `/admin/coaches` — sends Supabase invite email

### Infrastructure
- Deployed to Vercel (auto-deploys on every GitHub push)
- Supabase Auth configured with production redirect URLs
- RLS policies for customer, admin, and coach roles
- Supabase Storage bucket `coach-photos` (public read, admin write)
- Project lives at C:\Projects\PLP2026 (moved from OneDrive)

## Remaining Roadmap

### ✅ Stripe payments (DONE)
- Payment Intent created server-side on "Proceed to Payment"
- Stripe Elements card form embedded in booking wizard step 4
- Webhook at `/api/stripe/webhook` saves booking as `confirmed` on payment success
- Test card: 4242 4242 4242 4242 / any future date / any CVC

### ✅ Email notifications (DONE)
- SendGrid integrated via `@sendgrid/mail`
- Booking confirmation sent to customer on successful Stripe payment
- Admin notification sent to admin@123smartmedia.com (temp — switch to admin@playlikeaprobaseball.com)
- FROM address: bookings@playlikeaprobaseball.com

### ✅ Coach portal (DONE)
- Coach login created by admin, role-guarded portal
- Schedule, availability, blocked times, profile pages

### 1. Wire booking wizard to coach availability
- Booking time slots still use hardcoded 8am–8pm
- Need to query `availability` and `blocked_times` tables when generating slots
- Blocked times should remove slots that overlap

### 2. Real content
- Upload real coach headshots via `/admin/coaches`
- Update coach bios via `/admin/coaches/[id]/edit`
- Add real address, phone, email to contact page (`app/(marketing)/contact/page.tsx`)
- Add Google Maps embed to contact page
- Update facility pricing (currently "Contact for Pricing")
- Wire contact form to SendGrid

### 3. Coaches public page — DB driven
- `/coaches` is currently hardcoded
- Replace with DB query so new coaches added in admin appear automatically

### 4. Nice-to-haves
- Testimonials pulled from DB
- Password reset flow
- Coaches page on marketing site shows real headshots from Supabase Storage

## Tech Stack
- Next.js 15 (App Router) — auto-deploys via Vercel git integration
- TypeScript strict mode
- Tailwind CSS v3 + custom navy/gold brand colors
- shadcn/ui with @base-ui/react (Button uses `render={<Link />}` not `asChild`)
- Supabase Auth + PostgreSQL + Storage — @supabase/ssr v0.6.1
- SendGrid — booking confirmation + admin notification emails
- Stripe — payments + webhook
- GitHub: 123SmartMedia/PLP2026

## Known Issues
- Admin email temporarily set to admin@123smartmedia.com — switch to admin@playlikeaprobaseball.com when ready (`lib/sendgrid.ts:6`)
- Booking time slots ignore coach availability/blocked times — still hardcoded 8am–8pm
- `/coaches` marketing page is hardcoded — does not reflect DB changes
