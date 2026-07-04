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
  LineChart,
  MessagesSquare,
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
        <PageHeader title={`${greeting}, ${firstName}`} subtitle="Selamat datang di jurnal mimpimu." />
        <EmptyState
          icon={<MoonStar className="size-8" />}
          title="Mulai jurnal mimpi pertamamu"
          message="Mimpi memudar dalam hitungan menit setelah bangun. Catat satu — bahkan fragmen — dan Somnia akan mulai mengubah malam-malammu jadi insight. Grafik dan laporan muncul setelah ada beberapa entri."
          action={
            <Link
              href="/dreams/new"
              className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white font-medium rounded-xl px-6 py-3 shadow-dreamy transition-colors"
            >
              <PenLine className="size-4" /> Catat Mimpi Pertama
            </Link>
          }
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Sparkles, t: "Analisis AI", d: "Tiap mimpi dapat ringkasan, emosi, simbol, dan refleksi." },
            { icon: LineChart, t: "Tren emosi", d: "Pola emosi muncul setelah beberapa mimpi tercatat." },
            { icon: ScrollText, t: "Laporan mingguan", d: "Refleksi jangka panjang dari riwayatmu." },
          ].map((x) => (
            <div key={x.t} className="card p-4 flex gap-3">
              <x.icon className="size-5 text-night-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-body">{x.t}</p>
                <p className="text-xs text-muted mt-0.5">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  const dreamsThisWeek = trends.daily.reduce((a, d) => a + d.count, 0);
  const stats = [
    { icon: BookOpenText, tint: "#9a8cd2", value: String(totalDreams), label: "mimpi tercatat" },
    { icon: Flame, tint: "#de7f45", value: String(streak), label: "hari beruntun" },
    { icon: CalendarDays, tint: "#38bdf8", value: String(dreamsThisWeek), label: "minggu ini" },
  ];

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Inilah perjalanan mimpimu belakangan ini."
        action={
          <Link
            href="/dreams/new"
            className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 shadow-dreamy transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3.5">
            <span className="rounded-xl p-2.5" style={{ backgroundColor: `${s.tint}1f`, color: s.tint }}>
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-body leading-none">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          </Card>
        ))}
        <Card className="flex items-center gap-3.5">
          {trends.dominant ? (
            <>
              <span className="rounded-xl p-2.5" style={{ backgroundColor: `${trends.dominant.color}1f` }}>
                <EmotionDot color={trends.dominant.color} className="size-5" />
              </span>
              <div>
                <p className="text-lg font-semibold leading-tight" style={{ color: trends.dominant.color }}>
                  {emotionLabel(trends.dominant.name)}
                </p>
                <p className="text-xs text-muted mt-0.5">dominan minggu ini</p>
              </div>
            </>
          ) : (
            <>
              <span className="rounded-xl surface-2 p-2.5 text-muted">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-body leading-tight">Belum ada analisis</p>
                <p className="text-xs text-muted mt-0.5">minggu ini</p>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <Card className="p-2.5">
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
              <h2 className="font-semibold text-body">Mimpi terbaru</h2>
              <Link href="/dreams" className="text-sm text-night-600 dark:text-night-300 hover:underline">
                Lihat semua
              </Link>
            </div>
            <div className="space-y-0.5">
              {recentDreams.map((d) => (
                <DreamRow key={d.id} dream={d} />
              ))}
            </div>
          </Card>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { href: "/dreams/new", icon: PenLine, label: "Catat", tint: "#9a8cd2" },
              { href: "/companion", icon: MessagesSquare, label: "Teman AI", tint: "#2dd4bf" },
              { href: "/reports", icon: ScrollText, label: "Laporan", tint: "#e69a66" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="card flex flex-col items-center gap-2 py-4 text-sm font-medium text-body hover:shadow-dreamy-lg transition-shadow"
              >
                <span className="rounded-xl p-2.5" style={{ backgroundColor: `${a.tint}1f`, color: a.tint }}>
                  <a.icon className="size-5" />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader
              title="Nada emosi minggu ini"
              subtitle="50 = netral — di atasnya condong positif"
              action={
                <Link href="/trends" className="text-sm text-night-600 dark:text-night-300 hover:underline shrink-0">
                  Tren →
                </Link>
              }
            />
            <MoodScoreChart data={trends.daily} height={170} />
            <div className="mt-4 flex gap-3 rounded-xl surface-2 p-4">
              <Sparkles className="size-4.5 text-night-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted leading-relaxed">{trends.observation}</p>
            </div>
          </Card>

          {latestReport && (
            <Card className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="rounded-xl surface-2 p-2.5 text-night-500 shrink-0">
                  <ScrollText className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-body truncate">{latestReport.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    Dibuat {new Date(latestReport.generatedAt).toLocaleDateString("id-ID", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <Link
                href={`/reports/${latestReport.id}`}
                className="shrink-0 text-sm font-medium text-night-600 dark:text-night-300 hover:underline"
              >
                Baca →
              </Link>
            </Card>
          )}

          {user.reminderEnabled && (
            <div className="rounded-xl2 border border-dashed border-base px-4 py-3 text-xs text-muted flex items-center gap-2">
              <MoonStar className="size-4 text-night-400 shrink-0" />
              Pengingat harian disetel pukul {user.reminderTime} — ubah di Pengaturan → Notifikasi.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
