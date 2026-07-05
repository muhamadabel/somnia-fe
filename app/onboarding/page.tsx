"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client";
import { BookOpenText, Brain, LineChart, MoonStar, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: ShieldCheck,
    title: "Mimpimu tetap pribadi",
    text: "Semua yang kamu tulis milikmu seorang. Tidak ada yang dibagikan kecuali kamu memublikasikannya sendiri ke komunitas — pun begitu, hanya dengan nama samaran.",
  },
  {
    icon: Brain,
    title: "AI merefleksikan — bukan mendiagnosis",
    text: "AI membantumu menyadari emosi, simbol, dan pola, serta menjelaskan alasannya. Ia menawarkan refleksi, bukan kesimpulan medis, dan tak pernah menggantikan bantuan profesional.",
  },
  {
    icon: LineChart,
    title: "Insight tumbuh bersama riwayat",
    text: "Tren, simbol berulang, dan laporan kesejahteraan makin bermakna seiring jurnalmu bertambah. Satu mimpi adalah cerita; tiga puluh mimpi adalah peta.",
  },
  {
    icon: BookOpenText,
    title: "Konsistensi mengalahkan kesempurnaan",
    text: "Dua kalimat saat baru bangun pun cukup. Fragmen berarti. Kebiasaanlah yang membuka pemahaman.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const current = STEPS[step];
  const Icon = current.icon;

  async function finish() {
    setLoading(true);
    try {
      await api("/api/user/onboard", { method: "POST" });
    } catch {
      // non-blocking — proceed anyway
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen night-sky flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-8 text-center animate-fade-up" key={step}>
        <div className="mx-auto mb-5 rounded-full surface-2 p-5 w-fit text-night-500">
          <Icon className="size-9" />
        </div>
        <h1 className="text-xl font-semibold text-body">{current.title}</h1>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-md mx-auto">{current.text}</p>

        <div className="mt-7 flex items-center justify-center gap-1.5" aria-label={`Langkah ${step + 1} dari ${STEPS.length}`}>
          {STEPS.map((_, i) => (
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
          {step < STEPS.length - 1 ? (
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
