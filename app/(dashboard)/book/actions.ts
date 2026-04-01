"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type Slot = { start: string; end: string; label: string };

// Default hours when no coach is required (facility rentals)
const DEFAULT_OPEN = "08:00";
const DEFAULT_CLOSE = "20:00";

function toLabel(totalMins: number): string {
  const h12 = totalMins % (12 * 60) === 0 ? 12 : Math.floor((totalMins % (12 * 60)) / 60);
  const m = (totalMins % 60).toString().padStart(2, "0");
  const period = totalMins < 12 * 60 ? "AM" : "PM";
  return `${h12}:${m} ${period}`;
}

export async function getAvailableSlots(
  serviceId: string,
  durationMinutes: number,
  date: string,          // YYYY-MM-DD
  coachId: string | null
): Promise<Slot[]> {
  const supabase = await createClient();

  let windowStart = DEFAULT_OPEN;
  let windowEnd = DEFAULT_CLOSE;

  if (coachId) {
    // Use date string at noon to avoid TZ day shift
    const dayOfWeek = new Date(`${date}T12:00:00`).getDay();

    const { data: avail } = await supabase
      .from("availability")
      .select("start_time, end_time")
      .eq("coach_id", coachId)
      .eq("day_of_week", dayOfWeek)
      .eq("active", true)
      .limit(1)
      .single();

    if (!avail) return [];
    windowStart = (avail.start_time as string).slice(0, 5);
    windowEnd = (avail.end_time as string).slice(0, 5);
  }

  const [sh, sm] = windowStart.split(":").map(Number);
  const [eh, em] = windowEnd.split(":").map(Number);
  const winStart = sh * 60 + sm;
  const winEnd = eh * 60 + em;

  // Generate candidate slots every 30 minutes
  const candidates: Slot[] = [];
  for (let m = winStart; m + durationMinutes <= winEnd; m += 30) {
    const endMins = m + durationMinutes;
    const pad = (n: number) => String(n).padStart(2, "0");
    candidates.push({
      start: `${date}T${pad(Math.floor(m / 60))}:${pad(m % 60)}:00`,
      end:   `${date}T${pad(Math.floor(endMins / 60))}:${pad(endMins % 60)}:00`,
      label: toLabel(m),
    });
  }

  if (candidates.length === 0) return candidates;

  // Remove slots that overlap existing bookings for this coach
  if (coachId) {
    const { data: existing } = await supabase
      .from("bookings")
      .select("start_at, end_at")
      .eq("coach_id", coachId)
      .neq("status", "cancelled")
      .gte("start_at", `${date}T00:00:00`)
      .lte("start_at", `${date}T23:59:59`);

    if (existing && existing.length > 0) {
      return candidates.filter((slot) =>
        !existing.some((b) => {
          const bS = new Date(b.start_at as string).getTime();
          const bE = new Date(b.end_at as string).getTime();
          const sS = new Date(slot.start).getTime();
          const sE = new Date(slot.end).getTime();
          return sS < bE && sE > bS;
        })
      );
    }
  }

  return candidates;
}

export async function createBooking(data: {
  serviceId: string;
  coachId: string | null;
  startAt: string;
  endAt: string;
  priceCents: number;
  notes: string;
}): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("bookings").insert({
    user_id: user.id,
    service_id: data.serviceId,
    coach_id: data.coachId,
    start_at: data.startAt,
    end_at: data.endAt,
    price_cents: data.priceCents,
    notes: data.notes || null,
    status: "pending",
  });

  if (error) return { error: error.message };

  redirect("/dashboard/bookings");
}
