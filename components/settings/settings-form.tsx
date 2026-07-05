"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { DEFAULT_AVATAR_PATH } from "@/lib/avatar-presets";
import { ProfileSection } from "./profile-section";
import { PreferencesSection } from "./preferences-section";
import { SecuritySection } from "./security-section";
import { DangerZone } from "./danger-zone";

export interface SettingsUser {
  fullName: string;
  email: string;
  anonName: string;
  avatarPath: string | null;
  timezone: string;
  language: string;
  theme: string;
  reminderEnabled: boolean;
  reminderTime: string;
  weeklyDigest: boolean;
  communityAlerts: boolean;
  aiMemoryEnabled: boolean;
  memberSince: string;
}

export function SettingsForm({
  user,
  stats,
  aiMode,
}: {
  user: SettingsUser;
  stats: { dreamCount: number; analysisCount: number; postCount: number; artCount: number };
  aiMode?: { id: string; label: string };
}) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(user);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    const activeTheme = localStorage.getItem("somnia_theme") || user.theme || "light";
    setPrefs((p) => ({ ...p, theme: activeTheme }));
  }, [user.theme]);

  const { mutate: updateProfile, isMutating: updatingProfile } = useMutation(
    (json: any) => api("/api/user/profile", { method: "PATCH", json }),
    {
      successMessage: "Profil diperbarui.",
      errorMessage: "Gagal menyimpan profil.",
      onSuccess: () => router.refresh()
    }
  );

  function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    updateProfile({
      fullName: form.get("fullName"),
      timezone: form.get("timezone"),
      language: form.get("language"),
      avatarPath: form.get("avatarPath") || DEFAULT_AVATAR_PATH,
    }).catch(() => {});
  }

  const { mutate: updatePrefs } = useMutation(
    (patch: any) => api("/api/user/profile", { method: "PATCH", json: patch }),
    { errorMessage: "Gagal menyimpan preferensi.", onError: () => setPrefs(prefs) }
  );

  function savePrefs(patch: Partial<SettingsUser>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    updatePrefs({
      kind: "preferences",
      reminderEnabled: next.reminderEnabled,
      reminderTime: next.reminderTime,
      weeklyDigest: next.weeklyDigest,
      communityAlerts: next.communityAlerts,
      aiMemoryEnabled: next.aiMemoryEnabled,
    }).catch(() => {});
  }

  const { mutate: updateTheme } = useMutation(
    (theme: string) => api("/api/user/profile", { method: "PATCH", json: { theme } }),
    { errorMessage: "Gagal menyimpan tema." }
  );

  function setTheme(theme: string) {
    setPrefs((p) => ({ ...p, theme }));
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("somnia_theme", theme);
    updateTheme(theme).catch(() => {});
  }

  const { mutate: doChangePassword, isMutating: changingPassword } = useMutation(
    (json: any) => api("/api/user/profile", { method: "PATCH", json }),
    { successMessage: "Kata sandi diperbarui.", errorMessage: "Gagal mengubah kata sandi." }
  );

  function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    doChangePassword({ kind: "password", currentPassword: fd.get("currentPassword"), newPassword: fd.get("newPassword") })
      .then(() => form.reset())
      .catch(() => {});
  }

  const { mutate: doDeleteAccount, isMutating: deletingAccount } = useMutation(
    () => api("/api/user/profile", { method: "DELETE", json: { confirm: deleteConfirm } }),
    { 
      successMessage: "Akun dihapus. Jaga dirimu baik-baik. 🌙",
      errorMessage: "Gagal menghapus akun.",
      onSuccess: () => import("@/lib/session").then((s) => {
        s.clearToken();
        router.push("/");
      })
    }
  );

  function deleteAccount() {
    doDeleteAccount().catch(() => {});
  }

  return (
    <div className="space-y-6">
      <ProfileSection
        user={user}
        stats={stats}
        avatarPath={prefs.avatarPath || ""}
        onAvatarChange={(avatarPath) => setPrefs((current) => ({ ...current, avatarPath }))}
        onSubmit={saveProfile}
        loading={updatingProfile}
      />

      <PreferencesSection
        prefs={prefs}
        aiMode={aiMode}
        onThemeChange={setTheme}
        onPrefsChange={savePrefs}
      />

      <SecuritySection
        onSubmit={changePassword}
        loading={changingPassword}
      />

      <DangerZone
        email={user.email}
        deleteOpen={deleteOpen}
        onDeleteOpenChange={setDeleteOpen}
        deleteConfirm={deleteConfirm}
        onDeleteConfirmChange={setDeleteConfirm}
        onSubmit={deleteAccount}
        loading={deletingAccount}
      />
    </div>
  );
}

