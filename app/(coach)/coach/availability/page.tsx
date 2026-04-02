import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AvailabilityEditor from "./availability-editor";

export const metadata: Metadata = { title: "Availability — Coach Portal" };

export default async function CoachAvailabilityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("profile_id", user!.id)
    .single();

  const { data: rows } = await supabase
    .from("availability")
    .select("day_of_week, start_time, end_time")
    .eq("coach_id", coach!.id)
    .order("day_of_week")
    .order("start_time");

  const initial = (rows ?? []).map((r) => ({
    day: r.day_of_week,
    start: r.start_time.slice(0, 5), // "HH:MM"
    end: r.end_time.slice(0, 5),
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Availability</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Set your weekly recurring hours. Customers can only book within these windows.
        </p>
      </div>
      <AvailabilityEditor coachId={coach!.id} initial={initial} />
    </div>
  );
}
