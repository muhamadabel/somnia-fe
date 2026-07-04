"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Bell, BrainCircuit, Moon, Palette, ShieldCheck, Trash2, User } from "lucide-react";

interface SettingsUser {
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
  memberSince: string;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer">
      <span>
        <span className="block text-sm font-medium text-body">{label}</span>
        <span className="block text-xs text-muted mt-0.5 leading-relaxed">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="w-10 h-6 rounded-full surface-2 border border-base peer-checked:bg-night-600 peer-checked:border-night-600 transition-colors" />
        <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export function SettingsForm({
  user,
  stats,
}: {
  user: SettingsUser;
  stats: { dreamCount: number; analysisCount: number; postCount: number; artCount: number };
}) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [prefs, setPrefs] = useState(user);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy("profile");
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/user/profile", {
        method: "PATCH",
        json: { fullName: form.get("fullName"), timezone: form.get("timezone"), language: form.get("language") },
      });
      toast("success", "Profil diperbarui.");
      window.location.reload();
      return;
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menyimpan profil.");
    } finally {
      setBusy(null);
    }
  }

  async function savePrefs(patch: Partial<SettingsUser>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    try {
      await api("/api/user/profile", {
        method: "PATCH",
        json: {
          kind: "preferences",
          reminderEnabled: next.reminderEnabled,
          reminderTime: next.reminderTime,
          weeklyDigest: next.weeklyDigest,
          communityAlerts: next.communityAlerts,
          aiMemoryEnabled: next.aiMemoryEnabled,
        },
      });
    } catch {
      toast("error", "Gagal menyimpan preferensi.");
      setPrefs(prefs);
    }
  }

  async function setTheme(theme: string) {
    setPrefs((p) => ({ ...p, theme }));
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      await api("/api/user/profile", { method: "PATCH", json: { theme } });
      localStorage.setItem("somnia_theme", theme);
    } catch {
      toast("error", "Gagal menyimpan tema.");
    }
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy("password");
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api("/api/user/profile", {
        method: "PATCH",
        json: { kind: "password", currentPassword: fd.get("currentPassword"), newPassword: fd.get("newPassword") },
      });
      toast("success", "Kata sandi diperbarui.");
      form.reset();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal mengubah kata sandi.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteAccount() {
    setBusy("delete");
    try {
      await api("/api/user/profile", { method: "DELETE", json: { confirm: deleteConfirm } });
      const { clearToken } = await import("@/lib/session");
      clearToken();
      toast("success", "Akun dihapus. Jaga dirimu baik-baik. 🌙");
      window.location.href = "/";
      return;
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Gagal menghapus akun.");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Profile ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-1">
          <User className="size-4.5 text-night-500" /> Profil
        </h2>
        <p className="text-xs text-muted mb-4">
          Anggota sejak {formatDate(user.memberSince, { month: "long" })} · {stats.dreamCount} mimpi ·{" "}
          {stats.analysisCount} analisis · {stats.artCount} karya seni · {stats.postCount} dibagikan
        </p>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nama" name="fullName" defaultValue={user.fullName} required minLength={2} maxLength={60} />
            <Input label="Email" value={user.email} disabled hint="Perubahan email butuh bantuan dukungan." />
            <Input label="Zona waktu" name="timezone" defaultValue={user.timezone} />
            <Select label="Bahasa" name="language" defaultValue={user.language} hint="Bahasa antarmuka.">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </Select>
          </div>
          <div className="rounded-xl surface-2 px-4 py-3 text-xs text-muted">
            Nama samaran komunitas: <span className="font-medium text-body">{user.anonName}</span> — ini satu-satunya
            nama yang dilihat pengguna lain.
          </div>
          <Button type="submit" loading={busy === "profile"}>Simpan profil</Button>
        </form>
      </section>

      {/* ── Appearance ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-4">
          <Palette className="size-4.5 text-night-500" /> Tampilan
        </h2>
        <div className="flex gap-3">
          {[
            { value: "light", label: "Terang", icon: "☀️" },
            { value: "dark", label: "Gelap", icon: "🌙" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              aria-pressed={prefs.theme === t.value}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                prefs.theme === t.value
                  ? "border-night-500 bg-night-100 dark:bg-night-800 text-body"
                  : "border-base surface text-muted hover:text-body"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-2">
          <Bell className="size-4.5 text-night-500" /> Notifikasi
        </h2>
        <div className="divide-y divide-(--border)">
          <Toggle
            checked={prefs.reminderEnabled}
            onChange={(v) => savePrefs({ reminderEnabled: v })}
            label="Pengingat mimpi harian"
            description="Dorongan lembut untuk mencatat mimpi setelah bangun."
          />
          {prefs.reminderEnabled && (
            <div className="py-3">
              <Input
                label="Waktu pengingat"
                type="time"
                value={prefs.reminderTime}
                onChange={(e) => savePrefs({ reminderTime: e.target.value })}
                className="max-w-40"
              />
            </div>
          )}
          <Toggle
            checked={prefs.weeklyDigest}
            onChange={(v) => savePrefs({ weeklyDigest: v })}
            label="Notifikasi laporan mingguan"
            description="Dapatkan pemberitahuan saat laporan kesejahteraan mingguanmu siap."
          />
          <Toggle
            checked={prefs.communityAlerts}
            onChange={(v) => savePrefs({ communityAlerts: v })}
            label="Aktivitas komunitas"
            description="Komentar dan reaksi pada mimpi yang kamu bagikan."
          />
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-2">
          <BrainCircuit className="size-4.5 text-night-500" /> Privasi & AI
        </h2>
        <div className="divide-y divide-(--border)">
          <Toggle
            checked={prefs.aiMemoryEnabled}
            onChange={(v) => savePrefs({ aiMemoryEnabled: v })}
            label="Izinkan AI memakai riwayat mimpiku"
            description="Teman AI dan analisis merujuk mimpi-mimpi lamamu sebagai konteks. Menonaktifkannya membuat jawaban AI umum, tapi jurnal tetap berfungsi penuh."
          />
        </div>
        <p className="mt-3 text-xs text-muted leading-relaxed">
          Mimpimu tidak pernah dibagikan ke pengguna lain kecuali kamu memublikasikannya secara eksplisit.
          Aktivitas komunitas selalu memakai nama samaranmu.
        </p>
      </section>

      {/* ── Security ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-4">
          <ShieldCheck className="size-4.5 text-night-500" /> Keamanan
        </h2>
        <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
          <Input label="Kata sandi saat ini" name="currentPassword" type="password" required autoComplete="current-password" />
          <Input
            label="Kata sandi baru"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            hint="Min. 8 karakter dengan huruf dan angka."
          />
          <div className="sm:col-span-2">
            <Button type="submit" variant="secondary" loading={busy === "password"}>Ubah kata sandi</Button>
          </div>
        </form>
      </section>

      {/* ── Danger zone ── */}
      <section className="card p-6 border-red-200 dark:border-red-900/50">
        <h2 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400 mb-2">
          <Trash2 className="size-4.5" /> Zona berbahaya
        </h2>
        <p className="text-sm text-muted mb-4">
          Menghapus akun akan menghilangkan permanen semua mimpi, analisis, karya seni, laporan, dan
          percakapan. Tidak bisa dibatalkan.
        </p>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>Hapus akunku</Button>
      </section>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Hapus akun permanen?">
        <p className="text-sm text-muted mb-4">
          Ini menghapus semua datamu. Ketik <span className="font-semibold text-body">{user.email}</span> untuk konfirmasi.
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder={user.email}
          aria-label="Ketik emailmu untuk konfirmasi"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={deleteAccount} loading={busy === "delete"} disabled={deleteConfirm !== user.email}>
            <Moon className="size-4" /> Hapus semuanya
          </Button>
        </div>
      </Modal>
    </div>
  );
}
