"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { Archive, ArchiveRestore, Pencil, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { mutate: doDelete, isMutating: deleting } = useMutation(
    () => api(`/api/dreams/${dreamId}`, { method: "DELETE" }),
    {
      successMessage: "Mimpi dipindahkan ke sampah.",
      errorMessage: "Gagal menghapus.",
      onSuccess: () => router.push("/dreams")
    }
  );

  const { mutate: toggleArchive, isMutating: archiving } = useMutation(
    () => api<{ message: string }>(`/api/dreams/${dreamId}/archive`, { method: "POST" }),
    {
      successMessage: (data) => data.message,
      errorMessage: "Tindakan gagal.",
      onSuccess: () => router.refresh()
    }
  );

  const { mutate: doShare, isMutating: sharing } = useMutation(
    (json: any) => api("/api/community/posts", { method: "POST", json }),
    {
      successMessage: "Mimpi dibagikan ke komunitas (anonim).",
      errorMessage: "Gagal membagikan.",
      onSuccess: () => {
        setShareOpen(false);
        router.refresh();
      }
    }
  );

  const busy = deleting || archiving || sharing;

  function share(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    doShare({
      dreamId,
      title: String(form.get("title") ?? "").trim(),
      note: String(form.get("note") ?? "").trim() || null,
    }).catch(() => {});
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/dreams/${dreamId}/edit`}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-slate-50 shadow-[0_2px_8px_rgba(20,30,40,0.04)] transition-colors"
      >
        <Pencil className="size-4" /> Edit
      </Link>
      {!isDraft && (
        <>
          <Button variant="secondary" size="md" onClick={() => toggleArchive().catch(() => {})} disabled={busy} className="rounded-full font-semibold">
            {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
            {archived ? "Keluarkan arsip" : "Arsipkan"}
          </Button>
          <Button variant="secondary" size="md" onClick={() => setShareOpen(true)} disabled={shared || busy} title={shared ? "Sudah dibagikan ke komunitas" : undefined} className="rounded-full font-semibold">
            <Share2 className="size-4" /> {shared ? "Dibagikan" : "Bagikan"}
          </Button>
        </>
      )}
      <button 
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50" 
        onClick={() => setConfirmDelete(true)} 
        disabled={busy}
      >
        <Trash2 className="size-4" /> Hapus
      </button>

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
          <Button variant="danger" onClick={() => doDelete().catch(() => {})} loading={deleting}>
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
            <Button type="submit" loading={sharing}>
              <Share2 className="size-4" /> Bagikan anonim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
