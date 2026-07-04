"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/symbol/bookmark-button";
import { DreamCard, type DreamCardData } from "@/components/dream/dream-card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { EMOTION_COLOR, CATEGORY_LABEL, emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { parseJsonArray } from "@/lib/utils";
import { useApi } from "@/lib/use-api";
import { ArrowLeft } from "lucide-react";

interface SymbolData {
  symbol: {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    interpretation: string;
    relatedEmotions: string;
    bookmarked: boolean;
  };
  related: DreamCardData[];
}

export default function SymbolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useApi<SymbolData>(`/api/symbols/${slug}`, [slug]);

  if (loading) return <PageSkeleton />;
  if (error || !data) {
    return (
      <EmptyState
        title="Simbol tidak ditemukan"
        message="Simbol ini tidak ada atau tautannya keliru."
        action={
          <Link href="/symbols" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
            Pustaka simbol
          </Link>
        }
      />
    );
  }

  const { symbol, related } = data;
  const relatedEmotions = parseJsonArray(symbol.relatedEmotions);

  return (
    <>
      <Link href="/symbols" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body mb-4">
        <ArrowLeft className="size-4" /> Pustaka simbol
      </Link>

      <div className="card p-7 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-body" style={{ fontFamily: "var(--font-display)" }}>
              ✧ {symbolLabel(symbol.slug)}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge>{CATEGORY_LABEL[symbol.category] ?? symbol.category}</Badge>
              {relatedEmotions.map((e) => (
                <Badge key={e} color={EMOTION_COLOR[e] ?? "#7f6ac1"}>
                  <EmotionDot color={EMOTION_COLOR[e] ?? "#7f6ac1"} /> {emotionLabel(e)}
                </Badge>
              ))}
            </div>
          </div>
          <BookmarkButton symbolId={symbol.id} bookmarked={symbol.bookmarked} />
        </div>

        <p className="mt-4 text-sm text-muted">{symbol.description}</p>

        <div className="mt-5 rounded-xl surface-2 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Interpretasi reflektif</h2>
          <p className="text-[15px] text-body leading-relaxed">{symbol.interpretation}</p>
          <p className="mt-3 text-[11px] text-muted">
            Interpretasi adalah titik awal refleksi, bukan makna baku — asosiasi pribadimu selalu lebih penting.
          </p>
        </div>
      </div>

      <h2 className="font-semibold text-body mb-3">
        Di mimpimu {related.length > 0 && <span className="text-muted font-normal text-sm">({related.length})</span>}
      </h2>
      {related.length === 0 ? (
        <p className="text-sm text-muted">Simbol ini belum muncul di mimpimu yang teranalisis.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((d) => (
            <DreamCard key={d.id} dream={d} />
          ))}
        </div>
      )}
    </>
  );
}
