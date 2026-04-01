import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Clock,
  Users,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Facility Rentals",
  description:
    "Rent our batting cages or indoor turf field in Hauppauge, NY. Perfect for team practices, showcases, and individual training sessions on Long Island.",
};

// ─── Page Header ─────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <section className="bg-navy py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
          Hauppauge, NY
        </p>
        <h1 className="text-white text-5xl font-extrabold tracking-tight">
          Facility Rentals
        </h1>
        <p className="mt-4 text-white/70 text-lg max-w-2xl">
          State-of-the-art batting cages and an indoor turf field available for
          rent by the hour. Train on your schedule, your way.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: "Batting Cages", href: "#cage" },
            { label: "Turf Field", href: "#turf" },
            { label: "Pricing", href: "#pricing" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium px-4 py-2 rounded-full border border-white/20 text-white/70 hover:border-gold hover:text-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Highlights Bar ───────────────────────────────────────────────────────────

const highlights = [
  { icon: Clock, label: "Flexible Hourly Booking" },
  { icon: Users, label: "Teams & Individuals Welcome" },
  { icon: CalendarCheck, label: "Easy Online Reservations" },
];

function HighlightsBar() {
  return (
    <div className="bg-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3">
              <Icon size={20} className="text-navy shrink-0" />
              <span className="text-navy font-semibold text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Batting Cages ────────────────────────────────────────────────────────────

const cageFeatures = [
  "Multiple full-length batting cages",
  "Pitcher's mound available",
  "Tee and soft toss stations",
  "Suitable for baseball and softball",
  "Available with or without pitching machine",
  "Ideal for individual workouts and small groups",
];

const cageUses = [
  "Individual hitting sessions",
  "Small group hitting practice",
  "Pitcher bullpen sessions",
  "Pre-game warm-ups",
  "Player showcases",
  "Lessons (with or without an instructor)",
];

function BattingCagesSection() {
  return (
    <section id="cage" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
              Rental Option 1
            </p>
            <h2 className="text-navy text-4xl font-extrabold tracking-tight mb-4">
              Batting Cage Rental
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Our batting cages are available for hourly rental seven days a
              week. Whether you need extra swings, a bullpen session, or a
              focused pre-game warm-up, our cages give you a professional
              training environment with no distractions.
            </p>
            <p className="text-gray-500 leading-relaxed mt-4">
              Cages accommodate both baseball and softball players and can be
              set up for tee work, soft toss, front toss, or machine-pitched
              at-bats. Equipment is available on-site.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-navy font-semibold text-sm uppercase tracking-widest mb-3">
                  Facility Features
                </p>
                <ul className="space-y-2">
                  {cageFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-navy font-semibold text-sm uppercase tracking-widest mb-3">
                  Great For
                </p>
                <ul className="space-y-2">
                  {cageUses.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              render={<Link href="/book" />}
              className="mt-8 bg-navy hover:bg-navy-light text-white font-semibold"
            >
              Reserve a Cage <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>

          {/* Visual placeholder */}
          <div className="rounded-2xl bg-navy/5 border-2 border-dashed border-navy/20 aspect-[4/3] flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-8 h-8 text-navy/40"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-navy/40 text-sm font-medium">Cage Photo Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Turf Field ───────────────────────────────────────────────────────────────

const turfOptions = [
  {
    label: "Full Field",
    description:
      "Reserve the entire indoor turf field. Ideal for full team practices, infield/outfield work, base running drills, and multi-station team workouts.",
    capacity: "Full team",
    bestFor: ["Team practice", "Infield / outfield drills", "Multi-station workouts", "Showcases & tryouts"],
  },
  {
    label: "Half Field",
    description:
      "Rent half the turf field at a lower rate. Perfect for smaller groups, position-specific drills, or sharing the space with another team.",
    capacity: "Up to ~12 players",
    bestFor: ["Small group training", "Position-specific drills", "Pitching / catching work", "Budget-friendly option"],
  },
];

const turfFeatures = [
  "Premium indoor turf surface",
  "Full baseball and softball dimensions",
  "Bases, pitching rubber, and home plate included",
  "High ceiling clearance for fly balls and pop-ups",
  "Climate controlled — year-round availability",
  "Ample parking on-site",
];

function TurfFieldSection() {
  return (
    <section id="turf" className="py-24 bg-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Rental Option 2
          </p>
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Indoor Turf Field
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Our full indoor turf field is the premier training space on Long
            Island. Available year-round, it&apos;s the go-to choice for travel
            ball teams, high school programs, and youth organizations looking
            for a professional environment to practice and compete.
          </p>
        </div>

        {/* Full / Half options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {turfOptions.map(({ label, description, capacity, bestFor }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-navy text-xl font-bold">{label}</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-navy/10 text-navy font-medium">
                  {capacity}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {description}
              </p>
              <p className="text-navy font-semibold text-xs uppercase tracking-widest mb-3">
                Best For
              </p>
              <ul className="space-y-2">
                {bestFor.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                render={<Link href="/book" />}
                className="mt-6 w-full justify-center bg-navy hover:bg-navy-light text-white font-semibold"
              >
                Reserve {label} <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          ))}
        </div>

        {/* Turf features */}
        <div className="bg-navy rounded-2xl p-8 md:p-10">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-6 text-center">
            Facility Highlights
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {turfFeatures.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const pricingTiers = [
  {
    name: "Batting Cage",
    price: "Contact for Pricing",
    period: "per hour",
    features: [
      "Single cage rental",
      "Equipment available on-site",
      "Baseball & softball",
      "Tee, soft toss, or machine",
    ],
    cta: "Reserve a Cage",
    highlight: false,
  },
  {
    name: "Half Turf Field",
    price: "Contact for Pricing",
    period: "per hour",
    features: [
      "50% of turf field",
      "Bases & rubber included",
      "Up to ~12 players",
      "Year-round availability",
    ],
    cta: "Reserve Half Field",
    highlight: false,
  },
  {
    name: "Full Turf Field",
    price: "Contact for Pricing",
    period: "per hour",
    features: [
      "Entire turf field",
      "Full team capacity",
      "All equipment included",
      "Priority booking available",
    ],
    cta: "Reserve Full Field",
    highlight: true,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Rates
          </p>
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Rental Pricing
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Reach out to get current rates, check availability, or ask about
            bulk booking discounts for teams and leagues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map(({ name, price, period, features, cta, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl border p-8 flex flex-col ${
                highlight
                  ? "bg-navy border-navy shadow-lg"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${highlight ? "text-gold" : "text-navy"}`}>
                {name}
              </p>
              <p className={`text-2xl font-extrabold mb-1 ${highlight ? "text-white" : "text-navy"}`}>
                {price}
              </p>
              <p className={`text-xs mb-6 ${highlight ? "text-white/50" : "text-gray-400"}`}>
                {period}
              </p>
              <ul className="space-y-3 flex-1 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2
                      size={14}
                      className={highlight ? "text-gold shrink-0" : "text-gold shrink-0"}
                    />
                    <span className={highlight ? "text-white/80" : "text-gray-600"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                render={<Link href="/book" />}
                className={
                  highlight
                    ? "bg-gold hover:bg-gold-light text-navy font-bold w-full justify-center"
                    : "bg-navy hover:bg-navy-light text-white font-semibold w-full justify-center"
                }
              >
                {cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Booking CTA ──────────────────────────────────────────────────────────────

function BookingCTA() {
  return (
    <section className="py-20 bg-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-navy text-4xl font-extrabold tracking-tight">
          Reserve Your Spot Today
        </h2>
        <p className="mt-4 text-navy/70 text-lg max-w-xl mx-auto">
          Facility slots fill up fast — especially on weekends and during the
          spring season. Book early to lock in your time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            render={<Link href="/book" />}
            size="lg"
            className="bg-navy hover:bg-navy-light text-white font-bold px-10"
          >
            Book Now <ChevronRight size={18} className="ml-1" />
          </Button>
          <Button
            render={<Link href="/contact" />}
            size="lg"
            variant="outline"
            className="border-navy/30 text-navy font-semibold px-8 bg-transparent"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FacilityPage() {
  return (
    <>
      <PageHeader />
      <HighlightsBar />
      <BattingCagesSection />
      <TurfFieldSection />
      <PricingSection />
      <BookingCTA />
    </>
  );
}
