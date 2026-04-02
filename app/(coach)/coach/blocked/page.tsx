import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BlockedTimesClient from "./blocked-times-client";

export const metadata: Metadata = { title: "Blocked Times — Coach Portal" };

export default async function CoachBlockedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("profile_id", user!.id)
    .single();

  const { data: blocked } = await supabase
    .from("blocked_times")
    .select("id, start_at, end_at, reason")
    .eq("coach_id", coach!.id)
    .gte("end_at", new Date().toISOString())
    .order("start_at");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Blocked Times</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Block out specific times you're unavailable. These override your weekly schedule.
        </p>
      </div>
      <BlockedTimesClient blocked={blocked ?? []} />
    </div>
  );
}
