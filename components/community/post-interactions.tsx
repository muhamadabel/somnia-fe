"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { Flag, SendHorizontal, Trash2 } from "lucide-react";

export function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    try {
      await api(`/api/community/posts/${postId}/comments`, { method: "POST", json: { content } });
      setContent("");
      toast("success", "Komentar terkirim.");
      window.location.reload();
      return;
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal mengirim komentar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-start w-full">
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Sampaikan tanggapan yang baik dan penuh perhatian…"
          aria-label="Tulis komentar"
          maxLength={1000}
          className="min-h-16 w-full"
        />
      </div>
      <Button type="submit" loading={busy} disabled={!content.trim()} aria-label="Kirim komentar" className="mt-0.5">
        <SendHorizontal className="size-4" />
      </Button>
    </form>
  );
}

export function ReportButton({ postId, commentId }: { postId?: string; commentId?: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { message } = await api("/api/community/report", {
        method: "POST",
        json: { postId, commentId, reason },
      });
      toast("success", message);
      setOpen(false);
      setReason("");
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal mengirim laporan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-rose-500 cursor-pointer"
        aria-label="Laporkan konten"
      >
        <Flag className="size-3.5" /> Laporkan
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Laporkan konten">
        <p className="text-sm text-muted mb-4">
          Beri tahu moderator apa yang salah. Laporan bersifat anonim bagi penulis.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Apa masalah dengan konten ini?"
            required
            maxLength={500}
            aria-label="Alasan laporan"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="danger" loading={busy} disabled={reason.trim().length < 3}>
              Kirim laporan
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteContentButton({
  postId,
  commentId,
  redirectTo,
}: {
  postId?: string;
  commentId?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    setBusy(true);
    try {
      await api(commentId ? `/api/community/comments/${commentId}` : `/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      toast("success", commentId ? "Komentar dihapus." : "Postingan dihapus.");
      setConfirm(false);
      if (redirectTo) {
        window.location.href = redirectTo;
      } else {
        window.location.reload();
      }
      return;
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menghapus.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 cursor-pointer"
        aria-label="Hapus"
      >
        <Trash2 className="size-3.5" /> Hapus
      </button>
      <Modal open={confirm} onClose={() => setConfirm(false)} title={commentId ? "Hapus komentar?" : "Hapus postingan?"}>
        <p className="text-sm text-muted">
          Ini menghapus {commentId ? "komentar" : "postingan"} dari komunitas. Mimpi pribadimu tidak terpengaruh.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirm(false)}>Batal</Button>
          <Button variant="danger" onClick={doDelete} loading={busy}>Hapus</Button>
        </div>
      </Modal>
    </>
  );
}
