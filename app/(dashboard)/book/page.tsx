import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Service, Coach } from "@/types/database";
import BookingWizard from "./booking-wizard";

export const metadata: Metadata = { title: "Book a Session" };

export default async function BookPage() {
  const supabase = await createClient();

  const [{ data: services }, { data: coaches }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("type")
      .order("duration_minutes"),
    supabase
      .from("coaches")
      .select("*")
      .eq("active", true)
      .order("sort_order"),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">
          Book a Session
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Choose your service, coach, and time.
        </p>
      </div>

      <BookingWizard
        services={(services ?? []) as Service[]}
        coaches={(coaches ?? []) as Coach[]}
      />
    </div>
  );
}
