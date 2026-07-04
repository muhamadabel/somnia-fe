"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { PrintButton } from "@/components/report/generate-report";
import { PageSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { ReportContent, ReportRow } from "@/lib/api-types";
import { safeParseJson, formatDate } from "@/lib/utils";
import { EMOTION_COLOR, emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { useApi } from "@/lib/use-api";
import { ArrowLeft, Flame, Moon, ScrollText, Sparkles } from "lucide-react";

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: report, loading, error } = useApi<ReportRow>(`/api/reports/${id}`, [id]);
  const { data: profile } = useApi<{ fullName: string }>("/api/user/profile");

  if (loading) return <PageSkeleton />;
  if (error || !report) {
    return (
      <EmptyState
        title="Laporan tidak ditemukan"
        message="Laporan ini tidak ada atau tautannya keliru."
        action={
          <Link href="/reports" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
            Semua laporan
          </Link>
        }
      />
    );
  }

  const c = safeParseJson<ReportContent>(report.content, {
    stats: { dreamCount: 0, analyzedCount: 0, avgSleep: null, streak: 0, positiveRatio: null },
    emotions: [],
    symbols: [],
    highlights: [],
    observations: [],
    reflection: "",
  });

  const pct = c.stats.positiveRatio !== null ? Math.round(c.stats.positiveRatio * 100) : null;

  return (
    <>
      <div className="no-print flex items-center justify-between mb-4">
        <Link href="/reports" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body">
          <ArrowLeft className="size-4" /> Semua laporan
        </Link>
        <PrintButton />
      </div>

      <article className="card p-8 print-area max-w-3xl mx-auto">
        {/* header */}
        <header className="text-center border-b border-base pb-6">
          <p className="flex items-center justify-center gap-2 text-night-500 text-sm font-medium">
            <Moon className="size-4" /> Somnia — Penganalisis Jurnal Mimpi
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-body" style={{ fontFamily: "var(--font-display)" }}>
            {report.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {formatDate(report.periodStart, { month: "long" })} – {formatDate(report.periodEnd, { month: "long" })} ·
            disiapkan untuk {profile?.fullName ?? "kamu"}
          </p>
        </header>

        {/* stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-base">
          <div className="text-center">
            <p className="text-2xl font-semibold text-body">{c.stats.dreamCount}</p>
            <p className="text-xs text-muted mt-1">mimpi tercatat</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-body">{pct !== null ? `${pct}%` : "—"}</p>
            <p className="text-xs text-muted mt-1">sinyal positif</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-body flex items-center justify-center gap-1">
              {c.stats.streak > 0 && <Flame className="size-4 text-dusk-500" />}
              {c.stats.streak}
            </p>
            <p className="text-xs text-muted mt-1">hari beruntun</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-body">{c.stats.avgSleep ? `${c.stats.avgSleep.toFixed(1)} jam` : "—"}</p>
            <p className="text-xs text-muted mt-1">rata-rata tidur</p>
          </div>
        </section>

        {/* emotions & symbols */}
        {(c.emotions.length > 0 || c.symbols.length > 0) && (
          <section className="py-6 border-b border-base grid gap-6 sm:grid-cols-2">
            {c.emotions.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Lanskap emosi</h2>
                <div className="space-y-2">
                  {c.emotions.slice(0, 6).map((e) => {
                    const max = c.emotions[0].count;
                    return (
                      <div key={e.name} className="flex items-center gap-2 text-sm">
                        <span className="w-24 shrink-0 flex items-center gap-1.5 text-body">
                          <EmotionDot color={e.color} /> {emotionLabel(e.name)}
                        </span>
                        <span className="flex-1 h-2 rounded-full surface-2 overflow-hidden">
                          <span className="block h-full rounded-full" style={{ width: `${(e.count / max) * 100}%`, backgroundColor: e.color }} />
                        </span>
                        <span className="text-xs text-muted w-6 text-right">{e.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {c.symbols.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Simbol berulang</h2>
                <div className="flex flex-wrap gap-2">
                  {c.symbols.map((s) => (
                    <Badge key={s.name} color="#7f6ac1">✧ {symbolLabel(s.name)} ×{s.count}</Badge>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* highlights */}
        {c.highlights.length > 0 && (
          <section className="py-6 border-b border-base">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Mimpi paling intens</h2>
            <div className="space-y-2">
              {c.highlights.map((h) => (
                <Link key={h.id} href={`/dreams/${h.id}`} className="flex items-center justify-between gap-3 rounded-xl surface-2 px-4 py-3 hover:bg-night-100 dark:hover:bg-night-800 transition-colors">
                  <span className="text-sm font-medium text-body truncate">{h.title}</span>
                  <span className="flex items-center gap-2 shrink-0 text-xs text-muted">
                    {h.dominantEmotion && (
                      <Badge color={EMOTION_COLOR[h.dominantEmotion] ?? "#7f6ac1"}>{emotionLabel(h.dominantEmotion)}</Badge>
                    )}
                    {formatDate(h.date)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* AI observations */}
        <section className="py-6 border-b border-base">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted mb-3">
            <Sparkles className="size-3.5" /> Observasi
          </h2>
          <ul className="space-y-2.5">
            {c.observations.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-body leading-relaxed">
                <span className="text-night-400 shrink-0">•</span> {o}
              </li>
            ))}
          </ul>
        </section>

        {/* reflection */}
        <section className="py-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Refleksi penutup</h2>
          <p className="text-[15px] text-body leading-relaxed italic">&ldquo;{c.reflection}&rdquo;</p>
        </section>

        <footer className="pt-4 border-t border-base text-[11px] text-muted flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ScrollText className="size-3.5" /> Dibuat {formatDate(report.generatedAt)} · mesin: {report.provider === "anthropic" ? "Claude AI" : "demo bawaan"}
          </span>
          <span>Panduan reflektif — bukan penilaian medis atau psikologis.</span>
        </footer>
      </article>
    </>
  );
}
