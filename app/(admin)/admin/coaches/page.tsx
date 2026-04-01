import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CoachToggle from "./coach-toggle";

export const metadata: Metadata = { title: "Admin — Coaches" };

export default async function AdminCoachesPage() {
  const supabase = await createClient();

  const { data: coaches } = await supabase
    .from("coaches")
    .select("id, name, role, specialties, active, sort_order")
    .order("sort_order");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Coaches</h1>
        <p className="text-gray-500 text-sm mt-0.5">Toggle coaches active/inactive.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {(coaches ?? []).map((coach) => (
          <div key={coach.id} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="min-w-0">
              <p className="text-navy font-semibold text-sm">{coach.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{coach.role ?? "Instructor"}</p>
              {coach.specialties?.length > 0 && (
                <p className="text-gray-400 text-xs mt-0.5">
                  {(coach.specialties as string[]).join(" · ")}
                </p>
              )}
            </div>
            <CoachToggle coachId={coach.id} active={coach.active} />
          </div>
        ))}
      </div>
    </div>
  );
}
