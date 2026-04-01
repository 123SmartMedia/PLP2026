import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { Booking } from "@/types/database";
import CancelBookingButton from "./cancel-button";

type BookingWithRelations = Booking & {
  coaches: { name: string } | null;
  services: { name: string; duration_minutes: number } | null;
};

export const metadata: Metadata = { title: "My Bookings" };

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
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      coaches(name),
      services(name, duration_minutes)
    `)
    .eq("user_id", user!.id)
    .order("start_at", { ascending: false });

  const bookings = rawBookings as BookingWithRelations[] | null;

  const now = new Date().toISOString();
  const upcoming = (bookings ?? []).filter(
    (b) => b.start_at >= now && b.status !== "cancelled"
  );
  const past = (bookings ?? []).filter(
    (b) => b.start_at < now || b.status === "cancelled" || b.status === "completed"
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">
          My Bookings
        </h1>
        <Link
          href="/book"
          className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Book a Lesson
        </Link>
      </div>

      {/* Upcoming */}
      <section>
        <h2 className="text-navy font-bold text-sm uppercase tracking-widest mb-4">
          Upcoming ({upcoming.length})
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">No upcoming sessions.</p>
            <Link
              href="/book"
              className="mt-3 inline-flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold-dark transition-colors"
            >
              <PlusCircle size={14} /> Book one now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-navy font-bold">
                        {(booking as BookingWithRelations).services?.name ?? "Lesson"}
                      </p>
                      <StatusBadge status={booking.status} />
                    </div>
                    {(booking as BookingWithRelations).coaches?.name && (
                      <p className="text-gray-500 text-sm mt-0.5">
                        with {(booking as BookingWithRelations).coaches?.name}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      {formatDate(booking.start_at)}
                    </p>
                    {(booking as BookingWithRelations).services?.duration_minutes && (
                      <p className="text-gray-400 text-xs mt-0.5">
                        {(booking as BookingWithRelations).services?.duration_minutes} min ·{" "}
                        {formatPrice(booking.price_cents)}
                      </p>
                    )}
                    {booking.notes && (
                      <p className="text-gray-400 text-xs mt-1 italic">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  {booking.status !== "cancelled" && (
                    <CancelBookingButton bookingId={booking.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-navy font-bold text-sm uppercase tracking-widest mb-4">
            Past & Cancelled ({past.length})
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {past.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between px-5 py-4 gap-4 opacity-70"
              >
                <div className="min-w-0">
                  <p className="text-navy text-sm font-semibold truncate">
                    {(booking as BookingWithRelations).services?.name ?? "Lesson"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {formatDate(booking.start_at)}
                    {(booking as BookingWithRelations).coaches?.name
                      ? ` · ${(booking as BookingWithRelations).coaches?.name}`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
