"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/client";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookmarkButton({ symbolId, bookmarked }: { symbolId: string; bookmarked: boolean }) {
  const toast = useToast();
  const [state, setState] = useState(bookmarked);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      const { data } = await api<{ bookmarked: boolean }>(`/api/symbols/${symbolId}/bookmark`, { method: "POST" });
      setState(data.bookmarked);
    } catch {
      toast("error", "Gagal memperbarui simpanan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
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
