"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DreamCard, type DreamCardData } from "@/components/dream/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { EMOTIONS, MOODS } from "@/lib/constants";
import { useApi } from "@/lib/use-api";
import { PenLine, Search } from "lucide-react";

export default function DreamsPage() {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const emotion = sp.get("emotion") ?? "";
  const mood = sp.get("mood") ?? "";
  const status = sp.get("status") ?? "active";
  const sort = sp.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (emotion) query.set("emotion", emotion);
  if (mood) query.set("mood", mood);
  if (status) query.set("status", status);
  if (sort) query.set("sort", sort);
  query.set("page", String(page));

  const { data: dreams, meta, loading } = useApi<DreamCardData[]>(`/api/dreams?${query}`, [query.toString()]);
  const total = (meta.total as number) ?? 0;
  const totalPages = (meta.totalPages as number) ?? 1;

  const filterLink = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const next = { q, emotion, mood, status, sort, ...patch };
    for (const [k, v] of Object.entries(next)) if (v && v !== "active" && v !== "newest") params.set(k, v);
    const s = params.toString();
    return `/dreams${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Mimpi"
        subtitle={`${total} mimpi di tampilan ini`}
        action={
          <Link
            href="/dreams/new"
            className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 shadow-dreamy transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      <form method="GET" className="card p-4 mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden />
            <input type="search" name="q" defaultValue={q} placeholder="Cari mimpi…" aria-label="Cari mimpi" className="input-base pl-9" />
          </div>
          <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 cursor-pointer transition-colors">
            Terapkan
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          <select name="emotion" defaultValue={emotion} aria-label="Filter emosi" className="input-base text-sm">
            <option value="">Emosi</option>
            {EMOTIONS.map((e) => (
              <option key={e.name} value={e.name}>{e.label}</option>
            ))}
          </select>
          <select name="mood" defaultValue={mood} aria-label="Filter suasana hati" className="input-base text-sm">
            <option value="">Mood</option>
            {MOODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} aria-label="Urutkan" className="input-base text-sm">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
        {status !== "active" && <input type="hidden" name="status" value={status} />}
      </form>

      <div className="relative flex rounded-full bg-ice-tint dark:bg-night-950/40 p-1 mb-5 max-w-xs" role="tablist" aria-label="Status mimpi">
        {/* Sliding Background Box */}
        <div
          className="absolute top-1 bottom-1 bg-white dark:bg-(--surface) rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            width: "calc(33.333% - 5.33px)",
            left: status === "drafts"
              ? "calc(33.333% + 1.33px)"
              : status === "archived"
                ? "calc(66.666% + 1.33px)"
                : "4px"
          }}
        />
        {[
          { key: "active", label: "Jurnal" },
          { key: "drafts", label: "Draf" },
          { key: "archived", label: "Arsip" },
        ].map((t) => (
          <Link
            key={t.key}
            href={filterLink({ status: t.key, page: "" })}
            role="tab"
            aria-selected={status === t.key}
            className={`relative z-10 flex-1 text-center py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
              status === t.key ? "text-signal-blue dark:text-white" : "text-muted hover:text-body"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : !dreams || dreams.length === 0 ? (
        <EmptyState
          title={q || emotion || mood ? "Tidak ada mimpi yang cocok" : status === "drafts" ? "Belum ada draf" : status === "archived" ? "Belum ada arsip" : "Belum ada mimpi"}
          message={
            q || emotion || mood
              ? "Coba longgarkan pencarian atau hapus salah satu filter."
              : "Mulai dengan mencatat mimpi pertamamu — fragmen pun berarti."
          }
          action={
            <Link href="/dreams/new" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              <PenLine className="size-4" /> Catat mimpi
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.map((d) => (
            <DreamCard key={d.id} dream={d} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginasi">
          {page > 1 && (
            <Link href={filterLink({ page: String(page - 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              ← Sebelumnya
            </Link>
          )}
          <span className="text-sm text-muted px-2">Halaman {page} dari {totalPages}</span>
          {page < totalPages && (
            <Link href={filterLink({ page: String(page + 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              Berikutnya →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
