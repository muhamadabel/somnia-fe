"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";

interface ProfileResponse {
  fullName: string;
  email: string;
  anonName: string;
  timezone: string;
  language: string;
  theme: string;
  reminderEnabled: boolean;
  reminderTime: string;
  weeklyDigest: boolean;
  communityAlerts: boolean;
  aiMemoryEnabled: boolean;
  createdAt: string;
  stats: { dreamCount: number; analysisCount: number; postCount: number; artCount: number };
}

export default function SettingsPage() {
  const { data, loading } = useApi<ProfileResponse>("/api/user/profile");
  const { data: session } = useApi<{ aiMode?: { id: string; label: string } }>("/api/auth/session");

  if (loading || !data) return <PageSkeleton />;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Pengaturan" />
      <SettingsForm
        user={{
          fullName: data.fullName,
          email: data.email,
          anonName: data.anonName,
          timezone: data.timezone,
          language: data.language,
          theme: data.theme,
          reminderEnabled: data.reminderEnabled,
          reminderTime: data.reminderTime,
          weeklyDigest: data.weeklyDigest,
          communityAlerts: data.communityAlerts,
          aiMemoryEnabled: data.aiMemoryEnabled,
          memberSince: data.createdAt,
        }}
        stats={data.stats}
        aiMode={session?.aiMode}
      />
    </div>
  );
}
