import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, User } from "lucide-react";

export const metadata: Metadata = { title: "My Schedule — Coach Portal" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

const STATUS_STYLES: Record<string, string> = {
  confirmed:  "bg-green-50 text-green-700",
  pending:    "bg-yellow-50 text-yellow-700",
  completed:  "bg-gray-100 text-gray-500",
  cancelled:  "bg-red-50 text-red-400",
};

export default async function CoachSchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: coach } = await supabase
    .from("coaches")
    .select("id, name")
    .eq("profile_id", user!.id)
    .single();

  const now = new Date().toISOString();

  const { data: upcoming } = await supabase
    .from("bookings")
    .select(`
      id, start_at, end_at, status, notes,
      profiles ( full_name, phone ),
      services ( name, duration_minutes )
    `)
    .eq("coach_id", coach!.id)
    .gte("start_at", now)
    .in("status", ["confirmed", "pending"])
    .order("start_at")
    .limit(30);

  const { data: past } = await supabase
    .from("bookings")
    .select(`
      id, start_at, end_at, status,
      profiles ( full_name ),
      services ( name )
    `)
    .eq("coach_id", coach!.id)
    .lt("start_at", now)
    .order("start_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-navy text-2xl font-extrabold tracking-tight">My Schedule</h1>
        <p className="text-gray-500 text-sm mt-0.5">Upcoming sessions for {coach?.name}.</p>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="text-navy font-bold text-base">Upcoming</h2>
        {!upcoming?.length ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-8 text-center text-gray-400 text-sm">
            No upcoming sessions.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {upcoming.map((b) => {
              const profile = b.profiles as { full_name: string; phone: string } | null;
              const service = b.services as { name: string; duration_minutes: number } | null;
              return (
                <div key={b.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="bg-navy/5 rounded-lg p-2.5 shrink-0">
                    <CalendarDays size={18} className="text-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-navy font-semibold text-sm">{service?.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[b.status] ?? ""}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {formatDate(b.start_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatTime(b.start_at)} – {formatTime(b.end_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <User size={11} />
                      {profile?.full_name ?? "—"}
                      {profile?.phone ? ` · ${profile.phone}` : ""}
                    </div>
                    {b.notes && (
                      <p className="mt-1 text-xs text-gray-400 italic">"{b.notes}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past */}
      {!!past?.length && (
        <section className="space-y-3">
          <h2 className="text-navy font-bold text-base">Recent Past Sessions</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {past.map((b) => {
              const profile = b.profiles as { full_name: string } | null;
              const service = b.services as { name: string } | null;
              return (
                <div key={b.id} className="px-5 py-3 flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">{service?.name}</p>
                    <p className="text-gray-400 text-xs">{formatDate(b.start_at)} · {profile?.full_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[b.status] ?? ""}`}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
