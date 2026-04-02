"use client";

import { useState } from "react";
import { addBlockedTime, removeBlockedTime } from "./actions";
import { Ban, Trash2, Loader2, Plus } from "lucide-react";

interface BlockedTime {
  id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

export default function BlockedTimesClient({ blocked }: { blocked: BlockedTime[] }) {
  const [items, setItems] = useState<BlockedTime[]>(blocked);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Default date to today
  const today = new Date().toISOString().split("T")[0];

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const result = await addBlockedTime(new FormData(form));
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      form.reset();
      setShowForm(false);
      // Refresh page data — next navigation will re-fetch
      window.location.reload();
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    await removeBlockedTime(id);
    setItems((prev) => prev.filter((b) => b.id !== id));
    setRemovingId(null);
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <p className="text-navy font-semibold text-sm">Block a Time</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Date</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={today}
                min={today}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Start Time</label>
              <input
                name="start_time"
                type="time"
                required
                defaultValue="08:00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">End Time</label>
              <input
                name="end_time"
                type="time"
                required
                defaultValue="17:00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Reason (optional)</label>
            <input
              name="reason"
              type="text"
              placeholder="e.g. Personal appointment, vacation…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Add Block
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(null); }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
        >
          <Plus size={16} />
          Block a Time
        </button>
      )}

      {/* Existing blocks */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-8 text-center text-gray-400 text-sm">
          No upcoming blocked times.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {items.map((b) => (
            <div key={b.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Ban size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-navy font-medium">
                    {formatDateTime(b.start_at)} – {new Date(b.end_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })}
                  </p>
                  {b.reason && (
                    <p className="text-xs text-gray-400 mt-0.5">{b.reason}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemove(b.id)}
                disabled={removingId === b.id}
                className="text-red-300 hover:text-red-500 transition-colors p-1 shrink-0"
                title="Remove"
              >
                {removingId === b.id
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Trash2 size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
