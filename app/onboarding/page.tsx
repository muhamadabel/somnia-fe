"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/layout/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client";
import { AVATAR_PRESETS, DEFAULT_AVATAR_PATH } from "@/lib/avatar-presets";
import { BookOpenText, Brain, LineChart, MoonStar, ShieldCheck, Sparkles } from "lucide-react";

const INFO_STEPS = [
  {
    icon: ShieldCheck,
    title: "Mimpimu tetap pribadi",
    text: "Semua yang kamu tulis milikmu seorang. Tidak ada yang dibagikan kecuali kamu memublikasikannya sendiri ke komunitas, dan itu pun lewat nama samaran.",
  },
  {
    icon: Brain,
    title: "AI merefleksikan, bukan mendiagnosis",
    text: "AI membantumu melihat emosi, simbol, dan pola berikut alasannya. Ia memberi refleksi, bukan kesimpulan medis, dan tidak menggantikan bantuan profesional.",
  },
  {
    icon: LineChart,
    title: "Insight tumbuh bersama riwayat",
    text: "Tren, simbol berulang, dan laporan kesejahteraan makin bermakna saat jurnalmu bertambah. Satu mimpi adalah cerita, tiga puluh mimpi adalah peta.",
  },
  {
    icon: BookOpenText,
    title: "Konsistensi mengalahkan kesempurnaan",
    text: "Dua kalimat saat baru bangun pun cukup. Fragmen tetap berarti. Kebiasaanlah yang membuka pemahaman.",
  },
];

const TOTAL_STEPS = INFO_STEPS.length + 1;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [avatarPath, setAvatarPath] = useState(DEFAULT_AVATAR_PATH);
  const isAvatarStep = step === INFO_STEPS.length;
  const current = INFO_STEPS[Math.min(step, INFO_STEPS.length - 1)];
  const Icon = isAvatarStep ? Sparkles : current.icon;

  async function finish() {
    setLoading(true);
    try {
      await api("/api/user/onboard", { method: "POST", json: { avatarPath } });
    } catch {
      // non-blocking — proceed anyway
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen night-sky flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl p-8 text-center animate-fade-up" key={step}>
        <div className="mx-auto mb-5 rounded-full surface-2 p-5 w-fit text-night-500">
          <Icon className="size-9" />
        </div>

        {!isAvatarStep ? (
          <>
            <h1 className="text-xl font-semibold text-body">{current.title}</h1>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-md mx-auto">{current.text}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-body">Pilih avatar awalmu</h1>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-2xl mx-auto">
              Kamu bisa ganti lagi nanti di pengaturan. Untuk sekarang, pilih wajah profil dari koleksi internal yang
              sudah kita siapkan.
            </p>
            <div className="mt-6 rounded-[28px] border border-base/80 bg-white/55 p-5 dark:bg-night-950/25">
              <div className="flex flex-col items-center gap-3">
                <UserAvatar name="Avatar terpilih" avatarPath={avatarPath} className="size-24 border border-base shadow-sm" />
                <div>
                  <p className="text-sm font-medium text-body">
                    {AVATAR_PRESETS.find((item) => item.path === avatarPath)?.label ?? "Avatar"}
                  </p>
                  <p className="text-xs text-muted">Preset bisa diganti kapan saja di pengaturan profil.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {AVATAR_PRESETS.map((avatar) => {
                  const active = avatar.path === avatarPath;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setAvatarPath(avatar.path)}
                      className={`rounded-3xl border p-4 text-left transition ${
                        active
                          ? "border-night-500 bg-night-500/10 shadow-sm"
                          : "border-base bg-white/75 hover:border-night-300 hover:bg-white dark:bg-night-950/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={avatar.path} alt={avatar.label} className="size-14 rounded-full border border-base object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-body">{avatar.label}</p>
                          <p className="text-xs text-muted">{avatar.id}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="mt-7 flex items-center justify-center gap-1.5" aria-label={`Langkah ${step + 1} dari ${TOTAL_STEPS}`}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-night-500" : "w-1.5 surface-2"}`}
            />
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Kembali
            </Button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Lanjut</Button>
          ) : (
            <Button onClick={finish} loading={loading}>
              <MoonStar className="size-4" /> Buka jurnalku
            </Button>
          )}
        </div>
        <button onClick={finish} className="mt-4 text-xs text-muted hover:text-body cursor-pointer">
          Lewati perkenalan
        </button>
      </div>
    </main>
  );
}
