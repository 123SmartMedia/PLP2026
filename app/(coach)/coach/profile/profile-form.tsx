"use client";

import { useState } from "react";
import { updateCoachProfile } from "./actions";
import { Loader2 } from "lucide-react";

export default function ProfileForm({ phone, email }: { phone: string; email: string }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await updateCoachProfile(new FormData(e.currentTarget));
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-gray-500 font-medium block mb-1">Phone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="(631) 555-0000"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium block mb-1">Notification Email</label>
        <input
          name="email"
          type="email"
          defaultValue={email}
          placeholder="you@email.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <p className="text-xs text-gray-400 mt-1">Booking updates will be sent to this address.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </form>
  );
}
