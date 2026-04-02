"use client";

import { useState } from "react";
import { createCoachLogin, removeCoachLogin } from "./actions";
import { UserPlus, Trash2, Loader2, CheckCircle } from "lucide-react";

interface Props {
  coachId: string;
  coachName: string;
  existingEmail: string | null;
}

export default function CreateLoginForm({ coachId, coachName, existingEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createCoachLogin(coachId, email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      setEmail("");
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove portal access for ${coachName}? They will no longer be able to log in.`)) return;
    setLoading(true);
    const result = await removeCoachLogin(coachId);
    setLoading(false);
    if (result.error) setError(result.error);
  }

  if (existingEmail) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle size={14} />
          {existingEmail}
        </div>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-red-400 hover:text-red-600 transition-colors p-1"
          title="Remove portal access"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
      >
        <UserPlus size={14} />
        Create Login
      </button>
    );
  }

  return (
    <form onSubmit={handleCreate} className="flex items-center gap-2">
      <input
        type="email"
        required
        placeholder="coach@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <button
        type="submit"
        disabled={loading}
        className="text-xs bg-gold text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center gap-1"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : null}
        Send Invite
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setError(null); }}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        Cancel
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
