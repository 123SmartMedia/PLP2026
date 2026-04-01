"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Booking } from "@/types/database";

type Status = Booking["status"];

const TRANSITIONS: Record<Status, { label: string; next: Status; color: string }[]> = {
  pending: [
    { label: "Confirm",  next: "confirmed", color: "text-green-600 hover:text-green-700" },
    { label: "Cancel",   next: "cancelled", color: "text-red-500 hover:text-red-600" },
  ],
  confirmed: [
    { label: "Complete", next: "completed", color: "text-blue-600 hover:text-blue-700" },
    { label: "Cancel",   next: "cancelled", color: "text-red-500 hover:text-red-600" },
  ],
  completed: [],
  cancelled: [],
};

export default function BookingStatusButton({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<Status | null>(null);

  const actions = TRANSITIONS[currentStatus];
  if (actions.length === 0) return <span className="text-gray-300 text-xs">—</span>;

  async function update(next: Status) {
    setLoading(next);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase
      .from("bookings")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-3">
      {actions.map(({ label, next, color }) => (
        <button
          key={next}
          onClick={() => update(next)}
          disabled={loading !== null}
          className={`text-xs font-semibold transition-colors disabled:opacity-50 ${color}`}
        >
          {loading === next ? "…" : label}
        </button>
      ))}
    </div>
  );
}
