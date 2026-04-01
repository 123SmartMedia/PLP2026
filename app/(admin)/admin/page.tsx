import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("status, total_cents");

  const all = bookings ?? [];
  const pending   = all.filter((b) => b.status === "pending").length;
  const confirmed = all.filter((b) => b.status === "confirmed").length;
  const completed = all.filter((b) => b.status === "completed").length;
  const cancelled = all.filter((b) => b.status === "cancelled").length;
  const revenue   = all
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.total_cents ?? 0), 0);

  const stats = [
    { label: "Pending",   value: pending,   icon: Clock,         color: "text-yellow-500" },
    { label: "Confirmed", value: confirmed, icon: CalendarDays,  color: "text-blue-500" },
    { label: "Completed", value: completed, icon: CheckCircle2,  color: "text-green-600" },
    { label: "Cancelled", value: cancelled, icon: XCircle,       color: "text-gray-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">All bookings across the platform.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
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

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue (completed)</p>
        <p className="text-navy text-4xl font-extrabold">
          ${(revenue / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
