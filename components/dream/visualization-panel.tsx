"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
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
  const toast = useToast();
  const [generating, setGenerating] = useState(false);
  const [current, setCurrent] = useState(0);

  async function generate() {
    setGenerating(true);
    try {
      await api(`/api/dreams/${dreamId}/visualization`, { method: "POST" });
      toast("success", "Karya seni mimpi baru dibuat.");
      setCurrent(0);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal membuat karya seni saat ini.");
    } finally {
      setGenerating(false);
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/visualizations/${id}`, { method: "DELETE" });
      toast("success", "Karya seni dihapus.");
      setCurrent(0);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menghapus.");
    }
  }

  const v = visualizations[Math.min(current, Math.max(0, visualizations.length - 1))];

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Palette className="size-5 text-night-500" />
          <h2 className="font-semibold text-body">Visualisasi Mimpi</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={generate} loading={generating}>
          <RefreshCw className="size-3.5" /> {visualizations.length ? "Buat ulang" : "Buat karya seni"}
        </Button>
      </div>

      {generating && visualizations.length === 0 ? (
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      ) : visualizations.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">
          Ubah mimpi ini jadi karya seni unik yang dibentuk oleh emosi dan simbolnya.
        </p>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/files/${v.imagePath}`}
            alt={v.prompt}
            className="w-full rounded-xl border border-base"
          />
          <p className="mt-2 text-xs text-muted italic">{v.prompt}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {visualizations.map((viz, i) => (
                <button
                  key={viz.id}
                  onClick={() => setCurrent(i)}
                  aria-label={`Versi ${visualizations.length - i}`}
                  className={`shrink-0 rounded-lg border-2 transition-colors cursor-pointer ${
                    i === current ? "border-night-500" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/files/${viz.imagePath}`} alt="" className="h-12 w-16 object-cover rounded-md" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <a
                href={`/api/files/${v.imagePath}`}
                download={`dream-art-${formatDate(v.createdAt).replace(/[ ,]+/g, "-")}.svg`}
                className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
                aria-label="Unduh karya seni"
                title="Unduh"
              >
                <Download className="size-4" />
              </a>
              <button
                onClick={() => remove(v.id)}
                className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-(--surface-2) cursor-pointer"
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
