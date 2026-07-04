"use client";

import Link from "next/link";
import { fileUrl } from "@/lib/client";
import { truncate } from "@/lib/utils";
import { MoonStar } from "lucide-react";

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
      <MoonStar className="size-4.5" style={{ color: c, opacity: 0.7 }} />
    </span>
  );
}

// Calm card: a thin emotion-colored accent down the left edge, date, title,
// two lines of narrative, and art when it exists. No emoji, no badges —
// the details live on the dream page.
export function DreamCard({ dream }: { dream: DreamCardData }) {
  const top = topEmotion(dream);
  const accent = top?.color ?? "#7f6ac1";
  const art = dream.visualizations?.[0]?.imagePath ?? null;

  return (
    <Link
      href={`/dreams/${dream.id}`}
      className="card group relative block overflow-hidden px-5 py-5 transition-shadow hover:shadow-dreamy-lg"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <time>{shortDate(dream.dreamDate)}</time>
        {dream.isDraft ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">Draf</span>
        ) : dream.archivedAt ? (
          <span>Arsip</span>
        ) : null}
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
        {art && <DreamThumb art={art} color={accent} className="size-14" />}
      </div>
    </Link>
  );
}

// Compact horizontal row (dashboard "recent", calendar day preview):
// a slim emotion-colored edge, thumbnail, title, date. No emotion label.
export function DreamRow({ dream }: { dream: DreamCardData }) {
  const top = topEmotion(dream);
  const accent = top?.color ?? "#7f6ac1";
  const art = dream.visualizations?.[0]?.imagePath ?? null;

  return (
    <Link
      href={`/dreams/${dream.id}`}
      className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-(--surface-2) transition-colors"
    >
      <DreamThumb art={art} color={accent} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-body truncate group-hover:text-night-600 dark:group-hover:text-night-300 transition-colors">
          {dream.title ?? "Mimpi tanpa judul"}
          {dream.isDraft && <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">Draf</span>}
        </p>
        <time className="mt-0.5 block text-xs text-muted">{shortDate(dream.dreamDate)}</time>
      </div>
    </Link>
  );
}
