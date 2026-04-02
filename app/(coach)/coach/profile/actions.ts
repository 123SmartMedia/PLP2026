"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCoachProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  const { error } = await supabase
    .from("coaches")
    .update({ phone, email })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/coach/profile");
  return { success: true };
}
