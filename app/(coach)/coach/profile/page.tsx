import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export const metadata: Metadata = { title: "My Profile — Coach Portal" };

export default async function CoachProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: coach } = await supabase
    .from("coaches")
    .select("name, email, phone, role")
    .eq("profile_id", user!.id)
    .single();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Update your contact info for booking notifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Name</p>
          <p className="text-navy font-semibold">{coach?.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{coach?.role}</p>
        </div>
        <hr className="border-gray-100" />
        <ProfileForm phone={coach?.phone ?? ""} email={coach?.email ?? ""} />
      </div>
    </div>
  );
}
