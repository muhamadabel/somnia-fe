"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { ScrollText } from "lucide-react";

export function GenerateReportButtons() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function generate(period: "weekly" | "monthly" | "yearly") {
    setBusy(period);
    try {
      const { data } = await api<{ id: string }>("/api/reports", { method: "POST", json: { period } });
      toast("success", "Laporan dibuat.");
      router.push(`/reports/${data.id}`);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal membuat laporan saat ini.");
      setBusy(null);
    }
  }

  const labels = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" } as const;

  return (
    <div className="flex flex-wrap gap-2">
      {(["weekly", "monthly", "yearly"] as const).map((p) => (
        <Button key={p} variant={p === "weekly" ? "primary" : "secondary"} loading={busy === p} disabled={busy !== null} onClick={() => generate(p)}>
          <ScrollText className="size-4" /> {labels[p]}
        </Button>
      ))}
    </div>
  );
}

export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      Ekspor PDF
    </Button>
  );
}
