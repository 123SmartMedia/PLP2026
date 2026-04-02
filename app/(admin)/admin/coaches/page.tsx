import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import CoachToggle from "./coach-toggle";
import CreateLoginForm from "./create-login-form";

export const metadata: Metadata = { title: "Admin — Coaches" };

export default async function AdminCoachesPage() {
  const supabase = await createClient();

  const { data: coaches } = await supabase
    .from("coaches")
    .select("id, name, role, specialties, active, sort_order, profile_id, email, image_url")
    .order("sort_order");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-navy text-2xl font-extrabold tracking-tight">Coaches</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage coach profiles, portal access, and active status.</p>
        </div>
        <Link
          href="/admin/coaches/new"
          className="flex items-center gap-2 bg-gold text-navy text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
        >
          <Plus size={16} />
          Add Coach
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {(coaches ?? []).map((coach) => (
          <div key={coach.id} className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-navy/10 overflow-hidden shrink-0 flex items-center justify-center">
                {coach.image_url ? (
                  <Image
                    src={coach.image_url}
                    alt={coach.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-navy font-bold text-lg">
                    {coach.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-navy font-semibold text-sm">{coach.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{coach.role ?? "Instructor"}</p>
                {coach.specialties?.length > 0 && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    {(coach.specialties as string[]).join(" · ")}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/coaches/${coach.id}/edit`}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy font-medium transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </Link>
                <CoachToggle coachId={coach.id} active={coach.active} />
              </div>
            </div>

            {/* Portal access row */}
            <div className="flex items-center gap-2 pl-16">
              <span className="text-xs text-gray-400 w-20 shrink-0">Portal access</span>
              <CreateLoginForm
                coachId={coach.id}
                coachName={coach.name}
                existingEmail={coach.email ?? null}
              />
            </div>
          </div>
        ))}

        {!coaches?.length && (
          <div className="px-5 py-10 text-center text-gray-400 text-sm">
            No coaches yet.{" "}
            <Link href="/admin/coaches/new" className="text-gold hover:underline">
              Add your first coach.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
