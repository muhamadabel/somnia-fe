import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnalysisPanel, type AnalysisData } from "@/components/dream/analysis-panel";
import { VisualizationPanel } from "@/components/dream/visualization-panel";
import { DreamActions } from "@/components/dream/dream-actions";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { MOOD_LABEL, emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, BedDouble, CalendarDays, FileEdit } from "lucide-react";

export const metadata = { title: "Mimpi" };

export default async function DreamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getCurrentUser())!;
  const { id } = await params;

  const dream = await db.dream.findFirst({
    where: { id, userId: user.id, deletedAt: null },
    include: {
      emotions: { include: { emotion: true }, orderBy: { intensity: "desc" } },
      symbols: { include: { symbol: true }, orderBy: { confidence: "desc" } },
      analyses: { orderBy: { version: "desc" } },
      visualizations: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      post: { select: { id: true } },
    },
  });
  if (!dream) notFound();

  const analyses: AnalysisData[] = dream.analyses.map((a) => ({
    ...a,
    generatedAt: a.generatedAt.toISOString(),
  }));

  return (
    <>
      <Link href="/dreams" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body mb-4">
        <ArrowLeft className="size-4" /> Semua mimpi
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-body" style={{ fontFamily: "var(--font-display)" }}>
            {dream.title ?? "Mimpi tanpa judul"}
            {dream.isDraft && (
              <Badge className="ml-2 align-middle text-amber-600 dark:text-amber-400">
                <FileEdit className="size-3" /> Draf
              </Badge>
            )}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
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
        {/* ── Left: dream content ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Isi mimpi</h2>
            <p className="text-[15px] text-body leading-relaxed whitespace-pre-line">{dream.description}</p>

            {dream.imagePath && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/files/${dream.imagePath}`}
                alt="Lampiran mimpi"
                className="mt-4 w-full rounded-xl border border-base"
              />
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

          <VisualizationPanel
            dreamId={dream.id}
            visualizations={dream.visualizations.map((v) => ({
              id: v.id,
              imagePath: v.imagePath,
              prompt: v.prompt,
              createdAt: v.createdAt.toISOString(),
            }))}
          />
        </div>

        {/* ── Right: AI analysis ── */}
        <div className="lg:col-span-3">
          <Suspense>
            <AnalysisPanel dreamId={dream.id} analyses={analyses} isDraft={dream.isDraft} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
