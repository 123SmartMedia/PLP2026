import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  Training: [
    { label: "Hitting Lessons", href: "/services#hitting" },
    { label: "Pitching Lessons", href: "/services#pitching" },
    { label: "Fielding Lessons", href: "/services#fielding" },
    { label: "Group Clinics", href: "/services#clinics" },
  ],
  Facility: [
    { label: "Batting Cage Rental", href: "/facility#cage" },
    { label: "Turf Field Rental", href: "/facility#turf" },
    { label: "Book a Session", href: "/book" },
  ],
  Company: [
    { label: "Our Coaches", href: "/coaches" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-white font-bold text-xl mb-3">
              Play Like a <span className="text-gold">Pro</span>
            </p>
            <p className="text-sm leading-relaxed">
              Professional baseball &amp; softball training in Hauppauge, NY.
              Individual lessons, group clinics, and facility rentals.
            </p>
            <div className="flex gap-4 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white/50 hover:text-gold transition-colors"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Play Like a Pro. All rights
            reserved.
          </p>
          <p>Hauppauge, NY</p>
        </div>
      </div>
    </footer>
  );
}
