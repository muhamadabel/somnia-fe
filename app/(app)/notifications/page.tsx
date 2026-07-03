import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationList } from "@/components/notifications/notification-list";

export const metadata = { title: "Notifikasi" };

export default async function NotificationsPage() {
  const user = (await getCurrentUser())!;
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-2xl">
      <PageHeader title="Notifikasi" subtitle="Laporan, aktivitas komunitas, dan pengingat." />
      <NotificationList
        initial={notifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link,
          readAt: n.readAt?.toISOString() ?? null,
          createdAt: n.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
