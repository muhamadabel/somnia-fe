"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MOODS, emotionLabel } from "@/lib/constants";
import { fileUrl } from "@/lib/client";
import { truncate } from "@/lib/utils";
import { ChevronRight, MoonStar } from "lucide-react";

export interface DreamCardData {
  id: string;
  title: string | null;
  description: string;
  mood: string | null;
  dreamDate: Date | string;
  isDraft: boolean;
  archivedAt: Date | string | null;
  emotions: Array<{ intensity: number; emotion: { name: string; color: string } }>;
  symbols?: Array<{ symbol: { name: string } }>;
  analyses?: Array<{ dominantEmotion: string }>;
  visualizations?: Array<{ imagePath: string }>;
}

const MOOD_EMOJI: Record<string, string> = Object.fromEntries(MOODS.map((m) => [m.value, m.emoji]));
const MOOD_TITLE: Record<string, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, `Bangun dengan perasaan ${m.label.toLowerCase()}`])
);

function shortDate(d: Date | string) {
  return new Date(d).toLocaleDateString("id-ID", { month: "short", day: "numeric" });
}

function topEmotion(dream: DreamCardData) {
  return [...dream.emotions].sort((a, b) => b.intensity - a.intensity)[0]?.emotion ?? null;
}

/** Small square art thumb; falls back to an emotion-tinted placeholder. */
export function DreamThumb({
  art,
  color,
  className = "size-12",
}: {
  art?: string | null;
  color?: string | null;
  className?: string;
}) {
  if (art) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fileUrl(art)} alt="" aria-hidden className={`${className} shrink-0 rounded-xl object-cover border border-base`} />
    );
  }
  const c = color ?? "#7f6ac1";
  return (
    <span
      aria-hidden
      className={`${className} shrink-0 rounded-xl grid place-items-center border border-base`}
      style={{ background: `linear-gradient(135deg, ${c}2e, ${c}0d)` }}
    >
      <MoonStar className="size-4.5" style={{ color: c, opacity: 0.75 }} />
    </span>
  );
}

// Deliberately minimal: date, title, two lines of text, one dominant
// emotion, art thumbnail when it exists. Details live on the dream page.
export function DreamCard({ dream }: { dream: DreamCardData }) {
  const top = topEmotion(dream);
  const more = dream.emotions.length - 1;
  const art = dream.visualizations?.[0]?.imagePath ?? null;

  return (
    <Link
      href={`/dreams/${dream.id}`}
      className="card group relative block overflow-hidden p-5 transition-shadow hover:shadow-dreamy-lg"
    >
      {top && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${top.color}dd, ${top.color}00 85%)` }}
        />
      )}

      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <time>{shortDate(dream.dreamDate)}</time>
        <span className="flex items-center gap-2">
          {dream.isDraft && <span className="font-medium text-amber-600 dark:text-amber-400">Draf</span>}
          {dream.archivedAt && !dream.isDraft && <span>Arsip</span>}
          {dream.mood && (
            <span className="text-sm leading-none" title={MOOD_TITLE[dream.mood]} aria-label={MOOD_TITLE[dream.mood]}>
              {MOOD_EMOJI[dream.mood]}
            </span>
          )}
        </span>
      </div>

      <div className="mt-2 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-body group-hover:text-night-600 dark:group-hover:text-night-300 transition-colors">
            {dream.title ?? "Mimpi tanpa judul"}
          </h3>
          <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">
            {truncate(dream.description, 160)}
          </p>
        </div>
        {art && <DreamThumb art={art} color={top?.color} className="size-14" />}
      </div>

      {top && (
        <div className="mt-3.5 flex items-center gap-2">
          <Badge color={top.color}>{emotionLabel(top.name)}</Badge>
          {more > 0 && <span className="text-xs text-muted">+{more}</span>}
        </div>
      )}
    </Link>
  );
}

// Compact horizontal row (dashboard "recent", calendar day preview) —
// thumbnail + title + emotion dot + date, like an inbox of dreams.
export function DreamRow({ dream }: { dream: DreamCardData }) {
  const top = topEmotion(dream);
  const art = dream.visualizations?.[0]?.imagePath ?? null;

  return (
    <Link
      href={`/dreams/${dream.id}`}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--surface-2) transition-colors"
    >
      <DreamThumb art={art} color={top?.color} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-body truncate group-hover:text-night-600 dark:group-hover:text-night-300 transition-colors">
          {dream.title ?? "Mimpi tanpa judul"}
          {dream.isDraft && <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">Draf</span>}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          {top && (
            <>
              <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: top.color }} />
              <span style={{ color: top.color }}>{emotionLabel(top.name)}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <time>{shortDate(dream.dreamDate)}</time>
        </p>
      </div>
      <ChevronRight className="size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </Link>
  );
}
