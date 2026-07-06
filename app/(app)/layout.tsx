"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { api } from "@/lib/client";
import { hasToken } from "@/lib/session";
import { useApi } from "@/lib/use-api";
import { prefetchRoute } from "@/lib/prefetch";
import { MoonStar } from "lucide-react";

interface SessionData {
  authenticated: boolean;
  user?: { id: string; fullName: string; email: string; avatarPath?: string | null; role: string; theme: string; onboarded: boolean };
  aiMode?: { id: string; label: string };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [unread, setUnread] = useState(0);
  const { data: session } = useApi<SessionData>("/api/auth/session");

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!session) return;
    if (!session.authenticated || !session.user) {
      router.replace("/login");
      return;
    }
    if (!session.user.onboarded) {
      router.replace("/onboarding");
      return;
    }
    setReady(true);
    prefetchRoute("/dashboard");
    let alive = true;
    api<Array<{ readAt: string | null }>>("/api/notifications")
      .then(({ data }) => alive && setUnread(data.filter((n) => !n.readAt).length))
      .catch(() => {});
    return () => { alive = false; };
  }, [session, router]);

  if (!ready || !session?.user) {
    return (
      <div className="min-h-screen bg-base grid place-items-center">
        <div className="flex items-center gap-2 text-muted animate-pulse-soft">
          <MoonStar className="size-6 text-night-500" /> Memuat…
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen flex-col lg:flex-row bg-base"
      style={{
        backgroundImage: "linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('/work-book.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <Sidebar
        user={{
          fullName: session.user.fullName,
          email: session.user.email,
          avatarPath: session.user.avatarPath,
          role: session.user.role,
        }}
        aiMode={session.aiMode ?? { id: "local", label: "AI" }}
        unread={unread}
      />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
