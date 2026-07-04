"use client";

import { PageHeader } from "@/components/layout/page-header";
import { NotificationList, type NotificationItem } from "@/components/notifications/notification-list";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";

export default function NotificationsPage() {
  const { data, loading } = useApi<NotificationItem[]>("/api/notifications");

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Notifikasi" />
      {loading || !data ? <PageSkeleton /> : <NotificationList initial={data} />}
    </div>
  );
}
