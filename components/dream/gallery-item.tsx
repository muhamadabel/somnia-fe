"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Download, Trash2 } from "lucide-react";

export function GalleryItem({
  viz,
}: {
  viz: { id: string; imagePath: string; prompt: string; createdAt: string; dreamId: string; dreamTitle: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await api(`/api/visualizations/${viz.id}`, { method: "DELETE" });
      toast("success", "Karya seni dihapus.");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menghapus.");
      setBusy(false);
    }
  }

  return (
    <figure className={`card overflow-hidden group ${busy ? "opacity-50" : ""}`}>
      <Link href={`/dreams/${viz.dreamId}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/files/${viz.imagePath}`}
          alt={viz.prompt}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform"
        />
      </Link>
      <figcaption className="p-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/dreams/${viz.dreamId}`} className="block text-sm font-medium text-body truncate hover:underline">
            {viz.dreamTitle}
          </Link>
          <p className="text-xs text-muted mt-0.5">{formatDate(viz.createdAt)}</p>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <a
            href={`/api/files/${viz.imagePath}`}
            download={`dream-art-${viz.id}.svg`}
            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
            aria-label="Unduh karya seni"
          >
            <Download className="size-4" />
          </a>
          <button
            onClick={remove}
            disabled={busy}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-(--surface-2) cursor-pointer"
            aria-label="Hapus karya seni"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
