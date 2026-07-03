"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { Archive, ArchiveRestore, Pencil, Share2, Trash2 } from "lucide-react";

export function DreamActions({
  dreamId,
  title,
  archived,
  shared,
  isDraft,
}: {
  dreamId: string;
  title: string;
  archived: boolean;
  shared: boolean;
  isDraft: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    setBusy(true);
    try {
      await api(`/api/dreams/${dreamId}`, { method: "DELETE" });
      toast("success", "Mimpi dipindahkan ke sampah.");
      router.push("/dreams");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menghapus.");
      setBusy(false);
    }
  }

  async function toggleArchive() {
    setBusy(true);
    try {
      const { message } = await api(`/api/dreams/${dreamId}/archive`, { method: "POST" });
      toast("success", message);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Tindakan gagal.");
    } finally {
      setBusy(false);
    }
  }

  async function share(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/community/posts", {
        method: "POST",
        json: {
          dreamId,
          title: String(form.get("title") ?? "").trim(),
          note: String(form.get("note") ?? "").trim() || null,
        },
      });
      toast("success", "Mimpi dibagikan ke komunitas (anonim).");
      setShareOpen(false);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal membagikan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/dreams/${dreamId}/edit`}
        className="inline-flex items-center gap-1.5 surface border-base rounded-xl px-3.5 py-2 text-sm font-medium text-body hover:bg-(--surface-2) transition-colors"
      >
        <Pencil className="size-4" /> Edit
      </Link>
      {!isDraft && (
        <>
          <Button variant="secondary" size="md" onClick={toggleArchive} disabled={busy}>
            {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
            {archived ? "Keluarkan arsip" : "Arsipkan"}
          </Button>
          <Button variant="secondary" size="md" onClick={() => setShareOpen(true)} disabled={shared || busy} title={shared ? "Sudah dibagikan ke komunitas" : undefined}>
            <Share2 className="size-4" /> {shared ? "Dibagikan" : "Bagikan"}
          </Button>
        </>
      )}
      <Button variant="ghost" size="md" className="hover:text-red-500" onClick={() => setConfirmDelete(true)} disabled={busy}>
        <Trash2 className="size-4" /> Hapus
      </Button>

      {/* ── Delete confirmation ── */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Hapus mimpi ini?">
        <p className="text-sm text-muted leading-relaxed">
          “{title}” akan dipindahkan ke sampah beserta analisis dan karya seninya. Ini memakai soft-delete —
          hubungi dukungan untuk memulihkannya dalam masa retensi.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={doDelete} loading={busy}>
            Hapus mimpi
          </Button>
        </div>
      </Modal>

      {/* ── Share modal ── */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Bagikan ke komunitas">
        <p className="text-sm text-muted leading-relaxed mb-4">
          Salinan mimpi ini akan dipublikasikan dengan nama anonimmu. Identitasmu tetap tersembunyi, dan
          perubahan mimpi pribadi ke depan tidak akan mengubah salinan yang dibagikan.
        </p>
        <form onSubmit={share} className="space-y-4">
          <Input label="Judul postingan" name="title" defaultValue={title} required maxLength={120} />
          <Textarea
            label="Tambahkan catatan (opsional)"
            name="note"
            placeholder="Apa pun yang ingin kamu sampaikan pada sesama pemimpi…"
            maxLength={500}
            className="min-h-20"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShareOpen(false)}>
              Batal
            </Button>
            <Button type="submit" loading={busy}>
              <Share2 className="size-4" /> Bagikan anonim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
