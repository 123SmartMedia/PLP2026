import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Meet the Play Like a Pro coaching staff. Experienced baseball and softball instructors serving Hauppauge, NY and Long Island.",
};

// ─── Coach Data ───────────────────────────────────────────────────────────────

const coaches = [
  {
    id: "chris-scura",
    name: "Chris Scura",
    role: "Lead Hitting Instructor",
    initials: "CS",
    sports: ["Baseball", "Softball"],
    specialties: ["Hitting", "Swing Mechanics", "Pitch Recognition"],
    bio: [
      "Coach Chris Scura is the lead hitting instructor at Play Like a Pro in Hauppauge, NY, where he works with baseball and softball players of all ages to develop consistent, game-ready swings. A veteran instructor at the facility for over a decade, Chris has become a trusted resource for Long Island athletes looking to elevate their offensive game and unlock their full potential.",
      "Drawing on his professional playing background in multiple independent leagues and his experience at respected college programs, Chris blends real-game insight with a modern, detail-oriented approach to hitting. He focuses on building efficient swing mechanics, improving pitch recognition, and developing an approach at the plate that translates under pressure.",
      "In each lesson, Chris uses a clear, positive, and player-first teaching style, making adjustments that match the athlete's age, ability level, and long-term goals. Whether he is working one-on-one or running small-group sessions, his sessions emphasize hard work, accountability, and confidence in the batter's box.",
    ],
    featured: true,
  },
  {
    id: "danny-russo",
    name: "Danny Russo",
    role: "Pitching Instructor",
    initials: "DR",
    sports: ["Baseball"],
    specialties: ["Pitching", "Arm Care", "Velocity Development"],
    bio: [
      "Coach Danny Russo brings over fifteen years of competitive pitching experience to the mound at Play Like a Pro. A former collegiate standout at a Division II program in the Northeast, Danny developed a reputation as one of the most reliable starters in his conference before transitioning into coaching full time.",
      "Danny's teaching philosophy centers on sustainable mechanics and long-term arm health. He works closely with pitchers of all ages to build repeatable deliveries, develop secondary offerings, and establish the mental toughness required to compete in high-leverage situations. His approach combines modern biomechanical principles with old-school baseball instincts.",
      "From youth pitchers learning to throw strikes to high school arms preparing for the college recruiting process, Danny meets athletes where they are and gives them the tools to reach the next level. His passion for the craft and genuine investment in each athlete's development make him one of the most sought-after pitching coaches on Long Island.",
    ],
    featured: false,
  },
  {
    id: "mike-deluca",
    name: "Mike DeLuca",
    role: "Infield & Baserunning Instructor",
    initials: "MD",
    sports: ["Baseball", "Softball"],
    specialties: ["Infield Defense", "Baserunning", "Fundamentals"],
    bio: [
      "Coach Mike DeLuca is one of the sharpest defensive minds on the Play Like a Pro staff. A former middle infielder who played four years of college ball and spent time in the independent professional circuit, Mike has an encyclopedic understanding of the craft on the dirt — footwork, reads, double play footwork, and the subtle angles that separate good infielders from great ones.",
      "Mike's lessons are fast-paced, rep-heavy, and detail-oriented. He believes that elite defense is built on habits and repetition, and he structures his sessions to ingrain the right movements until they become automatic. His baserunning instruction is equally thorough, covering reads, jumps, sliding technique, and decision-making on the bases.",
      "Mike works with players across all skill levels and age groups, from youth athletes learning the basics of fielding a ground ball to varsity and travel ball players looking to sharpen the finer points of their game. His energy and enthusiasm for defensive baseball are contagious on and off the field.",
    ],
    featured: false,
  },
  {
    id: "richie-falco",
    name: "Richie Falco",
    role: "Outfield & Catching Instructor",
    initials: "RF",
    sports: ["Baseball", "Softball"],
    specialties: ["Outfield Defense", "Catching", "Throwing Mechanics"],
    bio: [
      "Coach Richie Falco joined the Play Like a Pro staff after an impressive playing career that included four years as a starting catcher at the collegiate level and a brief stint in affiliated professional baseball. Richie's hands-on experience behind the plate gives him a unique perspective on the full defensive game — from blocking and framing to controlling the running game and managing a pitching staff.",
      "Richie is equally at home working with outfielders, where his strong throwing background and understanding of routes and reads have helped countless Long Island athletes develop into dependable defenders. His sessions are known for their attention to detail and his ability to break down complex movements into simple, teachable cues.",
      "Whether he's working with a 10-year-old learning to receive for the first time or a high school catcher trying to cut down pop times, Richie brings the same focused intensity and genuine care to every single lesson. He is one of the most versatile and well-rounded instructors at the facility.",
    ],
    featured: false,
  },
  {
    id: "anthony-marino",
    name: "Anthony Marino",
    role: "Softball Specialist & Hitting Instructor",
    initials: "AM",
    sports: ["Softball", "Baseball"],
    specialties: ["Softball Hitting", "Fastpitch Mechanics", "Youth Development"],
    bio: [
      "Coach Anthony Marino is Play Like a Pro's dedicated softball specialist, bringing a deep understanding of the fastpitch game to every lesson and clinic. Anthony played competitive fastpitch through high school and coached at the travel ball and high school varsity levels for nearly a decade before joining the facility full time.",
      "Anthony's softball-specific hitting instruction addresses the unique timing and mechanical demands of hitting off a rise ball, drop, and changeup. He works closely with players on loading, hip rotation, and bat path adjustments that translate directly into better contact and more consistent at-bats. His background also makes him an excellent resource for parents navigating the travel ball and recruiting landscape.",
      "Beyond hitting, Anthony offers comprehensive softball fundamentals lessons covering base running, outfield play, and softball-specific fielding. He is deeply committed to the growth of the sport on Long Island and is known for creating a welcoming, encouraging environment where players of all ages and abilities can thrive.",
    ],
    featured: false,
  },
];

