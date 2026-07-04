"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  DreamCountChart,
  EmotionFrequencyChart,
  MoodScoreChart,
  ToneDonut,
} from "@/components/charts/trend-charts";
import { LineChart, PenLine, Sparkles } from "lucide-react";
import { emotionLabel } from "@/lib/constants";
import { useApi } from "@/lib/use-api";
import type { TrendData } from "@/lib/api-types";

const RANGES = [
  { days: 7, label: "Minggu" },
  { days: 30, label: "Bulan" },
  { days: 90, label: "3 Bulan" },
  { days: 365, label: "Tahun" },
];

export default function TrendsPage() {
  const sp = useSearchParams();
  const range = RANGES.find((r) => r.days === Number(sp.get("range")))?.days ?? 30;
  const { data: trends, loading } = useApi<TrendData>(`/api/trends?range=${range}`, [range]);

  if (loading || !trends) return <PageSkeleton />;

  const positive = trends.frequency.filter((f) => f.tone === "positive").reduce((a, f) => a + f.count, 0);
  const negative = trends.frequency.filter((f) => f.tone === "negative").reduce((a, f) => a + f.count, 0);
  const neutral = trends.frequency.filter((f) => f.tone === "neutral").reduce((a, f) => a + f.count, 0);

  const chartDaily =
    range <= 31
      ? trends.daily
      : trends.daily.reduce<Array<{ label: string; score: number | null; count: number; _n: number; _sum: number }>>((acc, d, i) => {
          const bucket = Math.floor(i / 7);
          if (!acc[bucket]) acc[bucket] = { label: d.label, score: null, count: 0, _n: 0, _sum: 0 };
          acc[bucket].count += d.count;
          if (d.score !== null) {
            acc[bucket]._n++;
            acc[bucket]._sum += d.score;
            acc[bucket].score = Math.round(acc[bucket]._sum / acc[bucket]._n);
          }
          return acc;
        }, []);

  return (
    <>
      <PageHeader title="Tren Emosi" subtitle="Bagaimana perasaan mimpimu bergerak dari waktu ke waktu." />

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Rentang waktu">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/trends?range=${r.days}`}
            role="tab"
            aria-selected={range === r.days}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              range === r.days ? "bg-night-600 text-white" : "surface border-base text-muted hover:text-body"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </div>

      {trends.totalDreams === 0 ? (
        <EmptyState
          icon={<LineChart className="size-8" />}
          title="Data belum cukup untuk periode ini"
          message="Tren dibangun dari mimpi yang sudah dianalisis. Catat mimpi dan buat analisis AI-nya untuk melihat pola emosimu terbentuk."
          action={
            <Link href="/dreams/new" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              <PenLine className="size-4" /> Catat mimpi
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Positivitas dari waktu ke waktu"
              subtitle="50 = netral — di atasnya condong positif, di bawahnya lebih berat"
            />
            <MoodScoreChart data={chartDaily} />
          </Card>

          <Card>
            <CardHeader title="Observasi AI" icon={<Sparkles className="size-4.5" />} />
            <p className="text-sm text-muted leading-relaxed">{trends.observation}</p>
            {trends.dominant && (
              <div className="mt-4 rounded-xl surface-2 p-4">
                <p className="text-xs text-muted">Emosi dominan periode ini</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-body">
                  <EmotionDot color={trends.dominant.color} className="size-3" />
                  {emotionLabel(trends.dominant.name)}
                  <span className="text-xs font-normal text-muted">terdeteksi di {trends.dominant.count} mimpi</span>
                </p>
              </div>
            )}
            {trends.positiveRatio !== null && (
              <div className="mt-3 rounded-xl surface-2 p-4">
                <p className="text-xs text-muted">Keseimbangan positif</p>
                <p className="mt-1 font-semibold text-body">{Math.round(trends.positiveRatio * 100)}% sinyal positif</p>
              </div>
            )}
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader title="Frekuensi emosi" subtitle="Seberapa sering tiap emosi muncul" />
            {trends.frequency.length === 0 ? (
              <p className="text-sm text-muted py-6 text-center">Belum ada mimpi teranalisis di periode ini.</p>
            ) : (
              <EmotionFrequencyChart data={trends.frequency.map((f) => ({ ...f, name: emotionLabel(f.name) }))} />
            )}
          </Card>

          <Card>
            <CardHeader title="Positif vs negatif" subtitle="Keseimbangan sinyal emosi" />
            {positive + negative + neutral === 0 ? (
              <p className="text-sm text-muted py-6 text-center">Belum ada sinyal.</p>
            ) : (
              <>
                <ToneDonut positive={positive} negative={negative} neutral={neutral} />
                <div className="flex justify-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><EmotionDot color="#34d399" /> Positif {positive}</span>
                  <span className="flex items-center gap-1.5"><EmotionDot color="#f87171" /> Negatif {negative}</span>
                  <span className="flex items-center gap-1.5"><EmotionDot color="#a78bfa" /> Netral {neutral}</span>
                </div>
              </>
            )}
          </Card>

          <Card>
            <CardHeader title="Frekuensi mimpi" subtitle="Mimpi tercatat per hari" />
            <DreamCountChart data={chartDaily} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {trends.frequency.slice(0, 5).map((f) => (
                <Badge key={f.name} color={f.color}>
                  <EmotionDot color={f.color} /> {emotionLabel(f.name)} ×{f.count}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
