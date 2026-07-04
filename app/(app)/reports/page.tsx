"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { GenerateReportButtons } from "@/components/report/generate-report";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useApi } from "@/lib/use-api";
import type { ReportRow } from "@/lib/api-types";
import { ScrollText } from "lucide-react";

const PERIOD_LABEL: Record<string, string> = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" };

export default function ReportsPage() {
  const { data: reports, loading } = useApi<ReportRow[]>("/api/reports");
  const { data: profile } = useApi<{ stats: { dreamCount: number } }>("/api/user/profile");
  const dreamCount = profile?.stats.dreamCount ?? 0;

  return (
    <>
      <PageHeader
        title="Laporan Kesejahteraan"
        subtitle="Refleksi berkala dari riwayat mimpimu — bukan penilaian medis."
      />

      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-body mb-1">Buat laporan baru</h2>
        <p className="text-sm text-muted mb-4">
          Merangkum frekuensi mimpi, keseimbangan emosi, simbol berulang, dan observasi AI untuk periode itu.
        </p>
        <GenerateReportButtons />
        {dreamCount < 3 && (
          <p className="mt-3 text-xs text-muted">
            ⓘ Kamu punya {dreamCount} mimpi yang bisa dianalisis — laporan jauh lebih bermakna dengan 3+ mimpi
            dalam satu periode.
          </p>
        )}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="size-8" />}
          title="Belum ada laporan"
          message="Laporan perlu sedikit riwayat mimpi agar layak dibaca. Catat beberapa mimpi, lalu buat laporan mingguan pertamamu di atas."
        />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/reports/${r.id}`} className="card flex items-center justify-between gap-4 p-5 hover:shadow-dreamy-lg transition-shadow">
              <div className="flex items-center gap-4 min-w-0">
                <span className="rounded-xl surface-2 p-3 text-night-500 shrink-0">
                  <ScrollText className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-body truncate">{r.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatDate(r.periodStart)} – {formatDate(r.periodEnd)} · dibuat {formatDate(r.generatedAt)}
                  </p>
                </div>
              </div>
              <Badge className="shrink-0">{PERIOD_LABEL[r.period] ?? r.period}</Badge>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
