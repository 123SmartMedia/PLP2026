"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createCoach, updateCoach } from "./coach-actions";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface CoachData {
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  phone?: string;
  email?: string;
  specialties?: string[];
  sports?: string[];
  sort_order?: number;
  image_url?: string | null;
}

export default function CoachForm({ coach }: { coach?: CoachData }) {
  const isEdit = !!coach?.id;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(coach?.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateCoach(coach!.id!, fd)
      : await createCoach(fd);
    setSaving(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Photo upload */}
      <div>
        <label className="text-xs text-gray-500 font-medium block mb-2">Headshot</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {preview ? (
              <Image src={preview} alt="Preview" width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-2xl font-bold">
                {coach?.name?.charAt(0) ?? "?"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Upload size={14} />
              {preview ? "Change Photo" : "Upload Photo"}
            </button>
            {preview && preview !== coach?.image_url && (
              <button
                type="button"
                onClick={() => { setPreview(coach?.image_url ?? null); if (fileRef.current) fileRef.current.value = ""; }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            )}
            <p className="text-xs text-gray-400">JPG or PNG, square crop recommended</p>
          </div>
        </div>
        <input
          ref={fileRef}
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <hr className="border-gray-100" />

      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Full Name *</label>
          <input
            name="name"
            required
            defaultValue={coach?.name ?? ""}
            placeholder="Chris Scura"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Title / Role *</label>
          <input
            name="role"
            required
            defaultValue={coach?.role ?? ""}
            placeholder="Lead Hitting Instructor"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-xs text-gray-500 font-medium block mb-1">Bio</label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={coach?.bio ?? ""}
          placeholder="Coach background, experience, teaching philosophy…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
        />
      </div>

      {/* Specialties & Sports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Specialties</label>
          <input
            name="specialties"
            defaultValue={coach?.specialties?.join(", ") ?? ""}
            placeholder="Hitting, Swing Mechanics, Pitch Recognition"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Sports</label>
          <input
            name="sports"
            defaultValue={coach?.sports?.join(", ") ?? ""}
            placeholder="Baseball, Softball"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Phone</label>
          <input
            name="phone"
            type="tel"
            defaultValue={coach?.phone ?? ""}
            placeholder="(631) 555-0000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={coach?.email ?? ""}
            placeholder="coach@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </div>

      {/* Sort order */}
      <div className="w-32">
        <label className="text-xs text-gray-500 font-medium block mb-1">Display Order</label>
        <input
          name="sort_order"
          type="number"
          min={1}
          defaultValue={coach?.sort_order ?? 99}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <p className="text-xs text-gray-400 mt-1">Lower = appears first</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Add Coach"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/coaches")}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
