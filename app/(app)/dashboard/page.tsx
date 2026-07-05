"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DreamRow, type DreamCardData } from "@/components/dream/dream-card";
import { Card, CardHeader } from "@/components/ui/card";
import { EmotionDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { MoodScoreChart } from "@/components/charts/trend-charts";
import { emotionLabel } from "@/lib/constants";
import { useApi } from "@/lib/use-api";
import { api } from "@/lib/client";
import type { TrendData } from "@/lib/api-types";
import type { NotificationItem } from "@/components/notifications/notification-list";
import {
  BookOpenText,
  CalendarDays,
  Download,
  Flame,
  MoonStar,
  PenLine,
  ScrollText,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";

interface DashboardData {
  user: { fullName: string; reminderEnabled: boolean; reminderTime: string };
  totalDreams: number;
  recentDreams: DreamCardData[];
  streak: number;
  trends: TrendData;
  latestReport: { id: string; title: string; generatedAt: string } | null;
}

/** Banner peringatan pola emosi negatif di dashboard */
function MentalHealthBanner() {
  const { data: notifications } = useApi<NotificationItem[]>("/api/notifications");
  const [dismissed, setDismissed] = useState(false);

  const alert = notifications?.find(
    (n) => n.type === "mental_health_alert" && !n.readAt
  );

  if (!alert || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    api(`/api/notifications/${alert!.id}`, { method: "POST" }).catch(() => {});
  }

  return (
    <div className="mb-6 rounded-[20px] border border-amber-300/60 dark:border-amber-600/40 bg-amber-50/80 dark:bg-amber-950/20 p-4 flex gap-4 items-start shadow-sm">
      <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-2.5 mt-0.5">
        <TriangleAlert className="size-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">{alert.title}</p>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">{alert.message}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {alert.link && (
            <Link
              href={alert.link}
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-full px-3.5 py-1.5 transition-colors"
            >
              <ScrollText className="size-3.5" /> Lihat Laporan
            </Link>
          )}
          {alert.link && (
            <Link
              href={alert.link}
              onClick={() => {
                dismiss();
                setTimeout(() => window.print(), 800);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <Download className="size-3.5" /> Unduh Laporan (PDF)
            </Link>
          )}
          <Link
            href="/reports"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full px-3.5 py-1.5 transition-colors"
          >
            Buat Laporan Baru
          </Link>
        </div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Tutup peringatan"
        className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer shrink-0"
      >
        <X className="size-4" />
      </button>
    </div>
  );
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
               className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-colors"
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        action={
          <Link
            href="/dreams/new"
            className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      <MentalHealthBanner />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-[28px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.tint}1a`, color: s.tint }}>
              <s.icon className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[22px] sm:text-[26px] font-extrabold text-body leading-none">{s.value}</p>
              <p className="text-[11px] sm:text-[13px] text-muted font-medium mt-1 leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
        <div className="card flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-[28px]">
          {trends.dominant ? (
            <>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${trends.dominant.color}1a` }}>
                <EmotionDot color={trends.dominant.color} className="size-4" />
              </div>
              <div>
                <p className="text-[18px] sm:text-[20px] font-extrabold leading-tight" style={{ color: trends.dominant.color }}>
                  {emotionLabel(trends.dominant.name)}
                </p>
                <p className="text-[13px] text-muted font-medium mt-1">dominan minggu ini</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 surface-2 text-muted">
                <Sparkles className="size-5.5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-body leading-tight">Belum ada analisis</p>
                <p className="text-[13px] text-muted font-medium mt-1">minggu ini</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <Card className="p-2.5">
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
              <h2 className="font-bold text-body">Mimpi terbaru</h2>
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
          <Card>
            <CardHeader
              title="Nada emosi minggu ini"
              action={
                <Link href="/trends" className="text-sm text-signal-blue font-bold hover:underline shrink-0">
                  Tren →
                </Link>
              }
            />
            <MoodScoreChart data={trends.daily} height={170} />
            <div className="mt-4 flex gap-3 rounded-xl surface-2 border border-base p-4">
              <Sparkles className="size-4.5 text-signal-blue shrink-0 mt-0.5" />
              <p className="text-sm text-muted leading-relaxed">{trends.observation}</p>
            </div>
          </Card>

          {latestReport && (
            <Card className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="rounded-xl surface-2 p-2.5 text-signal-blue shrink-0">
                  <ScrollText className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-body truncate">{latestReport.title}</p>
                  <p className="text-xs text-muted mt-0.5">
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
    </div>
  );
}
