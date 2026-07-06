"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError, fileUrl } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { formatDate } from "@/lib/utils";
import { Download, Palette, RefreshCw, Trash2 } from "lucide-react";

export interface VisualizationData {
  id: string;
  imagePath: string;
  prompt: string;
  createdAt: string;
}

export function VisualizationPanel({
  dreamId,
  visualizations,
}: {
  dreamId: string;
  visualizations: VisualizationData[];
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const autoTriggered = useRef(false);

  // Fresh dream just saved → auto-generate the sketch once (chained from the
  // analysis step via ?sketch=1). No manual "buat" click needed.
  const shouldAuto = search.get("sketch") === "1" && visualizations.length === 0;

  const { mutate: doGenerate, isMutating: generating } = useMutation(
    () => api(`/api/dreams/${dreamId}/visualization`, { method: "POST" }),
    {
      successMessage: "Sketsa mimpi dibuat.",
      errorMessage: "Gagal membuat sketsa saat ini.",
      onSuccess: () => router.refresh()
    }
  );

  function generate() {
    doGenerate().catch(() => {});
  }

  const { mutate: doRemove } = useMutation(
    (id: string) => api(`/api/visualizations/${id}`, { method: "DELETE" }),
    {
      successMessage: "Karya seni dihapus.",
      errorMessage: "Gagal menghapus.",
      onSuccess: () => router.refresh()
    }
  );

  function remove(id: string) {
    setDeletedIds((prev) => new Set(prev).add(id));
    doRemove(id).catch(() => {});
  }

  useEffect(() => {
    if (shouldAuto && !autoTriggered.current) {
      autoTriggered.current = true;
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAuto]);

  // Filter out SVG backup art if there is at least one successful JPG/PNG generation
  const visible = visualizations.filter((viz) => !deletedIds.has(viz.id));
  const hasRealImage = visible.some((viz) => !viz.imagePath.toLowerCase().endsWith(".svg"));
  const activeVisualizations = hasRealImage
    ? visible.filter((viz) => !viz.imagePath.toLowerCase().endsWith(".svg"))
    : visible;

  const v = activeVisualizations[Math.min(current, Math.max(0, activeVisualizations.length - 1))];
  const ext = v ? v.imagePath.split(".").pop() || "png" : "png";

  return (
    <div className="bg-white bg-[url('/canvas.png')] bg-cover bg-center bg-no-repeat rounded-[28px] p-6 shadow-[0_2px_12px_rgba(20,30,40,0.03)] border border-slate-100 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Palette className="size-5 text-[#3b82f6]" />
          <h2 className="font-semibold text-[#1e3a5f]">Visualisasi Mimpi</h2>
        </div>
        <button 
          onClick={() => generate()} 
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1e3a5f] hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" /> {activeVisualizations.length ? "Buat ulang" : "Buat sketsa"}
        </button>
      </div>

      {(generating || shouldAuto) && activeVisualizations.length === 0 ? (
        <div className="space-y-2" role="status" aria-label="Membuat sketsa mimpi">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <p className="text-xs text-muted text-center">Melukis sketsa dari isi mimpimu…</p>
        </div>
      ) : activeVisualizations.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">
          Belum ada sketsa untuk mimpi ini.
        </p>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl(v.imagePath)}
            alt={v.prompt}
            className="w-full rounded-xl border border-base"
          />
          <p className="mt-2 text-xs text-muted italic">{v.prompt}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {activeVisualizations.map((viz, i) => (
                <button
                  key={viz.id}
                  onClick={() => setCurrent(i)}
                  aria-label={`Versi ${activeVisualizations.length - i}`}
                  className={`shrink-0 rounded-lg border-2 transition-colors cursor-pointer ${
                    i === current ? "border-night-500" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fileUrl(viz.imagePath)} alt="" className="h-12 w-16 object-cover rounded-md" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <a
                href={fileUrl(v.imagePath)}
                download={`dream-art-${formatDate(v.createdAt).replace(/[ ,]+/g, "-")}.${ext}`}
                className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
                aria-label="Unduh karya seni"
                title="Unduh"
              >
                <Download className="size-4" />
              </a>
              <button
                onClick={() => remove(v.id)}
                className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                aria-label="Hapus karya seni"
                title="Hapus"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
