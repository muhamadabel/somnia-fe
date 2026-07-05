"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DreamRow, type DreamCardData } from "@/components/dream/dream-card";
import { Card, CardHeader } from "@/components/ui/card";
import { EmotionDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { MoodScoreChart } from "@/components/charts/trend-charts";
import { emotionLabel } from "@/lib/constants";
import { useApi } from "@/lib/use-api";
import type { TrendData } from "@/lib/api-types";
import {
  BookOpenText,
  CalendarDays,
  Flame,
  MoonStar,
  PenLine,
  ScrollText,
  Sparkles,
} from "lucide-react";

interface DashboardData {
  user: { fullName: string; reminderEnabled: boolean; reminderTime: string };
  totalDreams: number;
  recentDreams: DreamCardData[];
  streak: number;
  trends: TrendData;
  latestReport: { id: string; title: string; generatedAt: string } | null;
}

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard");
  if (loading || !data) return <PageSkeleton />;

  const { user, totalDreams, recentDreams, streak, trends, latestReport } = data;
  const firstName = user.fullName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  if (totalDreams === 0) {
    return (
      <>
        <PageHeader title={`${greeting}, ${firstName}`} />
        <EmptyState
          icon={<MoonStar className="size-8 text-signal-blue" />}
          title="Mulai jurnal mimpi pertamamu"
          message="Catat satu mimpi — fragmen pun cukup. Grafik dan insight akan tumbuh seiring waktu."
          action={
            <Link
              href="/dreams/new"
              className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white font-semibold rounded-3xl px-6 py-3 shadow-sm hover:shadow-md transition-colors"
            >
              <PenLine className="size-4" /> Catat Mimpi Pertama
            </Link>
          }
        />
      </>
    );
  }

  const dreamsThisWeek = trends.daily.reduce((a, d) => a + d.count, 0);
  const stats = [
    { icon: BookOpenText, tint: "#3b82f6", value: String(totalDreams), label: "mimpi tercatat" },
    { icon: Flame, tint: "#14b8a6", value: String(streak), label: "hari beruntun" },
    { icon: CalendarDays, tint: "#64748b", value: String(dreamsThisWeek), label: "minggu ini" },
  ];

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        action={
          <Link
            href="/dreams/new"
            className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white text-sm font-semibold rounded-3xl px-5 py-2.5 shadow-sm hover:shadow-md transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 px-5 py-4 rounded-[28px] bg-white shadow-[0_2px_12px_rgba(20,30,40,0.03)] border border-slate-100">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.tint}1a`, color: s.tint }}>
              <s.icon className="size-5.5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[26px] font-extrabold text-[#1e3a5f] leading-none">{s.value}</p>
              <p className="text-[13px] text-slate-500 font-medium mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 px-5 py-4 rounded-[28px] bg-white shadow-[0_2px_12px_rgba(20,30,40,0.03)] border border-slate-100">
          {trends.dominant ? (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${trends.dominant.color}1a` }}>
                <EmotionDot color={trends.dominant.color} className="size-4" />
              </div>
              <div>
                <p className="text-[20px] font-extrabold leading-tight" style={{ color: trends.dominant.color }}>
                  {emotionLabel(trends.dominant.name)}
                </p>
                <p className="text-[13px] text-slate-500 font-medium mt-1">dominan minggu ini</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
                <Sparkles className="size-5.5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-[#1e3a5f] leading-tight">Belum ada analisis</p>
                <p className="text-[13px] text-slate-500 font-medium mt-1">minggu ini</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <Card className="p-2.5 bg-white border border-sea-fog rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
              <h2 className="font-bold text-midnight-harbor">Mimpi terbaru</h2>
              <Link href="/dreams" className="text-sm text-signal-blue font-bold hover:underline">
                Lihat semua
              </Link>
            </div>
            <div className="space-y-0.5">
              {recentDreams.map((d) => (
                <DreamRow key={d.id} dream={d} />
              ))}
            </div>
          </Card>
        </section>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white border border-sea-fog rounded-2xl shadow-sm">
            <CardHeader
              title="Nada emosi minggu ini"
              action={
                <Link href="/trends" className="text-sm text-signal-blue font-bold hover:underline shrink-0">
                  Tren →
                </Link>
              }
            />
            <MoodScoreChart data={trends.daily} height={170} />
            <div className="mt-4 flex gap-3 rounded-xl bg-ice-tint/60 border border-sea-fog/30 p-4">
              <Sparkles className="size-4.5 text-signal-blue shrink-0 mt-0.5" />
              <p className="text-sm text-slate-channel leading-relaxed">{trends.observation}</p>
            </div>
          </Card>

          {latestReport && (
            <Card className="flex items-center justify-between gap-4 bg-white border border-sea-fog rounded-2xl shadow-sm">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="rounded-xl bg-ice-tint p-2.5 text-signal-blue shrink-0">
                  <ScrollText className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-midnight-harbor truncate">{latestReport.title}</p>
                  <p className="text-xs text-slate-channel mt-0.5">
                    Dibuat {new Date(latestReport.generatedAt).toLocaleDateString("id-ID", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <Link
                href={`/reports/${latestReport.id}`}
                className="shrink-0 text-sm font-bold text-signal-blue hover:underline"
              >
                Baca →
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
