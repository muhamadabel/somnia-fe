"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { ScrollText } from "lucide-react";

export function GenerateReportButtons() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<string | null>(null);

  const { mutate, isMutating } = useMutation(
    (period: "weekly" | "monthly" | "yearly") => 
      api<{ id: string }>("/api/reports", { method: "POST", json: { period } }),
    {
      successMessage: "Laporan dibuat.",
      errorMessage: "Gagal membuat laporan saat ini.",
      onSuccess: ({ data }) => router.push(`/reports/${data.id}`),
      onError: () => setActivePeriod(null)
    }
  );

  function generate(period: "weekly" | "monthly" | "yearly") {
    setActivePeriod(period);
    mutate(period).catch(() => {});
  }

  const labels = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" } as const;

  return (
    <div className="flex flex-wrap gap-2">
      {(["weekly", "monthly", "yearly"] as const).map((p) => (
        <Button key={p} variant={p === "weekly" ? "primary" : "secondary"} loading={activePeriod === p && isMutating} disabled={isMutating} onClick={() => generate(p)}>
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
