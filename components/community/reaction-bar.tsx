"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/client";
import { REACTION_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
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
      router.refresh();
    } catch {
      toast("error", "Gagal menyimpan reaksi.");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Reaksi">
      {REACTION_TYPES.map((r) => {
        const active = state.mine.has(r.type);
        const count = state.counts[r.type] ?? 0;
        if (compact && count === 0 && !active) return null;
        return (
          <button
            key={r.type}
            onClick={(e) => toggle(e, r.type)}
            aria-pressed={active}
            aria-label={`${r.label} (${count})`}
            title={r.label}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border",
              active
                ? "bg-night-100 dark:bg-night-800 border-night-400 text-body"
                : "surface border-base text-muted hover:text-body hover:border-night-300"
            )}
          >
            <span aria-hidden>{r.emoji}</span>
            {count > 0 && count}
          </button>
        );
      })}
    </div>
  );
}
