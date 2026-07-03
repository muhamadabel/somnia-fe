import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { aiModeLabel } from "@/lib/ai";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboardedAt) redirect("/onboarding");

  const unread = await db.notification.count({ where: { userId: user.id, readAt: null } });

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-base">
      <Sidebar
        user={{ fullName: user.fullName, email: user.email, role: user.role }}
        aiMode={aiModeLabel()}
        unread={unread}
      />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
