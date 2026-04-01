"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Service, Coach } from "@/types/database";
import { getAvailableSlots, createBooking, type Slot } from "./actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Draft = {
  service: Service | null;
  coach: Coach | null;
  date: string | null;
  slot: Slot | null;
  notes: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Step 1: Service ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  lesson: "Private Lessons",
  clinic: "Clinics & Group Training",
  rental: "Facility Rentals",
};

function ServiceStep({
  services,
  selected,
  onSelect,
}: {
  services: Service[];
  selected: Service | null;
  onSelect: (s: Service) => void;
}) {
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-navy font-bold text-xs uppercase tracking-widest mb-3 text-gray-400">
            {CATEGORY_LABELS[cat] ?? cat}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selected?.id === s.id
                    ? "border-gold bg-gold/5"
                    : "border-gray-100 bg-white hover:border-gold/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-navy font-semibold text-sm">{s.name}</p>
                  {selected?.id === s.id && (
                    <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  {s.duration_minutes} min &middot; {formatPrice(s.price_cents)}
                </p>
                {s.description && (
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                    {s.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 2: Coach ────────────────────────────────────────────────────────────

function CoachStep({
  coaches,
  selected,
  onSelect,
}: {
  coaches: Coach[];
  selected: Coach | null;
  onSelect: (c: Coach) => void;
}) {
  return (
    <div className="space-y-3">
      {coaches.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
            selected?.id === c.id
              ? "border-gold bg-gold/5"
              : "border-gray-100 bg-white hover:border-gold/40"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {c.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-navy font-bold text-sm">{c.name}</p>
            <p className="text-gray-400 text-xs">{c.role}</p>
            {c.specialties?.length > 0 && (
              <p className="text-gray-400 text-xs mt-0.5">
                {c.specialties.slice(0, 3).join(" · ")}
              </p>
            )}
          </div>
          {selected?.id === c.id && (
            <CheckCircle2 size={18} className="text-gold shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Step 3: Date & Time ──────────────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1 text-gray-400 hover:text-navy transition-colors">
          <ChevronLeft size={18} />
        </button>
        <p className="text-navy font-bold text-sm">
          {MONTHS[month]} {year}
        </p>
        <button onClick={next} className="p-1 text-gray-400 hover:text-navy transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0"),
          ].join("-");
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selected;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`h-9 w-full rounded-lg text-sm font-medium transition-all ${
                isPast
                  ? "text-gray-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-navy text-white"
                  : isToday
                  ? "bg-gold/20 text-navy hover:bg-navy hover:text-white"
                  : "text-navy hover:bg-gray-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateTimeStep({
  service,
  coach,
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
}: {
  service: Service;
  coach: Coach | null;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  onDateSelect: (d: string) => void;
  onSlotSelect: (s: Slot) => void;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  async function handleDateSelect(date: string) {
    onDateSelect(date);
    setLoadingSlots(true);
    setSlots([]);
    const result = await getAvailableSlots(
      service.id,
      service.duration_minutes,
      date,
      coach?.id ?? null
    );
    setSlots(result);
    setLoadingSlots(false);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <MiniCalendar selected={selectedDate} onSelect={handleDateSelect} />

      <div className="min-h-[200px] flex flex-col">
        {!selectedDate ? (
          <p className="text-gray-400 text-sm m-auto text-center">
            Select a date to see available times.
          </p>
        ) : loadingSlots ? (
          <div className="flex items-center gap-2 m-auto text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading times…
          </div>
        ) : slots.length === 0 ? (
          <p className="text-gray-400 text-sm m-auto text-center">
            No available times on this date.
            <br />
            Try another day.
          </p>
        ) : (
          <div>
            <p className="text-navy font-semibold text-sm mb-3">
              {formatDate(selectedDate)}
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => onSlotSelect(slot)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    selectedSlot?.start === slot.start
                      ? "border-gold bg-gold/5 text-navy"
                      : "border-gray-100 bg-white hover:border-gold/40 text-navy"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Confirm ──────────────────────────────────────────────────────────

function ConfirmStep({
  draft,
  onNotesChange,
  onSubmit,
  submitting,
  error,
}: {
  draft: Draft;
  onNotesChange: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}) {
  const rows = [
    { label: "Service",  value: draft.service!.name },
    { label: "Coach",    value: draft.coach?.name ?? "No preference" },
    { label: "Date",     value: formatDate(draft.date!) },
    { label: "Time",     value: draft.slot!.label },
    { label: "Duration", value: `${draft.service!.duration_minutes} min` },
    { label: "Price",    value: formatPrice(draft.service!.price_cents) },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-navy font-semibold text-sm">{value}</span>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-navy text-sm font-semibold mb-1.5">
          Notes{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={draft.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Anything you'd like the coach to know…"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Booking…
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            Confirm Booking
          </>
        )}
      </button>

      <p className="text-center text-gray-400 text-xs">
        Your booking will be marked as <strong>pending</strong> until confirmed
        by the coach. You&apos;ll hear back within one business day.
      </p>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────────────────────────────

function currentStepIndex(draft: Draft): number {
  if (!draft.service) return 0;
  if (draft.service.category !== "rental" && !draft.coach) return 1;
  if (!draft.slot) return 2;
  return 3;
}

const ALL_STEPS = ["Service", "Coach", "Date & Time", "Confirm"];

export default function BookingWizard({
  services,
  coaches,
}: {
  services: Service[];
  coaches: Coach[];
}) {
  const [draft, setDraft] = useState<Draft>({
    service: null,
    coach: null,
    date: null,
    slot: null,
    notes: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitting, startTransition] = useTransition();

  const step = currentStepIndex(draft);
  const isRental = draft.service?.category === "rental";

  // Which steps are "done" for the indicator
  function isDone(i: number) {
    if (i === 0) return !!draft.service;
    if (i === 1) return !!draft.coach || (!!draft.service && isRental);
    if (i === 2) return !!draft.slot;
    return false;
  }

  function goBack() {
    if (step === 3) {
      setDraft((p) => ({ ...p, slot: null, date: null }));
    } else if (step === 2) {
      if (isRental) setDraft((p) => ({ ...p, service: null }));
      else setDraft((p) => ({ ...p, coach: null }));
    } else if (step === 1) {
      setDraft((p) => ({ ...p, service: null }));
    }
  }

  function handleSubmit() {
    setSubmitError("");
    startTransition(async () => {
      const result = await createBooking({
        serviceId: draft.service!.id,
        coachId: draft.coach?.id ?? null,
        startAt: draft.slot!.start,
        endAt: draft.slot!.end,
        priceCents: draft.service!.price_cents,
        notes: draft.notes,
      });
      if (result?.error) setSubmitError(result.error);
    });
  }

  return (
    <div>
      {/* ── Step indicator ── */}
      <div className="flex items-center mb-8">
        {ALL_STEPS.map((label, i) => {
          const done = isDone(i);
          const active = step === i;
          const skipped = isRental && i === 1;

          return (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    done || skipped
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done || skipped ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    active ? "text-navy" : done || skipped ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < ALL_STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px w-6 sm:w-10 shrink-0 ${
                    done || skipped ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-navy font-bold text-lg">
            {step === 0 && "Choose a Service"}
            {step === 1 && "Choose a Coach"}
            {step === 2 && "Pick a Date & Time"}
            {step === 3 && "Review & Confirm"}
          </h2>
          {step > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-gray-400 hover:text-navy text-sm transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
        </div>

        {step === 0 && (
          <ServiceStep
            services={services}
            selected={draft.service}
            onSelect={(s) =>
              setDraft({ service: s, coach: null, date: null, slot: null, notes: "" })
            }
          />
        )}

        {step === 1 && (
          <CoachStep
            coaches={coaches}
            selected={draft.coach}
            onSelect={(c) =>
              setDraft((p) => ({ ...p, coach: c, date: null, slot: null }))
            }
          />
        )}

        {step === 2 && draft.service && (
          <DateTimeStep
            service={draft.service}
            coach={draft.coach}
            selectedDate={draft.date}
            selectedSlot={draft.slot}
            onDateSelect={(d) => setDraft((p) => ({ ...p, date: d, slot: null }))}
            onSlotSelect={(s) => setDraft((p) => ({ ...p, slot: s }))}
          />
        )}

        {step === 3 && draft.service && draft.slot && (
          <ConfirmStep
            draft={draft}
            onNotesChange={(n) => setDraft((p) => ({ ...p, notes: n }))}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitError}
          />
        )}
      </div>
    </div>
  );
}
