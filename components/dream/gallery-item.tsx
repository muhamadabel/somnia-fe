"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, fileUrl } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { formatDate } from "@/lib/utils";
import { Download, Trash2 } from "lucide-react";

export function GalleryItem({
  viz,
}: {
  viz: { id: string; imagePath: string; prompt: string; createdAt: string; dreamId: string; dreamTitle: string };
}) {
  const router = useRouter();

  const { mutate: remove, isMutating: busy } = useMutation(
    () => api(`/api/visualizations/${viz.id}`, { method: "DELETE" }),
    {
      successMessage: "Karya seni dihapus.",
      errorMessage: "Gagal menghapus.",
      onSuccess: () => router.refresh()
    }
  );

  return (
    <figure className={`card overflow-hidden group ${busy ? "opacity-50" : ""}`}>
      <Link href={`/dreams/${viz.dreamId}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl(viz.imagePath)}
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
            href={fileUrl(viz.imagePath)}
            download={`dream-art-${viz.id}.svg`}
            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
            aria-label="Unduh karya seni"
          >
            <Download className="size-4" />
          </a>
          <button
            onClick={() => remove().catch(() => {})}
            disabled={busy}
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
            aria-label="Hapus karya seni"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
