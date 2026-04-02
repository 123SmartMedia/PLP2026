"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function createCoachLogin(coachId: string, email: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const admin = getAdminClient();

  // Create the auth user and send invite email
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role: "coach" },
  });

  if (createError) return { error: createError.message };

  // Set profile role to coach
  await admin
    .from("profiles")
    .update({ role: "coach" })
    .eq("id", newUser.user.id);

  // Link coach record to this auth user
  const { error: linkError } = await admin
    .from("coaches")
    .update({ profile_id: newUser.user.id, email })
    .eq("id", coachId);

  if (linkError) return { error: linkError.message };

  // Send password reset so the coach can set their own password
  await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/coach` },
  });

  revalidatePath("/admin/coaches");
  return { success: true };
}

export async function removeCoachLogin(coachId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const admin = getAdminClient();

  const { data: coach } = await admin
    .from("coaches")
    .select("profile_id")
    .eq("id", coachId)
    .single();

  if (!coach?.profile_id) return { error: "No login found for this coach" };

  // Remove the auth user (cascades to profile)
  await admin.auth.admin.deleteUser(coach.profile_id);

  // Unlink coach record
  await admin
    .from("coaches")
    .update({ profile_id: null, email: null })
    .eq("id", coachId);

  revalidatePath("/admin/coaches");
  return { success: true };
}
