import type { Metadata } from "next";
import CoachForm from "../coach-form";

export const metadata: Metadata = { title: "Add Coach — Admin" };

export default function NewCoachPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">Add Coach</h1>
        <p className="text-gray-500 text-sm mt-0.5">Create a new coach profile.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <CoachForm />
      </div>
    </div>
  );
}
