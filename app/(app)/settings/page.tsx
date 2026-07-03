import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  const [dreamCount, analysisCount, postCount, streakDreams] = await Promise.all([
    db.dream.count({ where: { userId: user.id, deletedAt: null, isDraft: false } }),
    db.analysis.count({ where: { dream: { userId: user.id, deletedAt: null } } }),
    db.communityPost.count({ where: { userId: user.id, deletedAt: null } }),
    db.visualization.count({ where: { deletedAt: null, dream: { userId: user.id } } }),
  ]);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Pengaturan" subtitle="Profil, privasi, notifikasi, dan tampilan." />
      <SettingsForm
        user={{
          fullName: user.fullName,
          email: user.email,
          anonName: user.anonName,
          timezone: user.timezone,
          language: user.language,
          theme: user.theme,
          reminderEnabled: user.reminderEnabled,
          reminderTime: user.reminderTime,
          weeklyDigest: user.weeklyDigest,
          communityAlerts: user.communityAlerts,
          aiMemoryEnabled: user.aiMemoryEnabled,
          memberSince: user.createdAt.toISOString(),
        }}
        stats={{ dreamCount, analysisCount, postCount, artCount: streakDreams }}
      />
    </div>
  );
}
