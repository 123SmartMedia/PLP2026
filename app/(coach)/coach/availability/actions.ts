"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function saveAvailability(coachId: string, slots: { day: number; start: string; end: string }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Delete all existing availability for this coach, then re-insert
  await supabase.from("availability").delete().eq("coach_id", coachId);

  if (slots.length > 0) {
    const { error } = await supabase.from("availability").insert(
      slots.map((s) => ({
        coach_id: coachId,
        day_of_week: s.day,
        start_time: s.start,
        end_time: s.end,
        active: true,
      }))
    );
    if (error) return { error: error.message };
  }

  revalidatePath("/coach/availability");
  return { success: true };
}

export { DAYS };
