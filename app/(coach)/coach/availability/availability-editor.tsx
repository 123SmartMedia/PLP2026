"use client";

import { useState } from "react";
import { saveAvailability } from "./actions";
import { Plus, Trash2, Loader2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Slot {
  day: number;
  start: string;
  end: string;
}

interface Props {
  coachId: string;
  initial: Slot[];
}

export default function AvailabilityEditor({ coachId, initial }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addSlot(day: number) {
    setSlots((prev) => [...prev, { day, start: "08:00", end: "20:00" }]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSlot(index: number, field: "start" | "end", value: string) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await saveAvailability(coachId, slots);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="space-y-6">
      {DAYS.map((dayName, dayIndex) => {
        const daySlots = slots
          .map((s, i) => ({ ...s, index: i }))
          .filter((s) => s.day === dayIndex);

        return (
          <div key={dayIndex} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-navy font-semibold text-sm">{dayName}</p>
              <button
                onClick={() => addSlot(dayIndex)}
                className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-medium transition-colors"
              >
                <Plus size={13} />
                Add hours
              </button>
            </div>

            {daySlots.length === 0 ? (
              <p className="text-xs text-gray-400">Not available</p>
            ) : (
              <div className="space-y-2">
                {daySlots.map(({ index, start, end }) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={start}
                      onChange={(e) => updateSlot(index, "start", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="time"
                      value={end}
                      onChange={(e) => updateSlot(index, "end", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <button
                      onClick={() => removeSlot(index)}
                      className="text-red-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saved ? "Saved!" : "Save Availability"}
      </button>
    </div>
  );
}
