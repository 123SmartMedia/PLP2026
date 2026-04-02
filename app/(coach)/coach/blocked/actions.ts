"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBlockedTime(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!coach) return { error: "Coach not found" };

  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const reason = formData.get("reason") as string;

  const start_at = `${date}T${startTime}:00`;
  const end_at = `${date}T${endTime}:00`;

  if (end_at <= start_at) return { error: "End time must be after start time" };

  const { error } = await supabase.from("blocked_times").insert({
    coach_id: coach.id,
    start_at,
    end_at,
    reason: reason || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/coach/blocked");
  return { success: true };
}

export async function removeBlockedTime(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("blocked_times")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/coach/blocked");
  return { success: true };
}
