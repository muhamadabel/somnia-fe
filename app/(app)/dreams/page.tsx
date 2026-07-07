"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DreamCard, type DreamCardData } from "@/components/dream/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/input";
import { SearchBar } from "@/components/ui/search-bar";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
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
            className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-dreamy transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      <form method="GET" className="card p-4 mb-6 space-y-3">
        <div className="flex gap-2">
          <SearchBar name="q" defaultValue={q} placeholder="Cari mimpi…" aria-label="Cari mimpi" />
          <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-full px-5 cursor-pointer transition-colors">
            Cari
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:max-w-md">
          <Select name="emotion" defaultValue={emotion} aria-label="Filter emosi" className="text-sm" placeholder="Emosi">
            <option value="">Emosi</option>
            {EMOTIONS.map((e) => (
              <option key={e.name} value={e.name}>{e.label}</option>
            ))}
          </Select>
          <Select name="mood" defaultValue={mood} aria-label="Filter suasana hati" className="text-sm" placeholder="Mood">
            <option value="">Mood</option>
            {MOODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
          <Select name="sort" defaultValue={sort} aria-label="Urutkan" className="text-sm">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </Select>
        </div>
        {status !== "active" && <input type="hidden" name="status" value={status} />}
      </form>

      <SegmentedControl
        ariaLabel="Status mimpi"
        value={status}
        className="mb-5 max-w-xs"
        options={[
          { value: "active", label: "Jurnal", href: filterLink({ status: "active", page: "" }) },
          { value: "drafts", label: "Draf", href: filterLink({ status: "drafts", page: "" }) },
          { value: "archived", label: "Arsip", href: filterLink({ status: "archived", page: "" }) },
        ]}
      />

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
             <Link href="/dreams/new" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors">
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
