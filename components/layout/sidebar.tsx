"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { api } from "@/lib/client";
import { clearToken } from "@/lib/session";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessagesSquare,
  MoonStar,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/dreams", label: "Mimpi", icon: BookOpenText },
  { href: "/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/trends", label: "Tren Emosi", icon: LineChart },
  { href: "/gallery", label: "Galeri", icon: Images },
  { href: "/symbols", label: "Simbol", icon: Sparkles },
  { href: "/reports", label: "Laporan", icon: ScrollText },
  { href: "/companion", label: "Teman AI", icon: MessagesSquare },
  { href: "/community", label: "Komunitas", icon: HeartHandshake },
];

export function Sidebar({
  user,
  aiMode,
  unread = 0,
}: {
  user: { fullName: string; email: string; role: string };
  aiMode: { id: string; label: string };
  unread?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
    window.location.href = "/login";
  }

  const nav = (
    <nav className="flex flex-col gap-1 flex-1" aria-label="Main navigation">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-night-600 text-white shadow-dreamy"
                : "text-muted hover:text-body hover:bg-(--surface-2)"
            )}
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/notifications"
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          pathname.startsWith("/notifications")
            ? "bg-night-600 text-white shadow-dreamy"
            : "text-muted hover:text-body hover:bg-(--surface-2)"
        )}
      >
        <Bell className="size-4.5 shrink-0" />
        Notifikasi
        {unread > 0 && (
          <span className="ml-auto rounded-full bg-dusk-500 text-white text-[11px] font-semibold px-2 py-0.5">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
      {user.role === "admin" && (
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/admin")
              ? "bg-night-600 text-white shadow-dreamy"
              : "text-muted hover:text-body hover:bg-(--surface-2)"
          )}
        >
          <ShieldCheck className="size-4.5 shrink-0" />
          Admin
        </Link>
      )}
    </nav>
  );

  const footer = (
    <div className="mt-auto space-y-3">
      <div
        className="flex items-center gap-2 rounded-xl surface-2 px-3 py-2 text-xs text-muted"
        title={
          aiMode.id === "anthropic"
            ? "Fitur AI ditenagai oleh Claude."
            : aiMode.id === "pollinations"
              ? "AI gratis tanpa kunci (Pollinations) — membaca seluruh riwayat mimpimu, dengan cadangan mesin lokal saat offline."
              : "Mesin lokal bawaan menggerakkan semua fitur AI, sepenuhnya offline."
        }
      >
        <span className={cn("size-2 rounded-full", aiMode.id === "anthropic" ? "bg-emerald-500" : aiMode.id === "pollinations" ? "bg-sky-500" : "bg-amber-500")} />
        AI: {aiMode.label}
      </div>
      <div className="flex items-center gap-3 px-1">
        <Link
          href="/settings"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 flex-1 min-w-0 group"
          title="Profil & pengaturan"
        >
          <span className="size-9 shrink-0 rounded-full bg-gradient-to-br from-night-400 to-night-700 text-white grid place-items-center text-sm font-semibold">
            {user.fullName.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-body truncate group-hover:underline">{user.fullName}</span>
            <span className="block text-xs text-muted truncate">{user.email}</span>
          </span>
        </Link>
        <Link href="/settings" aria-label="Pengaturan" className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)">
          <Settings className="size-4.5" />
        </Link>
        <button onClick={logout} aria-label="Keluar" className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-(--surface-2) cursor-pointer">
          <LogOut className="size-4.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 surface border-b border-base flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-body">
          <MoonStar className="size-5 text-night-500" /> {APP_NAME}
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2) cursor-pointer"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-night-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 surface border-r border-base p-4 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <span className="flex items-center gap-2 font-semibold text-body">
                <MoonStar className="size-5 text-night-500" /> {APP_NAME}
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-muted hover:text-body cursor-pointer">
                <X className="size-5" />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col surface border-r border-base p-4 sticky top-0 h-screen overflow-y-auto">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-body px-2 mb-6">
          <MoonStar className="size-6 text-night-500" /> {APP_NAME}
        </Link>
        {nav}
        {footer}
      </aside>
    </>
  );
}
