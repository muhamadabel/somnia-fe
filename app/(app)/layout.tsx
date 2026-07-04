"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { api } from "@/lib/client";
import { hasToken } from "@/lib/session";
import { MoonStar } from "lucide-react";

interface SessionData {
  authenticated: boolean;
  user?: { id: string; fullName: string; email: string; role: string; theme: string; onboarded: boolean };
  aiMode?: { id: string; label: string };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }
    let alive = true;
    (async () => {
      try {
        const { data } = await api<SessionData>("/api/auth/session");
        if (!alive) return;
        if (!data.authenticated || !data.user) {
          router.replace("/login");
          return;
        }
        if (!data.user.onboarded) {
          router.replace("/onboarding");
          return;
        }
        setSession(data);
        // Notifications count is best-effort.
        api<Array<{ readAt: string | null }>>("/api/notifications")
          .then(({ data }) => alive && setUnread(data.filter((n) => !n.readAt).length))
          .catch(() => {});
      } catch {
        if (alive) router.replace("/login");
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  if (!session?.user) {
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
        user={{ fullName: session.user.fullName, email: session.user.email, role: session.user.role }}
        aiMode={session.aiMode ?? { id: "local", label: "AI" }}
        unread={unread}
      />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