// ─── Coach Card ───────────────────────────────────────────────────────────────

function CoachCard({ coach }: { coach: typeof coaches[number] }) {
  if (coach.featured) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden lg:flex">
        <div className="bg-navy lg:w-72 shrink-0 flex flex-col items-center justify-center py-12 px-8">
          <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-gold flex items-center justify-center text-white font-bold text-3xl mb-4">
            {coach.initials}
          </div>
          <h2 className="text-white text-xl font-bold text-center">{coach.name}</h2>
          <p className="text-gold text-sm font-semibold text-center mt-1">{coach.role}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {coach.sports.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="p-8 lg:p-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {coach.specialties.map((s) => (
              <span key={s} className="text-xs px-3 py-1 rounded-full bg-navy/10 text-navy font-medium">
                {s}
              </span>
            ))}
          </div>
          <div className="space-y-4">
            {coach.bio.map((para, i) => (
              <p key={i} className="text-gray-500 text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <Button
            render={<Link href="/book" />}
            className="mt-8 bg-gold hover:bg-gold-light text-navy font-bold"
          >
            Book with {coach.name.split(" ")[0]} <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-navy h-2" />
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg shrink-0">
            {coach.initials}
          </div>
          <div>
            <h2 className="text-navy text-lg font-bold">{coach.name}</h2>
            <p className="text-gold text-sm font-semibold">{coach.role}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {coach.sports.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {coach.specialties.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-navy/8 text-navy font-medium bg-navy/10">
              {s}
            </span>
          ))}
        </div>

        <div className="space-y-3 flex-1">
          {coach.bio.map((para, i) => (
            <p key={i} className="text-gray-500 text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <Button
          render={<Link href="/book" />}
          className="mt-6 bg-navy hover:bg-navy-light text-white font-semibold w-full justify-center"
        >
          Book with {coach.name.split(" ")[0]}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoachesPage() {
  const [featured, ...rest] = coaches;

  return (
    <>
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            The Staff
          </p>
          <h1 className="text-white text-5xl font-extrabold tracking-tight">
            Meet Your Coaches
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Every instructor at Play Like a Pro brings real competitive
            experience and a genuine passion for player development. Our coaches
            don&apos;t just teach the game — they&apos;ve lived it.
          </p>
        </div>
      </section>

      {/* Coaches */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Featured coach */}
          <CoachCard coach={featured} />

          {/* Rest of staff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rest.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-navy text-4xl font-extrabold tracking-tight">
            Find the Right Coach for Your Game
          </h2>
          <p className="mt-4 text-navy/70 text-lg max-w-xl mx-auto">
            Not sure who to book with? Reach out and we&apos;ll match you with
            the instructor that fits your position, sport, and goals.
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
    </>
  );
}
