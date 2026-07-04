"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/client";
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
  const toast = useToast();
  const [state, setState] = useState({ counts, mine: new Set(mine) });

  async function toggle(e: React.MouseEvent, type: string) {
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
    try {
      await api(`/api/community/posts/${postId}/reactions`, { method: "POST", json: { type } });
    } catch {
      toast("error", "Gagal menyimpan reaksi.");
    }
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Reaksi">
      {REACTION_TYPES.map((r) => {
        const active = state.mine.has(r.type);
        const count = state.counts[r.type] ?? 0;
        if (compact && count === 0 && !active) return null;
        
        const IconComponent = REACTION_ICONS[r.type] || Heart;

        return (
          <button
            key={r.type}
            onClick={(e) => toggle(e, r.type)}
            aria-pressed={active}
            aria-label={`${r.label} (${count})`}
            title={r.label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer border select-none",
              active
                ? "bg-night-100/80 dark:bg-night-900/80 border-night-400 text-night-600 dark:text-night-300 shadow-dreamy"
                : "surface border-base text-muted hover:text-body hover:border-night-300"
            )}
          >
            <IconComponent
              className={cn(
                "size-3.5 transition-transform duration-200",
                active ? "fill-current scale-110" : "scale-100"
              )}
            />
            {count > 0 && <span className="font-semibold">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

