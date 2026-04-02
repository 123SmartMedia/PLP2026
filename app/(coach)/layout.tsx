import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CoachSidebar from "@/components/coach/sidebar";

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "coach") redirect("/dashboard");

  // Fetch the coach record linked to this user
  const { data: coach } = await supabase
    .from("coaches")
    .select("name")
    .eq("profile_id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoachSidebar coachName={coach?.name ?? "Coach"} />
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8">{children}</main>
    </div>
  );
}
