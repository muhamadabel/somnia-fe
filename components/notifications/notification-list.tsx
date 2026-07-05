"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { cn, timeAgo } from "@/lib/utils";
import { Bell, Check, Download, HeartHandshake, MessageCircle, MoonStar, ScrollText, Trash2, TriangleAlert } from "lucide-react";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

const ICONS: Record<string, React.ReactNode> = {
  welcome: <MoonStar className="size-4.5" />,
  report: <ScrollText className="size-4.5" />,
  comment: <MessageCircle className="size-4.5" />,
  reaction: <MessageCircle className="size-4.5" />,
  system: <Bell className="size-4.5" />,
  mental_health_alert: <HeartHandshake className="size-4.5" />,
};

/** Kartu khusus untuk notifikasi pola emosi negatif */
function MentalHealthAlertCard({
  n,
  onRead,
  onRemove,
}: {
  n: NotificationItem;
  onRead: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="rounded-[20px] border border-amber-300/60 dark:border-amber-600/40 bg-amber-50/80 dark:bg-amber-950/20 shadow-sm p-5">
      <div className="flex items-start gap-4">
        <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-3 mt-0.5">
          <TriangleAlert className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">{n.title}</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">{n.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {n.link && (
              <Link
                href={n.link}
                onClick={onRead}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-full px-3.5 py-1.5 transition-colors"
              >
                <ScrollText className="size-3.5" /> Lihat Laporan
              </Link>
            )}
            {n.link && (
              <Link
                href={n.link}
                onClick={() => {
                  onRead();
                  // Buka halaman laporan lalu trigger print setelah halaman termuat
                  setTimeout(() => window.print(), 800);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full px-3.5 py-1.5 transition-colors"
              >
                <Download className="size-3.5" /> Unduh Laporan (PDF)
              </Link>
            )}
            <Link
              href="/reports"
              onClick={onRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full px-3.5 py-1.5 transition-colors"
            >
              Buat Laporan Baru
            </Link>
          </div>
          <time className="mt-2 block text-[11px] text-amber-600/70 dark:text-amber-500/70">{timeAgo(n.createdAt)}</time>
        </div>
        <button
          onClick={onRemove}
          aria-label="Hapus notifikasi"
          className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer shrink-0"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}

export function NotificationList({ initial }: { initial: NotificationItem[] }) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.readAt).length;

  const { mutate: doRemove } = useMutation(
    (id: string) => api(`/api/notifications/${id}`, { method: "DELETE" }),
    { errorMessage: "Gagal menghapus notifikasi." }
  );

  async function markAll() {
    setItems((it) => it.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    await api("/api/notifications", { method: "POST" }).catch(() => {});
  }

  async function markOne(id: string) {
    setItems((it) => it.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)));
    await api(`/api/notifications/${id}`, { method: "POST" }).catch(() => {});
  }

  function remove(id: string) {
    setItems((it) => it.filter((n) => n.id !== id));
    doRemove(id).catch(() => {});
  }

  if (items.length === 0) {
    return (
      <div className="card p-10 text-center">
        <Bell className="size-7 text-night-400 mx-auto" />
        <p className="mt-3 text-sm text-muted">Semua tenang — belum ada yang baru.</p>
      </div>
    );
  }

  return (
    <>
      {unread > 0 && (
        <div className="flex justify-end mb-3">
          <Button variant="secondary" size="sm" onClick={markAll} className="text-night-600 dark:text-night-300 border-night-300 dark:border-night-600 hover:bg-night-100 dark:hover:bg-night-800">
            <Check className="size-4" /> Tandai semua dibaca ({unread})
          </Button>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((n) => {
          // Render khusus untuk notifikasi kesehatan mental
          if (n.type === "mental_health_alert") {
            return (
              <MentalHealthAlertCard
                key={n.id}
                n={n}
                onRead={() => markOne(n.id)}
                onRemove={() => remove(n.id)}
              />
            );
          }

          // Render standar untuk notifikasi lainnya
          const inner = (
            <div className="flex gap-3 flex-1 min-w-0 items-center">
              <span className={cn("shrink-0 rounded-xl p-2.5", n.readAt ? "surface-2 text-muted" : "bg-night-100 dark:bg-night-800 text-night-600 dark:text-night-300")}>
                {ICONS[n.type] ?? ICONS.system}
              </span>
              <div className="min-w-0">
                <p className={cn("text-sm", n.readAt ? "text-muted" : "font-semibold text-body")}>{n.title}</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
                <time className="text-[11px] text-muted">{timeAgo(n.createdAt)}</time>
              </div>
            </div>
          );
          return (
            <li key={n.id} className={cn("card p-4 flex items-center gap-2", !n.readAt && "border-night-300 dark:border-night-600")}>
              {n.link ? (
                <Link href={n.link} onClick={() => markOne(n.id)} className="flex flex-1 min-w-0">
                  {inner}
                </Link>
              ) : (
                <button onClick={() => markOne(n.id)} className="flex flex-1 min-w-0 text-left cursor-pointer">
                  {inner}
                </button>
              )}
              <button
                onClick={() => remove(n.id)}
                aria-label="Hapus notifikasi"
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer shrink-0"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
