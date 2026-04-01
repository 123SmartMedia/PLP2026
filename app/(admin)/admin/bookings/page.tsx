import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Booking } from "@/types/database";
import BookingStatusButton from "./status-button";

export const metadata: Metadata = { title: "Admin — Bookings" };

type BookingRow = Booking & {
  coaches: { name: string } | null;
  services: { name: string } | null;
  profiles: { full_name: string | null } | null;
};

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    confirmed: "bg-green-100 text-green-700",
    pending:   "bg-yellow-100 text-yellow-700",
    cancelled: "bg-gray-100 text-gray-500",
    completed: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      coaches(name),
      services(name),
      profiles(full_name)
    `)
    .order("start_time", { ascending: false });

  const bookings = (rawBookings ?? []) as BookingRow[];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Bookings</h1>
        <p className="text-gray-500 text-sm mt-0.5">{bookings.length} total</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
          No bookings yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold">Service</th>
                  <th className="text-left px-5 py-3 font-semibold">Coach</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Price</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-navy font-medium">
                      {booking.profiles?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {booking.services?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {booking.coaches?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatDate(booking.start_time)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      ${(booking.total_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-4">
                      <BookingStatusButton
                        bookingId={booking.id}
                        currentStatus={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
