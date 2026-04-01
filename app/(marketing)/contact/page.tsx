import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Play Like a Pro Baseball in Hauppauge, NY. Questions about lessons, facility rentals, or clinics? We'd love to hear from you.",
};

const INFO = [
  {
    icon: MapPin,
    label: "Address",
    lines: ["123 Training Way", "Hauppauge, NY 11788"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["(631) 555-0100"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@playlikeaprobaseball.com"],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: [
      "Mon – Fri: 9 am – 9 pm",
      "Sat – Sun: 8 am – 6 pm",
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Let&apos;s Talk
          </p>
          <h1 className="text-white text-5xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Have a question about lessons, clinics, or facility rentals? Fill
            out the form and we&apos;ll get back to you within one business day.
          </p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Info column */}
            <div className="space-y-8">
              {INFO.map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-navy font-bold text-sm mb-0.5">{label}</p>
                    {lines.map((line) => (
                      <p key={line} className="text-gray-500 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Socials */}
              <div>
                <p className="text-navy font-bold text-sm mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-navy hover:bg-navy-light flex items-center justify-center transition-colors"
                    >
                      <Icon size={16} className="text-gold" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Map placeholder ───────────────────────────────────────────────── */}
      <section className="h-72 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="text-navy mx-auto mb-2" />
            <p className="text-navy font-semibold text-sm">
              123 Training Way, Hauppauge, NY 11788
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Embed a Google Maps iframe here
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
