"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/client";
import { cn, timeAgo } from "@/lib/utils";
import { Bell, Check, MessageCircle, MoonStar, ScrollText, Trash2 } from "lucide-react";

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
};

export function NotificationList({ initial }: { initial: NotificationItem[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.readAt).length;

  async function markAll() {
    setItems((it) => it.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    await api("/api/notifications", { method: "POST" }).catch(() => {});
  }

  async function markOne(id: string) {
    setItems((it) => it.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)));
    await api(`/api/notifications/${id}`, { method: "POST" }).catch(() => {});
  }

  async function remove(id: string) {
    setItems((it) => it.filter((n) => n.id !== id));
    try {
      await api(`/api/notifications/${id}`, { method: "DELETE" });
    } catch {
      toast("error", "Gagal menghapus notifikasi.");
    }
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
          <Button variant="secondary" size="sm" onClick={markAll}>
            <Check className="size-4" /> Tandai semua dibaca ({unread})
          </Button>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((n) => {
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
