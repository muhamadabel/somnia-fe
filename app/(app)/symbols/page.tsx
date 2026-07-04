"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/symbol/bookmark-button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SYMBOL_CATEGORIES, CATEGORY_LABEL } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { truncate } from "@/lib/utils";
import { useApi } from "@/lib/use-api";
import { Search, Sparkles } from "lucide-react";

interface SymbolItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  interpretation: string;
  dreamCount: number;
  bookmarked: boolean;
}

export default function SymbolsPage() {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const category = sp.get("category") ?? "";
  const view = sp.get("view") ?? "all";

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (category) query.set("category", category);
  if (view !== "all") query.set("view", view);

  const { data: symbols, loading } = useApi<SymbolItem[]>(`/api/symbols?${query}`, [query.toString()]);

  const tabs = [
    { key: "all", label: "Semua simbol" },
    { key: "mine", label: "Di mimpiku" },
    { key: "bookmarked", label: "Tersimpan" },
  ];

  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { q, category, view, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && v !== "all") params.set(k, v);
    const s = params.toString();
    return `/symbols${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Pustaka Simbol Mimpi" />

      <form method="GET" className="card p-4 mb-4 flex flex-wrap gap-3">
        {view !== "all" && <input type="hidden" name="view" value={view} />}
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden />
          <input type="search" name="q" defaultValue={q} placeholder="Cari simbol…" aria-label="Cari simbol" className="input-base pl-9" />
        </div>
        <select name="category" defaultValue={category} aria-label="Kategori" className="input-base w-40">
          <option value="">Semua kategori</option>
          {SYMBOL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABEL[c] ?? c}</option>
          ))}
        </select>
        <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 cursor-pointer transition-colors">
          Cari
        </button>
      </form>

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Tampilan simbol">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={link({ view: t.key })}
            role="tab"
            aria-selected={view === t.key}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === t.key ? "bg-night-600 text-white" : "surface border-base text-muted hover:text-body"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : !symbols || symbols.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="size-8" />}
          title="Simbol tidak ditemukan"
          message={
            view === "mine"
              ? "Simbol muncul di sini setelah mimpimu dianalisis AI."
              : view === "bookmarked"
                ? "Simpan simbol yang ingin kamu pantau — semuanya berkumpul di sini."
                : "Coba pencarian atau kategori lain."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {symbols.map((s) => (
            <Link key={s.id} href={`/symbols/${s.slug}`} className="card p-5 hover:shadow-dreamy-lg transition-shadow relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-body group-hover:text-night-600 dark:group-hover:text-night-300 transition-colors">
                    ✧ {symbolLabel(s.slug)}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge>{CATEGORY_LABEL[s.category] ?? s.category}</Badge>
                    {s.dreamCount > 0 && <Badge color="#7f6ac1">{s.dreamCount} mimpimu</Badge>}
                  </div>
                </div>
                <BookmarkButton symbolId={s.id} bookmarked={s.bookmarked} />
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{truncate(s.interpretation, 140)}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
