import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CoachToggle from "./coach-toggle";
import CreateLoginForm from "./create-login-form";

export const metadata: Metadata = { title: "Admin — Coaches" };

export default async function AdminCoachesPage() {
  const supabase = await createClient();

  const { data: coaches } = await supabase
    .from("coaches")
    .select("id, name, role, specialties, active, sort_order, profile_id, email")
    .order("sort_order");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Coaches</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage coaches, portal access, and active status.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {(coaches ?? []).map((coach) => (
          <div key={coach.id} className="px-5 py-4 space-y-2">
            <div className="flex items-center justify-between gap-4">
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

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-400 w-20 shrink-0">Portal access</span>
              <CreateLoginForm
                coachId={coach.id}
                coachName={coach.name}
                existingEmail={coach.email ?? null}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
