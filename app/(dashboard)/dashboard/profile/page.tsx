import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user!.id)
    .single();

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">
          Profile
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage your account information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
        <h2 className="text-navy font-bold mb-6">Personal Information</h2>
        <ProfileForm
          userId={user!.id}
          email={user!.email ?? ""}
          initialFullName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
        />
      </div>

      {/* Account section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
        <h2 className="text-navy font-bold mb-1">Account</h2>
        <p className="text-gray-400 text-sm mb-5">
          Manage your login credentials.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-navy mb-1">Email address</p>
            <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2.5">
              {user!.email}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Contact support to change your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
