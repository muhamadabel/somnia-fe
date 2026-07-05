"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { api } from "@/lib/client";
import { clearToken } from "@/lib/session";
import { prefetchRoute } from "@/lib/prefetch";
import { UserAvatar } from "@/components/layout/avatar";
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
  user: { fullName: string; email: string; avatarPath?: string | null; role: string };
  aiMode: { id: string; label: string };
  unread?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
    router.push("/login");
  }

  const nav = (
    <nav className="flex flex-col gap-1 flex-1" aria-label="Main navigation">
      {user.role === "admin" && (
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/admin")
              ? "bg-ice-tint text-signal-blue dark:bg-(--surface-2) dark:text-white font-bold shadow-sm"
              : "text-muted hover:text-body hover:bg-(--surface-2)"
          )}
        >
          <ShieldCheck className={cn("size-4.5 shrink-0", pathname.startsWith("/admin") ? "text-signal-blue dark:text-white" : "text-muted")} />
          Admin
        </Link>
      )}
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => prefetchRoute(item.href)}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-ice-tint text-signal-blue dark:bg-(--surface-2) dark:text-white font-bold shadow-sm"
                : "text-muted hover:text-body hover:bg-(--surface-2)"
            )}
          >
            <item.icon className={cn("size-4.5 shrink-0", active ? "text-signal-blue dark:text-white" : "text-muted")} />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/notifications"
        onMouseEnter={() => prefetchRoute("/notifications")}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          pathname.startsWith("/notifications")
            ? "bg-ice-tint text-signal-blue dark:bg-(--surface-2) dark:text-white font-bold shadow-sm"
            : "text-muted hover:text-body hover:bg-(--surface-2)"
        )}
      >
        <Bell className={cn("size-4.5 shrink-0", pathname.startsWith("/notifications") ? "text-signal-blue dark:text-white" : "text-muted")} />
        Notifikasi
        {unread > 0 && (
          <span className="ml-auto rounded-full bg-active-teal text-white text-[11px] font-semibold px-2 py-0.5">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
    </nav>
  );

  const footer = (
    <div className="mt-auto space-y-3">
      <div className="flex items-center gap-3 px-1">
        <Link
          href="/settings"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 flex-1 min-w-0 group"
          title="Profil & pengaturan"
        >
          <UserAvatar name={user.fullName} avatarPath={user.avatarPath} className="size-9 shrink-0 text-sm" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-body truncate group-hover:underline">{user.fullName}</span>
            <span className="block text-xs text-muted truncate">{user.email}</span>
          </span>
        </Link>
        <Link href="/settings" aria-label="Pengaturan" className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)">
          <Settings className="size-4.5" />
        </Link>
        <button onClick={logout} aria-label="Keluar" className="p-2 rounded-lg text-muted hover:text-rose-500 hover:bg-(--surface-2) cursor-pointer">
          <LogOut className="size-4.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 surface border-b border-base flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center px-2 py-1">
          <span className="font-extrabold text-2xl tracking-tighter text-signal-blue lowercase">somnia</span>
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
              <span className="font-extrabold text-2xl tracking-tighter text-signal-blue lowercase px-2">somnia</span>
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
        <Link href="/dashboard" className="flex items-center px-2 mb-6">
          <span className="font-extrabold text-2xl tracking-tighter text-signal-blue lowercase">somnia</span>
        </Link>
        {nav}
        {footer}
      </aside>
    </>
  );
}
