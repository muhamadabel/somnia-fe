"use client";

import { useState } from "react";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookmarkButton({ symbolId, bookmarked }: { symbolId: string; bookmarked: boolean }) {
  const [state, setState] = useState(bookmarked);

  const { mutate, isMutating } = useMutation(
    () => api<{ bookmarked: boolean }>(`/api/symbols/${symbolId}/bookmark`, { method: "POST" }),
    {
      onSuccess: ({ data }) => setState(data.bookmarked),
      errorMessage: "Gagal memperbarui simpanan."
    }
  );

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    mutate().catch(() => {});
  }

  return (
    <button
      onClick={toggle}
      disabled={isMutating}
      aria-pressed={state}
      aria-label={state ? "Hapus simpanan" : "Simpan simbol ini"}
      className={cn(
        "p-2 rounded-lg transition-colors cursor-pointer",
        state ? "text-dusk-500 hover:text-dusk-600" : "text-muted hover:text-body hover:bg-(--surface-2)"
      )}
    >
      <Bookmark className={cn("size-4.5", state && "fill-current")} />
    </button>
  );
}
