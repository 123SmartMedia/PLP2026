import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CoachForm from "../../coach-form";

export const metadata: Metadata = { title: "Edit Coach — Admin" };

export default async function EditCoachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: coach } = await supabase
    .from("coaches")
    .select("id, name, role, bio, phone, email, specialties, sports, sort_order, image_url")
    .eq("id", id)
    .single();

  if (!coach) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Edit Coach</h1>
        <p className="text-gray-500 text-sm mt-0.5">{coach.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <CoachForm coach={coach} />
      </div>
    </div>
  );
}
