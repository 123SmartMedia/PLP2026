"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function CoachToggle({
  coachId,
  active,
}: {
  coachId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(active);

  async function toggle() {
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase
      .from("coaches")
      .update({ active: !current, updated_at: new Date().toISOString() })
      .eq("id", coachId);
    setCurrent((p) => !p);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        current ? "bg-green-500" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={current}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
          current ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
