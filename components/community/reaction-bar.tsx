"use client";

import { useState } from "react";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { REACTION_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Heart, Sparkles, Lightbulb, UserRoundCheck } from "lucide-react";

// Pemetaan tipe reaksi ke komponen Lucide
const REACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  hug: UserRoundCheck,
  sparkle: Sparkles,
  insight: Lightbulb,
};

// Pemetaan warna khusus saat aktif
const REACTION_COLORS: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  heart: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-300 dark:border-rose-800",
    text: "text-rose-600 dark:text-rose-400",
    fill: "fill-rose-500 dark:fill-rose-400",
  },
  hug: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-300 dark:border-sky-850",
    text: "text-sky-600 dark:text-sky-400",
    fill: "fill-sky-550 dark:fill-sky-450", // Ikon UserRoundCheck tidak butuh fill penuh tapi warna stroke akan terwarnai
  },
  sparkle: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    fill: "fill-amber-500 dark:fill-amber-400",
  },
  insight: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-300 dark:border-yellow-800",
    text: "text-yellow-600 dark:text-yellow-400",
    fill: "fill-yellow-400 dark:fill-yellow-400",
  },
};

export function ReactionBar({
  postId,
  counts,
  mine,
  compact = false,
}: {
  postId: string;
  counts: Record<string, number>;
  mine: string[];
  compact?: boolean;
}) {
  const [state, setState] = useState({ counts, mine: new Set(mine) });

  const { mutate } = useMutation(
    (type: string) => api(`/api/community/posts/${postId}/reactions`, { method: "POST", json: { type } }),
    { errorMessage: "Gagal menyimpan reaksi." }
  );

  function toggle(e: React.MouseEvent, type: string) {
    e.preventDefault();
    e.stopPropagation();
    // optimistic update
    setState((s) => {
      const has = s.mine.has(type);
      const next = new Set(s.mine);
      if (has) next.delete(type);
      else next.add(type);
      return {
        counts: { ...s.counts, [type]: Math.max(0, (s.counts[type] ?? 0) + (has ? -1 : 1)) },
        mine: next,
      };
    });
    mutate(type).catch(() => {});
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Reaksi">
      {REACTION_TYPES.map((r) => {
        const active = state.mine.has(r.type);
        const count = state.counts[r.type] ?? 0;
        if (compact && count === 0 && !active) return null;
        
        const IconComponent = REACTION_ICONS[r.type] || Heart;
        const colorConfig = REACTION_COLORS[r.type] ?? {
          bg: "bg-night-100/80 dark:bg-night-900/80",
          border: "border-night-400",
          text: "text-night-600 dark:text-night-300",
          fill: "fill-current",
        };

        return (
          <button
            key={r.type}
            onClick={(e) => toggle(e, r.type)}
            aria-pressed={active}
            aria-label={`${r.label} (${count})`}
            title={r.label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer border select-none",
              active
                ? `${colorConfig.bg} ${colorConfig.border} ${colorConfig.text} shadow-dreamy`
                : "surface border-base text-muted hover:text-body hover:border-night-300"
            )}
          >
            <IconComponent
              className={cn(
                "size-3.5 transition-transform duration-250",
                active ? `${colorConfig.fill} scale-110` : "scale-100"
              )}
            />
            {count > 0 && <span className="font-semibold">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}


