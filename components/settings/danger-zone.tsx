import React from "react";
import { Trash2, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

interface DangerZoneProps {
  email: string;
  deleteOpen: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  deleteConfirm: string;
  onDeleteConfirmChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function DangerZone({
  email,
  deleteOpen,
  onDeleteOpenChange,
  deleteConfirm,
  onDeleteConfirmChange,
  onSubmit,
  loading,
}: DangerZoneProps) {
  return (
    <section className="card p-6 border-rose-200 dark:border-rose-900/50">
      <h2 className="flex items-center gap-2 font-semibold text-rose-600 dark:text-rose-400 mb-2">
        <Trash2 className="size-4.5" /> Zona berbahaya
      </h2>
      <p className="text-sm text-muted mb-4">
        Menghapus akun akan menghilangkan permanen semua mimpi, analisis, karya seni, laporan, dan
        percakapan. Tidak bisa dibatalkan.
      </p>
      <Button variant="danger" onClick={() => onDeleteOpenChange(true)}>Hapus akunku</Button>

      <Modal open={deleteOpen} onClose={() => onDeleteOpenChange(false)} title="Hapus akun permanen?">
        <p className="text-sm text-muted mb-4">
          Ini menghapus semua datamu. Ketik <span className="font-semibold text-body">{email}</span> untuk konfirmasi.
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => onDeleteConfirmChange(e.target.value)}
          placeholder={email}
          aria-label="Ketik emailmu untuk konfirmasi"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onDeleteOpenChange(false)}>Batal</Button>
          <Button variant="danger" onClick={onSubmit} loading={loading} disabled={deleteConfirm !== email}>
            <Moon className="size-4" /> Hapus semuanya
          </Button>
        </div>
      </Modal>
    </section>
  );
}
