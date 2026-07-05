"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnalysisPanel, type AnalysisData } from "@/components/dream/analysis-panel";
import { VisualizationPanel, type VisualizationData } from "@/components/dream/visualization-panel";
import { DreamActions } from "@/components/dream/dream-actions";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { MOOD_LABEL, emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { fileUrl } from "@/lib/client";
import { useApi } from "@/lib/use-api";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, BedDouble, CalendarDays, FileEdit } from "lucide-react";

interface DreamDetail {
  id: string;
  title: string | null;
  description: string;
  notes: string | null;
  mood: string | null;
  sleepDuration: number | null;
  dreamDate: string;
  createdAt: string;
  isDraft: boolean;
  archivedAt: string | null;
  imagePath: string | null;
  emotions: Array<{ intensity: number; emotion: { name: string; color: string } }>;
  symbols: Array<{ symbol: { name: string; slug: string; interpretation: string } }>;
  analyses: AnalysisData[];
  visualizations: VisualizationData[];
  post: { id: string } | null;
}

export default function DreamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dream, loading, error } = useApi<DreamDetail>(`/api/dreams/${id}`, [id]);

  if (loading) return <PageSkeleton />;
  if (error || !dream) {
    return (
      <EmptyState
        title="Mimpi tidak ditemukan"
        message="Mimpi ini mungkin sudah dihapus atau tautannya tidak valid."
        action={
          <Link href="/dreams" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
            Semua mimpi
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Link href="/dreams" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 font-medium transition-colors">
        <ArrowLeft className="size-4" /> Semua mimpi
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] leading-tight flex items-center flex-wrap gap-2">
            {dream.title ?? "Mimpi tanpa judul"}
            {dream.isDraft && (
              <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-white text-slate-500 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm">
                <FileEdit className="size-3.5" /> Draf
              </span>
            )}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatDate(dream.dreamDate, { weekday: "long" })}
            </span>
            {dream.mood && <span>{MOOD_LABEL[dream.mood]} saat bangun</span>}
            {dream.sleepDuration != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="size-4" /> tidur {dream.sleepDuration} jam
              </span>
            )}
          </div>
        </div>
        <DreamActions
          dreamId={dream.id}
          title={dream.title ?? "Mimpi tanpa judul"}
          archived={!!dream.archivedAt}
          shared={!!dream.post}
          isDraft={dream.isDraft}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_12px_rgba(20,30,40,0.03)] border border-slate-100">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-4">Isi mimpi</h2>
            <p className="text-[15px] text-[#334155] leading-relaxed whitespace-pre-line font-medium">{dream.description}</p>

            {dream.imagePath && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={fileUrl(dream.imagePath)} alt="Lampiran mimpi" className="mt-4 w-full rounded-xl border border-base" />
            )}

            {dream.notes && (
              <div className="mt-4 rounded-xl surface-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">Catatan</p>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{dream.notes}</p>
              </div>
            )}

            {(dream.emotions.length > 0 || dream.symbols.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {dream.emotions.map((e) => (
                  <Badge key={e.emotion.name} color={e.emotion.color} title={`intensitas ${e.intensity}`}>
                    <EmotionDot color={e.emotion.color} /> {emotionLabel(e.emotion.name)}
                  </Badge>
                ))}
                {dream.symbols.map((s) => (
                  <Link key={s.symbol.slug} href={`/symbols/${s.symbol.slug}`}>
                    <Badge className="hover:bg-night-100 dark:hover:bg-night-800 transition-colors" title={s.symbol.interpretation}>
                      ✧ {symbolLabel(s.symbol.slug)}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            <p className="mt-4 text-[11px] text-muted">
              Dicatat {formatDate(dream.createdAt)} · stempel waktu selalu dijaga dan tak pernah diubah.
            </p>
          </div>

          <VisualizationPanel dreamId={dream.id} visualizations={dream.visualizations} />
        </div>

        <div className="lg:col-span-3">
          <AnalysisPanel dreamId={dream.id} analyses={dream.analyses} isDraft={dream.isDraft} />
        </div>
      </div>
    </>
  );
}
