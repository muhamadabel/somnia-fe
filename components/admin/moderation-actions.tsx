"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { Check, Trash2 } from "lucide-react";

export function ModerationActions({ reportId }: { reportId: string }) {
  const router = useRouter();

  const { mutate: dismiss, isMutating: dismissing } = useMutation(
    () => api<{ message: string }>(`/api/admin/reports/${reportId}`, { method: "POST", json: { action: "dismiss" } }),
    { successMessage: (data) => data.message, errorMessage: "Tindakan gagal.", onSuccess: () => router.refresh() }
  );

  const { mutate: remove, isMutating: removing } = useMutation(
    () => api<{ message: string }>(`/api/admin/reports/${reportId}`, { method: "POST", json: { action: "remove-content" } }),
    { successMessage: (data) => data.message, errorMessage: "Tindakan gagal.", onSuccess: () => router.refresh() }
  );

  const isMutating = dismissing || removing;
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => dismiss().catch(() => {})} loading={dismissing} disabled={isMutating}>
        <Check className="size-3.5" /> Abaikan
      </Button>
      <Button variant="danger" size="sm" onClick={() => remove().catch(() => {})} loading={removing} disabled={isMutating}>
        <Trash2 className="size-3.5" /> Hapus konten
      </Button>
    </div>
  );
}
