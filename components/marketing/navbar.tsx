"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Coaches", href: "/coaches" },
  { label: "Facility", href: "/facility" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-bold text-xl tracking-tight">
              Play Like a <span className="text-gold">Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              render={<Link href="/book" />}
              className="bg-gold hover:bg-gold-light text-navy font-semibold"
            >
              Book a Lesson
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white text-base font-medium py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button
            render={<Link href="/book" onClick={() => setMobileOpen(false)} />}
            className="bg-gold hover:bg-gold-light text-navy font-semibold mt-2"
          >
            Book a Lesson
          </Button>
        </div>
      )}
    </header>
  );
}
