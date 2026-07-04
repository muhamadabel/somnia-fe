"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { Check, Trash2 } from "lucide-react";

export function ModerationActions({ reportId }: { reportId: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function act(action: "dismiss" | "remove-content") {
    setBusy(action);
    try {
      const { message } = await api(`/api/admin/reports/${reportId}`, { method: "POST", json: { action } });
      toast("success", message);
      window.location.reload();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Tindakan gagal.");
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => act("dismiss")} loading={busy === "dismiss"} disabled={busy !== null}>
        <Check className="size-3.5" /> Abaikan
      </Button>
      <Button variant="danger" size="sm" onClick={() => act("remove-content")} loading={busy === "remove-content"} disabled={busy !== null}>
        <Trash2 className="size-3.5" /> Hapus konten
      </Button>
    </div>
  );
}
