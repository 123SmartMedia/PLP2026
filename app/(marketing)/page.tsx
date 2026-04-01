import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Zap,
  Users,
  Building2,
  Star,
} from "lucide-react";

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-navy min-h-[90vh] flex items-center overflow-hidden">
      {/* subtle diagonal stripe */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Hauppauge, NY
          </p>
          <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Train Hard.
            <br />
            <span className="text-gold">Play Like a Pro.</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
            Individual lessons, group clinics, and premier facility rentals for
            baseball and softball players of all ages and skill levels on Long
            Island.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              render={<Link href="/book" />}
              size="lg"
              className="bg-gold hover:bg-gold-light text-navy font-bold text-base px-8"
            >
              Book a Lesson <ChevronRight size={18} className="ml-1" />
            </Button>
            <Button
              render={<Link href="/services" />}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 bg-transparent"
            >
              View Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Zap,
    title: "Private Lessons",
    description:
      "One-on-one instruction in hitting, pitching, and fielding tailored to your age, level, and goals. Work directly with our experienced coaches.",
    href: "/services#lessons",
    cta: "Learn More",
  },
  {
    icon: Users,
    title: "Group Clinics",
    description:
      "Structured group training sessions that build fundamentals, reps, and team chemistry. Great for teams, travel ball, and serious players.",
    href: "/services#clinics",
    cta: "Learn More",
  },
  {
    icon: Building2,
    title: "Facility Rentals",
    description:
      "Rent our batting cages or indoor turf field by the hour. Perfect for team practices, showcases, and extra work on your own schedule.",
    href: "/facility",
    cta: "Reserve Now",
  },
];

function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            What We Offer
          </p>
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Everything You Need to Improve
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, description, href, cta }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center mb-5">
                <Icon size={24} className="text-navy" />
              </div>
              <h3 className="text-navy text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {description}
              </p>
              <Link
                href={href}
                className="mt-6 text-gold font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                {cta} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Coaches ─────────────────────────────────────────────────────────────────

function Coaches() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Meet the Staff
          </p>
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Coached by Professionals
          </h2>
        </div>

        {/* Chris Scura */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-navy h-2" />
          <div className="p-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center shrink-0 text-navy font-bold text-2xl">
                CS
              </div>
              <div>
                <h3 className="text-navy text-xl font-bold">Chris Scura</h3>
                <p className="text-gold text-sm font-semibold mt-0.5">
                  Lead Hitting Instructor
                </p>
              </div>
            </div>
            <p className="mt-5 text-gray-500 text-sm leading-relaxed line-clamp-4">
              A veteran instructor at Play Like a Pro for over a decade, Chris
              has a professional playing background in multiple independent
              leagues. He blends real-game insight with a modern,
              detail-oriented approach to hitting — focusing on efficient swing
              mechanics, pitch recognition, and developing an approach that
              translates under pressure.
            </p>
            <Link
              href="/coaches"
              className="mt-5 text-gold font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View Full Bio <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "Chris completely transformed my son's swing in just a few sessions. The improvement in contact and confidence was immediate.",
    author: "Parent of a 14U Player",
  },
  {
    quote:
      "Best facility on Long Island. The turf field rental was perfect for our team's pre-season prep.",
    author: "Travel Ball Coach",
  },
  {
    quote:
      "I've been working with Chris for two years. Going from JV to starting varsity is a testament to the quality of coaching here.",
    author: "High School Player",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            What Players &amp; Families Say
          </p>
          <h2 className="text-white text-4xl font-extrabold tracking-tight">
            Results That Speak for Themselves
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, author }) => (
            <div
              key={author}
              className="bg-navy-light rounded-2xl p-7 border border-white/10"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="mt-4 text-white/40 text-xs font-medium">
                — {author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-20 bg-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-navy text-4xl font-extrabold tracking-tight">
          Ready to Elevate Your Game?
        </h2>
        <p className="mt-4 text-navy/70 text-lg max-w-xl mx-auto">
          Book your first lesson today and start training with Long Island&apos;s
          most trusted baseball and softball coaches.
        </p>
        <Button
          render={<Link href="/book" />}
          size="lg"
          className="mt-8 bg-navy hover:bg-navy-light text-white font-bold text-base px-10"
        >
          Book Now <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Coaches />
      <Testimonials />
      <CTABanner />
    </>
  );
}
