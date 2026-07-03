"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { EMOTION_COLOR, emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { formatDateTime, safeParseJson } from "@/lib/utils";
import {
  BrainCircuit,
  HelpCircle,
  History,
  Lightbulb,
  RefreshCw,
  Repeat,
  Sparkles,
} from "lucide-react";

export interface AnalysisData {
  id: string;
  version: number;
  summary: string;
  reflection: string;
  dominantEmotion: string;
  emotionIntensity: number;
  themes: string;
  recommendations: string;
  suggestedQuestions: string;
  patternNote: string | null;
  emotionsJson: string;
  symbolsJson: string;
  confidence: number;
  provider: string;
  model: string;
  generatedAt: string;
}

function providerLabel(provider: string) {
  if (provider === "anthropic") return "Claude AI";
  if (provider === "pollinations") return "AI Gratis";
  if (provider.endsWith("fallback-local")) return "Mesin lokal (AI tak tersedia)";
  return "Mesin lokal";
}

export function AnalysisPanel({
  dreamId,
  analyses,
  isDraft,
}: {
  dreamId: string;
  analyses: AnalysisData[];
  isDraft: boolean;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const toast = useToast();
  const [selected, setSelected] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoTriggered = useRef(false);

  const shouldAuto = search.get("analyze") === "1" && analyses.length === 0 && !isDraft;

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      await api(`/api/dreams/${dreamId}/analysis`, { method: "POST" });
      toast("success", "Analisis siap.");
      setSelected(0);
      router.replace(`/dreams/${dreamId}`, { scroll: false });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Layanan AI sedang tidak tersedia. Mimpimu aman — coba lagi sebentar lagi."
      );
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    if (shouldAuto && !autoTriggered.current) {
      autoTriggered.current = true;
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAuto]);

  if (isDraft) {
    return (
      <div className="card p-6 text-center">
        <BrainCircuit className="size-7 text-night-400 mx-auto" />
        <p className="mt-2 text-sm text-muted">
          Mimpi ini masih draf. Selesaikan (Ubah → Simpan & Analisis) untuk membuka analisis AI.
        </p>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="card p-6 space-y-3" role="status" aria-label="Membuat analisis">
        <div className="flex items-center gap-2 text-sm font-medium text-night-600 dark:text-night-300">
          <Sparkles className="size-4 animate-pulse-soft" /> Membaca mimpimu…
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="card p-6 text-center">
        <BrainCircuit className="size-7 text-night-400 mx-auto" />
        <h3 className="mt-2 font-semibold text-body">Belum ada analisis</h3>
        <p className="mt-1 text-sm text-muted max-w-sm mx-auto">
          Buat pembacaan AI untuk mimpi ini — ringkasan, emosi, simbol, dan refleksi yang mendukung.
        </p>
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        <Button onClick={generate} className="mt-4">
          <Sparkles className="size-4" /> Buat Analisis AI
        </Button>
      </div>
    );
  }

  const a = analyses[Math.min(selected, analyses.length - 1)];
  const emotions = safeParseJson<Array<{ name: string; intensity: number; why: string }>>(a.emotionsJson, []);
  const symbols = safeParseJson<Array<{ name: string; confidence: number; why: string }>>(a.symbolsJson, []);
  const themes = safeParseJson<string[]>(a.themes, []);
  const recommendations = safeParseJson<string[]>(a.recommendations, []);
  const questions = safeParseJson<string[]>(a.suggestedQuestions, []);
  const domColor = EMOTION_COLOR[a.dominantEmotion] ?? "#7f6ac1";

  return (
    <div className="card p-6 space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-5 text-night-500" />
          <h2 className="font-semibold text-body">Analisis AI</h2>
          <Badge title={`Model: ${a.model} · Keyakinan ${(a.confidence * 100).toFixed(0)}%`}>
            {providerLabel(a.provider)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {analyses.length > 1 && (
            <label className="flex items-center gap-1.5 text-xs text-muted">
              <History className="size-3.5" />
              <select
                value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="input-base !w-auto !py-1 !px-2 text-xs"
                aria-label="Versi analisis"
              >
                {analyses.map((v, i) => (
                  <option key={v.id} value={i}>
                    v{v.version} · {formatDateTime(v.generatedAt)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Button variant="secondary" size="sm" onClick={generate}>
            <RefreshCw className="size-3.5" /> Buat ulang
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

      {/* summary + dominant emotion */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Ringkasan</h3>
        <p className="text-sm text-body leading-relaxed">{a.summary}</p>
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: `${domColor}14`, border: `1px solid ${domColor}33` }}>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-body">
              <EmotionDot color={domColor} className="size-3" /> Emosi dominan: {emotionLabel(a.dominantEmotion)}
            </span>
            <span className="text-muted text-xs">intensitas {a.emotionIntensity}/100</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${a.emotionIntensity}%`, backgroundColor: domColor }} />
          </div>
        </div>
      </div>

      {/* emotions with reasons */}
      {emotions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Emosi terdeteksi</h3>
          <ul className="space-y-2">
            {emotions.map((e) => (
              <li key={e.name} className="flex items-start gap-3 text-sm">
                <Badge color={EMOTION_COLOR[e.name] ?? "#7f6ac1"} className="mt-0.5 shrink-0">
                  <EmotionDot color={EMOTION_COLOR[e.name] ?? "#7f6ac1"} /> {emotionLabel(e.name)} · {e.intensity}
                </Badge>
                <span className="text-muted leading-relaxed">{e.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* symbols */}
      {symbols.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Simbol terdeteksi</h3>
          <ul className="space-y-2">
            {symbols.map((s) => (
              <li key={s.name} className="flex items-start gap-3 text-sm">
                <Badge className="mt-0.5 shrink-0" title={`Keyakinan ${s.confidence}%`}>
                  ✧ {symbolLabel(s.name)}
                </Badge>
                <span className="text-muted leading-relaxed">{s.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* themes */}
      {themes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Tema:</span>
          {themes.map((t) => (
            <Badge key={t} color="#7f6ac1">{t}</Badge>
          ))}
        </div>
      )}

      {/* pattern note */}
      {a.patternNote && (
        <div className="rounded-xl surface-2 p-4 flex gap-3">
          <Repeat className="size-4.5 text-night-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-body">Pola lintas riwayatmu</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">{a.patternNote}</p>
          </div>
        </div>
      )}

      {/* reflection */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Refleksi</h3>
        <p className="text-sm text-body leading-relaxed whitespace-pre-line">{a.reflection}</p>
      </div>

      {/* recommendations & questions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.length > 0 && (
          <div className="rounded-xl surface-2 p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-body mb-2">
              <Lightbulb className="size-4 text-dusk-500" /> Saran lembut
            </p>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        {questions.length > 0 && (
          <div className="rounded-xl surface-2 p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-body mb-2">
              <HelpCircle className="size-4 text-night-500" /> Untuk direnungkan
            </p>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted border-t border-base pt-3">
        Insight reflektif saja — bukan penilaian psikologis atau medis. Dibuat{" "}
        {formatDateTime(a.generatedAt)} · keyakinan {(a.confidence * 100).toFixed(0)}%.
      </p>
    </div>
  );
}
