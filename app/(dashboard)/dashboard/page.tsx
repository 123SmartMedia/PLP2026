import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, CheckCircle2, PlusCircle } from "lucide-react";
import type { Booking } from "@/types/database";

type BookingWithRelations = Booking & {
  coaches: { name: string } | null;
  services: { name: string; duration_minutes: number } | null;
};

export const metadata: Metadata = { title: "Dashboard" };

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-gray-100 text-gray-500",
    completed: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      coaches(name),
      services(name, duration_minutes)
    `)
    .eq("user_id", user!.id)
    .order("start_time", { ascending: true });

  const bookings = rawBookings as BookingWithRelations[] | null;

  const now = new Date().toISOString();
  const upcoming = (bookings ?? []).filter(
    (b) => b.start_time >= now && b.status !== "cancelled"
  );
  const past = (bookings ?? []).filter(
    (b) => b.start_time < now || b.status === "completed"
  );
  const nextSession = upcoming[0] ?? null;

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-navy text-2xl font-extrabold tracking-tight">
            Hey, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Here&apos;s what&apos;s coming up.
          </p>
        </div>
        <Link
          href="/book"
          className="hidden sm:flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Book a Lesson
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: CalendarDays,
            label: "Upcoming",
            value: upcoming.length,
            color: "text-navy",
          },
          {
            icon: CheckCircle2,
            label: "Completed",
            value: past.filter((b) => b.status === "completed").length,
            color: "text-green-600",
          },
          {
            icon: Clock,
            label: "Total Sessions",
            value: (bookings ?? []).length,
            color: "text-gold",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy">{value}</p>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next session */}
      {nextSession ? (
        <div className="bg-navy rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
              Next Session
            </p>
            <p className="text-white text-lg font-bold">
              {(nextSession as BookingWithRelations).services?.name ?? "Lesson"}
            </p>
            <p className="text-white/60 text-sm mt-0.5">
              {(nextSession as BookingWithRelations).coaches?.name
                ? `with ${(nextSession as BookingWithRelations).coaches?.name} · `
                : ""}
              {formatDate(nextSession.start_time)}
            </p>
          </div>
          <StatusBadge status={nextSession.status} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-navy font-semibold mb-1">No upcoming sessions</p>
          <p className="text-gray-400 text-sm mb-4">
            Book a lesson to get started.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            <PlusCircle size={15} />
            Book Now
          </Link>
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-navy font-bold text-base">Recent Bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="text-gold text-sm font-semibold hover:text-gold-dark transition-colors"
          >
            View all
          </Link>
        </div>

        {(bookings ?? []).length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center text-gray-400 text-sm">
            No bookings yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {(bookings ?? []).slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between px-5 py-4 gap-4"
              >
                <div className="min-w-0">
                  <p className="text-navy text-sm font-semibold truncate">
                    {(booking as BookingWithRelations).services?.name ?? "Lesson"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {formatDate(booking.start_time)}
                    {(booking as BookingWithRelations).coaches?.name
                      ? ` · ${(booking as BookingWithRelations).coaches?.name}`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
