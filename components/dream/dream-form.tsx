"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api, ApiError, fileUrl } from "@/lib/client";
import { MAX_DREAM_LENGTH, MOODS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { BedDouble, CalendarDays, ImagePlus, Sparkles, X } from "lucide-react";

export interface DreamFormValues {
  id?: string;
  title: string;
  description: string;
  notes: string;
  mood: string;
  sleepDuration: string;
  dreamDate: string;
  isDraft: boolean;
  imagePath?: string | null;
}

// Petunjuk cepat untuk memancing detail (mengurangi "layar kosong menakutkan").
const PROMPTS = [
  "Di mana kamu berada?",
  "Siapa yang muncul?",
  "Apa yang kamu rasakan?",
  "Warna atau suara yang teringat?",
  "Bagaimana akhirnya?",
];

export function DreamForm({ initial }: { initial?: Partial<DreamFormValues> }) {
  const router = useRouter();
  const toast = useToast();
  const editing = !!initial?.id;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [showNotes, setShowNotes] = useState(!!initial?.notes);
  const [mood, setMood] = useState(initial?.mood ?? "");
  const [sleep, setSleep] = useState(initial?.sleepDuration ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState<"dream" | "draft" | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [dreamDate, setDreamDate] = useState(initial?.dreamDate ?? localToday);

  const words = description.trim() ? description.trim().split(/\s+/).length : 0;

  async function submit(asDraft: boolean) {
    setSaving(asDraft ? "draft" : "dream");
    setError(null);
    setFieldErrors({});
    const payload = {
      title: title.trim() || null,
      description,
      notes: notes.trim() || null,
      mood: mood || null,
      sleepDuration: sleep ? Number(sleep) : null,
      dreamDate,
      isDraft: asDraft,
    };

    try {
      const { data } = editing
        ? await api<{ id: string }>(`/api/dreams/${initial!.id}`, { method: "PATCH", json: payload })
        : await api<{ id: string }>("/api/dreams", { method: "POST", json: payload });
      const dreamId = editing ? initial!.id! : data.id;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        await api(`/api/dreams/${dreamId}/image`, { method: "POST", body: fd }).catch((err) => {
          toast("warning", err instanceof ApiError ? err.message : "Gambar gagal diunggah — mimpinya tetap tersimpan.");
        });
      } else if (removeImage && editing) {
        await api(`/api/dreams/${dreamId}/image`, { method: "DELETE" }).catch(() => {});
      }

      toast("success", asDraft ? "Draf tersimpan." : editing ? "Mimpi diperbarui." : "Mimpi tercatat ✨");
      window.location.href = `/dreams/${dreamId}${asDraft ? "" : "?analyze=1"}`;
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        setError(Object.keys(err.fieldErrors).length ? null : err.message);
      } else {
        setError("Ada gangguan jaringan — tulisanmu masih aman, coba simpan lagi.");
      }
      setSaving(null);
    }
  }

  const preview = initial?.imagePath && !removeImage && !file;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
      className="space-y-5 max-w-2xl"
      noValidate
    >
      {/* ── Kartu utama: judul + narasi ── */}
      <div className="card p-5 sm:p-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Beri judul mimpimu…"
          aria-label="Judul mimpi"
          maxLength={120}
          className="w-full bg-transparent border-0 p-0 text-xl font-semibold text-body placeholder:text-muted/60 focus:outline-none"
          style={{ fontFamily: "var(--font-display)" }}
        />
        <div className="mt-3 border-t border-base pt-3">
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan mimpimu di sini — sedetail yang kamu ingat…"
            aria-label="Deskripsi mimpi"
            required
            maxLength={MAX_DREAM_LENGTH}
            className={cn(
              "w-full bg-transparent border-0 p-0 min-h-44 resize-y text-[15px] leading-relaxed text-body placeholder:text-muted/60 focus:outline-none",
              fieldErrors.description && "placeholder:text-red-400"
            )}
          />
        </div>

        {/* Chip inspirasi + hitung kata */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted mr-1">
            <Sparkles className="size-3.5 text-night-400" /> Bantu ingat:
          </span>
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setDescription((d) => (d.trim() ? `${d.replace(/\s+$/, "")}\n${p} ` : `${p} `));
                descRef.current?.focus();
              }}
              className="text-xs surface-2 rounded-full px-2.5 py-1 text-muted hover:text-body hover:bg-night-100 dark:hover:bg-night-800 transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          {fieldErrors.description ? (
            <span className="text-red-600 dark:text-red-400">{fieldErrors.description}</span>
          ) : (
            <span>Fragmen pun boleh — yang penting kamu mencatat.</span>
          )}
          <span aria-live="polite">{words} kata</span>
        </div>
      </div>

      {/* ── Suasana hati saat bangun (emoji) ── */}
      <div className="card p-5">
        <p className="text-sm font-medium text-body mb-3">Bagaimana perasaanmu saat bangun?</p>
        <div className="grid grid-cols-5 gap-2" role="group" aria-label="Suasana hati saat bangun">
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(active ? "" : m.value)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border py-3 transition-all cursor-pointer",
                  active
                    ? "border-night-500 bg-night-100 dark:bg-night-800 scale-[1.03]"
                    : "border-base surface hover:border-night-300"
                )}
              >
                <span className="text-2xl leading-none" aria-hidden>{m.emoji}</span>
                <span className={cn("text-[11px] font-medium", active ? "text-body" : "text-muted")}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detail: tanggal, tidur ── */}
      <div className="card p-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-body">
            <CalendarDays className="size-4 text-night-400" /> Tanggal mimpi
          </span>
          <input
            type="date"
            value={dreamDate}
            onChange={(e) => setDreamDate(e.target.value)}
            max={localToday}
            required
            className="input-base"
          />
        </label>
        <label className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-body">
            <BedDouble className="size-4 text-night-400" /> Durasi tidur <span className="text-muted font-normal">(jam)</span>
          </span>
          <input
            type="number"
            step="0.5"
            min="0"
            max="24"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            placeholder="7,5"
            className="input-base"
          />
        </label>
      </div>

      {/* ── Lampiran & catatan (opsional, dilipat) ── */}
      <div className="card p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-body mb-2">Lampiran <span className="text-muted font-normal">— opsional</span></p>
          {preview ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(initial!.imagePath!)} alt="Lampiran mimpi saat ini" className="h-20 rounded-xl object-cover border border-base" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setRemoveImage(true)}>
                <X className="size-4" /> Hapus
              </Button>
            </div>
          ) : file ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 surface-2 rounded-xl px-3.5 py-2.5 text-sm text-body">
                <ImagePlus className="size-4 text-night-400" /> {file.name}
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                <X className="size-4" /> Batal
              </Button>
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer surface-2 rounded-xl px-3.5 py-2.5 hover:text-body hover:bg-night-100 dark:hover:bg-night-800 transition-colors w-fit">
              <ImagePlus className="size-4 text-night-400" />
              Tambahkan gambar atau sketsa
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.size > 5 * 1024 * 1024) {
                    toast("error", "Gambar terlalu besar — maksimal 5 MB.");
                    return;
                  }
                  setFile(f);
                  setRemoveImage(false);
                }}
              />
            </label>
          )}
          <p className="mt-1.5 text-xs text-muted">JPEG, PNG, atau WebP · maks 5 MB</p>
        </div>

        {showNotes ? (
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-body">Catatan tambahan</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Apa pun yang sedang terjadi dalam hidupmu, bagaimana tidurmu…"
              maxLength={2000}
              className="input-base min-h-20"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-sm text-night-600 dark:text-night-300 hover:underline cursor-pointer"
          >
            + Tambah catatan tambahan
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 surface-2 rounded-lg px-3 py-2" role="alert">
          {error}
        </p>
      )}

      {/* ── Aksi (menempel di bawah pada layar kecil) ── */}
      <div className="sticky bottom-0 -mx-1 px-1 py-3 bg-base/80 backdrop-blur-sm flex flex-wrap items-center gap-2 border-t border-base">
        <Button type="submit" size="lg" loading={saving === "dream"} disabled={saving !== null}>
          <Sparkles className="size-4" /> {editing ? "Simpan perubahan" : "Simpan & Analisis"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          loading={saving === "draft"}
          disabled={saving !== null}
          onClick={() => submit(true)}
        >
          Simpan Draf
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()} disabled={saving !== null}>
          Batal
        </Button>
      </div>
    </form>
  );
}
