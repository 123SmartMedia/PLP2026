import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Target, Zap, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Baseball and softball lessons, group clinics, and facility rentals in Hauppauge, NY. Hitting, pitching, and fielding instruction for all ages and skill levels.",
};

// ─── Page Header ─────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <section className="bg-navy py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
          What We Offer
        </p>
        <h1 className="text-white text-5xl font-extrabold tracking-tight">
          Training Services
        </h1>
        <p className="mt-4 text-white/70 text-lg max-w-2xl">
          Individual lessons, group clinics, and premier facility rentals for
          baseball and softball players of all ages and skill levels on Long
          Island.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: "Hitting", href: "#hitting" },
            { label: "Pitching", href: "#pitching" },
            { label: "Fielding", href: "#fielding" },
            { label: "Clinics", href: "#clinics" },
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

// ─── Lessons Section ─────────────────────────────────────────────────────────

const lessonTypes = [
  {
    id: "hitting",
    icon: Zap,
    title: "Hitting",
    tagline: "Build a swing that holds up under pressure.",
    description:
      "Our hitting instruction focuses on building efficient swing mechanics, improving pitch recognition, and developing a disciplined approach at the plate. Every lesson is tailored to the player's age, skill level, and specific goals — from fixing a fundamental flaw to preparing for the next level.",
    bullets: [
      "Swing mechanics and bat path",
      "Pitch recognition and plate discipline",
      "Tee work, soft toss, and live at-bats",
      "Video analysis available",
      "Youth through college-level athletes",
    ],
  },
  {
    id: "pitching",
    icon: Target,
    title: "Pitching",
    tagline: "Command, velocity, and confidence on the mound.",
    description:
      "Pitching lessons cover everything from foundational mechanics for younger players to advanced pitch development for high school and college athletes. Our coaches work on delivery, arm care, grip and spin, and the mental approach needed to compete at every level.",
    bullets: [
      "Pitching mechanics and delivery",
      "Fastball command and off-speed development",
      "Arm care and long-toss program",
      "Pickoff moves and fielding as a pitcher",
      "Baseball and softball pitching",
    ],
  },
  {
    id: "fielding",
    icon: Shield,
    title: "Fielding",
    tagline: "Glove work that earns you a spot in the lineup.",
    description:
      "Fielding lessons develop the footwork, hands, and instincts players need to be reliable defenders. Whether you're an infielder, outfielder, or catcher, our coaches build the fundamentals that translate directly into game performance.",
    bullets: [
      "Infield and outfield positioning",
      "Footwork, first-step quickness, and range",
      "Throwing mechanics and arm strength",
      "Catcher blocking, framing, and pop time",
      "Double play footwork and relay throws",
    ],
  },
];

function LessonsSection() {
  return (
    <section id="lessons" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Individual &amp; Small Group
          </p>
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Private Lessons
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Work one-on-one or in small groups with our experienced coaches.
            Sessions run 30 or 60 minutes and are available for baseball and
            softball players at all levels.
          </p>
        </div>

        <div className="space-y-16">
          {lessonTypes.map(({ id, icon: Icon, title, tagline, description, bullets }) => (
            <div
              key={id}
              id={id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start scroll-mt-24"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                    <Icon size={20} className="text-navy" />
                  </div>
                  <h3 className="text-navy text-2xl font-bold">{title}</h3>
                </div>
                <p className="text-gold font-semibold text-sm mb-3">{tagline}</p>
                <p className="text-gray-500 leading-relaxed">{description}</p>
                <Button
                  render={<Link href="/book" />}
                  className="mt-6 bg-navy hover:bg-navy-light text-white font-semibold"
                >
                  Book a {title} Lesson <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-7">
                <p className="text-navy font-semibold text-sm uppercase tracking-widest mb-4">
                  What&apos;s Covered
                </p>
                <ul className="space-y-3">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-1 w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold block" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Clinics Section ──────────────────────────────────────────────────────────

const clinicFormats = [
  {
    title: "Skills Clinics",
    description:
      "Position-specific or skill-focused group sessions. Great for players who want high-quality coaching at a lower cost than private lessons.",
  },
  {
    title: "Team Clinics",
    description:
      "On-site group training for travel ball teams, high school programs, and youth leagues. We come to you or host at our Hauppauge facility.",
  },
  {
    title: "Seasonal Camps",
    description:
      "Multi-day intensives run during school breaks. Full-day and half-day formats. Appropriate for ages 6 and up.",
  },
];

function ClinicsSection() {
  return (
    <section id="clinics" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
              Group Training
            </p>
            <h2 className="text-navy text-4xl font-extrabold tracking-tight mb-4">
              Clinics &amp; Camps
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Our group sessions bring the same high-quality coaching as private
              lessons in a team-oriented environment. Clinics build
              fundamentals, create competition, and develop the mental
              toughness that makes players better teammates and competitors.
            </p>
            <p className="text-gray-500 leading-relaxed mt-4">
              All clinics are run by our coaching staff and capped at small
              group sizes to ensure every athlete gets individual attention and
              quality reps.
            </p>
            <Button
              render={<Link href="/book" />}
              className="mt-8 bg-gold hover:bg-gold-light text-navy font-bold"
            >
              Inquire About Clinics <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {clinicFormats.map(({ title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users size={18} className="text-navy shrink-0" />
                  <h3 className="text-navy font-bold">{title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Facility CTA ─────────────────────────────────────────────────────────────

function FacilityCTA() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
              Also Available
            </p>
            <h2 className="text-white text-3xl font-extrabold tracking-tight">
              Facility Rentals
            </h2>
            <p className="mt-3 text-white/70 max-w-lg">
              Rent our batting cages or indoor turf field by the hour for team
              practices, showcase prep, or extra work on your own schedule.
            </p>
          </div>
          <Button
            render={<Link href="/facility" />}
            size="lg"
            className="bg-gold hover:bg-gold-light text-navy font-bold shrink-0 px-8"
          >
            View Facility <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Booking CTA ──────────────────────────────────────────────────────────────

function BookingCTA() {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-navy text-4xl font-extrabold tracking-tight">
          Ready to Get Started?
        </h2>
        <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
          Book a lesson online or reach out to learn more about our programs.
          First-time players and returning athletes are always welcome.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            render={<Link href="/book" />}
            size="lg"
            className="bg-navy hover:bg-navy-light text-white font-bold px-10"
          >
            Book a Lesson
          </Button>
          <Button
            render={<Link href="/coaches" />}
            size="lg"
            variant="outline"
            className="border-navy/30 text-navy font-semibold px-8"
          >
            Meet the Coaches
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      <PageHeader />
      <LessonsSection />
      <ClinicsSection />
      <FacilityCTA />
      <BookingCTA />
    </>
  );
}
