import React from "react";
import { Palette, Bell, Brain, Sun, Moon } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Input } from "@/components/ui/input";
import { Toggle } from "./toggle";
import { SettingsUser } from "./settings-form";

interface PreferencesSectionProps {
  prefs: SettingsUser;
  aiMode?: { id: string; label: string };
  onThemeChange: (theme: string) => void;
  onPrefsChange: (patch: Partial<SettingsUser>) => void;
}

export function PreferencesSection({
  prefs,
  aiMode,
  onThemeChange,
  onPrefsChange,
}: PreferencesSectionProps) {
  return (
    <div className="space-y-6">
      {/* ── Appearance ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-4">
          <Palette className="size-4.5 text-night-500" /> Tampilan
        </h2>
        <SegmentedControl
          value={prefs.theme}
          onChange={onThemeChange}
          className="max-w-xs"
          options={[
            { value: "light", label: <><Sun className="size-4 mr-2 inline" /> Terang</> },
            { value: "dark", label: <><Moon className="size-4 mr-2 inline" /> Gelap</> },
          ]}
        />
      </section>

      {/* ── Notifications ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-2">
          <Bell className="size-4.5 text-night-500" /> Notifikasi
        </h2>
        <div className="divide-y divide-(--border)">
          <Toggle
            checked={prefs.reminderEnabled}
            onChange={(v) => onPrefsChange({ reminderEnabled: v })}
            label="Pengingat mimpi harian"
            description="Dorongan lembut untuk mencatat mimpi setelah bangun."
          />
          {prefs.reminderEnabled && (
            <div className="py-3">
              <Input
                label="Waktu pengingat"
                type="time"
                value={prefs.reminderTime}
                onChange={(e) => onPrefsChange({ reminderTime: e.target.value })}
                className="max-w-40"
              />
            </div>
          )}
          <Toggle
            checked={prefs.weeklyDigest}
            onChange={(v) => onPrefsChange({ weeklyDigest: v })}
            label="Notifikasi laporan mingguan"
            description="Dapatkan pemberitahuan saat laporan kesejahteraan mingguanmu siap."
          />
          <Toggle
            checked={prefs.communityAlerts}
            onChange={(v) => onPrefsChange({ communityAlerts: v })}
            label="Aktivitas komunitas"
            description="Komentar dan reaksi pada mimpi yang kamu bagikan."
          />
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-body mb-2">
          <Brain className="size-4.5 text-night-500" /> Privasi & AI
        </h2>
        {aiMode && (
          <div className="mb-4 rounded-xl surface-2 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-body">
              <span
                className={`size-2 rounded-full ${
                  aiMode.id === "anthropic" ? "bg-emerald-500" : aiMode.id === "pollinations" ? "bg-sky-500" : "bg-amber-500"
                }`}
              />
              AI aktif · {aiMode.label}
            </p>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Teman AI dan analisis diproses di server (gratis). Visualisasi dibuat dari emosi dan simbol tiap mimpi.
            </p>
          </div>
        )}
        <div className="divide-y divide-(--border)">
          <Toggle
            checked={prefs.aiMemoryEnabled}
            onChange={(v) => onPrefsChange({ aiMemoryEnabled: v })}
            label="Izinkan AI memakai riwayat mimpiku"
            description="Teman AI dan analisis merujuk mimpi-mimpi lamamu sebagai konteks. Menonaktifkannya membuat jawaban AI umum, tapi jurnal tetap berfungsi penuh."
          />
        </div>
        <p className="mt-3 text-xs text-muted leading-relaxed">
          Mimpimu tidak pernah dibagikan ke pengguna lain kecuali kamu memublikasikannya secara eksplisit.
          Aktivitas komunitas selalu memakai nama samaranmu.
        </p>
      </section>
    </div>
  );
}
