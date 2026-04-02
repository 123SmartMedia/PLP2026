"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function uploadPhoto(file: File, coachSlug: string): Promise<string | null> {
  const admin = getAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${coachSlug}-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage
    .from("coach-photos")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) return null;

  const { data } = admin.storage.from("coach-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function createCoach(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const specialties = (formData.get("specialties") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const sports = (formData.get("sports") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const sort_order = parseInt(formData.get("sort_order") as string) || 99;
  const photo = formData.get("photo") as File | null;

  const slug = toSlug(name);
  let image_url: string | null = null;

  if (photo && photo.size > 0) {
    image_url = await uploadPhoto(photo, slug);
  }

  const { error } = await supabase.from("coaches").insert({
    name, slug, role, bio, phone, email,
    specialties, sports, sort_order,
    image_url, active: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/coaches");
  redirect("/admin/coaches");
}

export async function updateCoach(coachId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const specialties = (formData.get("specialties") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const sports = (formData.get("sports") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const sort_order = parseInt(formData.get("sort_order") as string) || 99;
  const photo = formData.get("photo") as File | null;

  const slug = toSlug(name);
  const updates: Record<string, unknown> = {
    name, slug, role, bio, phone, email,
    specialties, sports, sort_order,
  };

  if (photo && photo.size > 0) {
    const image_url = await uploadPhoto(photo, slug);
    if (image_url) updates.image_url = image_url;
  }

  const { error } = await supabase.from("coaches").update(updates).eq("id", coachId);
  if (error) return { error: error.message };

  revalidatePath("/admin/coaches");
  redirect("/admin/coaches");
}

export async function deleteCoach(coachId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("coaches").delete().eq("id", coachId);
  if (error) return { error: error.message };

  revalidatePath("/admin/coaches");
  redirect("/admin/coaches");
}
