"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type Field = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "Private Lessons",
  "Team/Group Training",
  "Facility Rental",
  "Clinics & Camps",
  "General Question",
];

const EMPTY: Field = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [fields, setFields] = useState<Field>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof Field, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fields.name || !fields.email || !fields.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // TODO: wire up to an API route / email service (Resend, SendGrid, etc.)
    await new Promise((r) => setTimeout(r, 800)); // simulated delay
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-green-600" />
        </div>
        <h2 className="text-navy text-xl font-bold">Message sent!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Thanks for reaching out. We&apos;ll get back to you within one
          business day.
        </p>
        <button
          onClick={() => { setSent(false); setFields(EMPTY); }}
          className="mt-2 text-gold text-sm font-semibold hover:text-gold-dark transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block text-navy text-sm font-semibold mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Smith"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-navy text-sm font-semibold mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-navy text-sm font-semibold mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(631) 555-0100"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-navy text-sm font-semibold mb-1.5">
            Subject
          </label>
          <select
            value={fields.subject}
            onChange={(e) => set("subject", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
          >
            <option value="">Select a topic…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-navy text-sm font-semibold mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us how we can help…"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        <Send size={15} />
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
