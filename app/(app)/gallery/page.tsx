"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import { PageSkeleton } from "@/components/ui/skeleton";
import { GalleryItem } from "@/components/dream/gallery-item";
import { useApi } from "@/lib/use-api";
import { Images, Search } from "lucide-react";

interface Viz {
  id: string;
  imagePath: string;
  prompt: string;
  createdAt: string;
  dreamId: string;
  dreamTitle: string | null;
}

export default function GalleryPage() {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const { data, loading } = useApi<Viz[]>(`/api/gallery${q ? `?q=${encodeURIComponent(q)}` : ""}`, [q]);

  return (
    <>
      <PageHeader title="Galeri Visualisasi" />

      <form method="GET" className="card p-4 mb-6 flex gap-3">
          <SearchBar
            name="q"
            defaultValue={q}
            placeholder="Cari berdasarkan judul atau isi mimpi…"
            aria-label="Cari galeri"
          />
        <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-full px-5 cursor-pointer transition-colors">
          Cari
        </button>
      </form>

      {loading ? (
        <PageSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<Images className="size-8" />}
          title={q ? "Tidak ada karya yang cocok" : "Belum ada seni mimpi"}
          message={q ? "Coba kata kunci lain." : "Buka mimpi mana pun dan tekan “Buat karya seni” — emosi dan simbolnya jadi visual unik."}
          action={
            <Link href="/dreams" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              Jelajahi mimpi
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((v) => (
            <GalleryItem
              key={v.id}
              viz={{
                id: v.id,
                imagePath: v.imagePath,
                prompt: v.prompt,
                createdAt: v.createdAt,
                dreamId: v.dreamId,
                dreamTitle: v.dreamTitle ?? "Mimpi tanpa judul",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
