"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  User,
  Clock,
  Ban,
  Menu,
  X,
  LogOut,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "My Schedule",   href: "/coach",              icon: CalendarDays, exact: true },
  { label: "Availability",  href: "/coach/availability", icon: Clock },
  { label: "Blocked Times", href: "/coach/blocked",      icon: Ban },
  { label: "My Profile",    href: "/coach/profile",      icon: User },
];

function NavLink({
  href,
  icon: Icon,
  label,
  exact = false,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-gold/15 text-gold"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {label}
    </Link>
  );
}

export default function CoachSidebar({ coachName }: { coachName: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6 border-b border-white/10">
        <Link href="/coach" className="flex items-center gap-2">
          <Trophy size={18} className="text-gold" />
          <span className="text-white font-bold text-lg tracking-tight">Coach Portal</span>
        </Link>
        <p className="text-white/40 text-xs mt-1 truncate">{coachName}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            exact={item.exact}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 bg-navy min-h-screen sticky top-0">
        {content}
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy border-b border-white/10 flex items-center justify-between px-4 h-14">
        <span className="text-white font-bold text-base">Coach Portal</span>
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-navy h-full">{content}</div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
