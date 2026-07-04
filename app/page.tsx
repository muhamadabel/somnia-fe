"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { hasToken } from "@/lib/session";
import { Stars } from "@/components/layout/stars";
import {
  BookOpenText,
  BrainCircuit,
  CalendarDays,
  HeartHandshake,
  LineChart,
  MoonStar,
  Palette,
  ShieldCheck,
  Sparkles,
  MessagesSquare,
} from "lucide-react";

const FEATURES = [
  { icon: BookOpenText, title: "Catat Mimpi", text: "Tangkap mimpi begitu kamu bangun — judul, suasana hati, tidur, dan setiap detail yang memudar, tersimpan aman." },
  { icon: BrainCircuit, title: "Analisis Mimpi AI", text: "Insight terstruktur untuk tiap entri: ringkasan, emosi dominan, simbol terdeteksi, dan refleksi yang menjelaskan alasannya sendiri." },
  { icon: Palette, title: "Visualisasi Mimpi", text: "Tiap mimpi jadi karya seni unik yang dibentuk oleh emosi dan simbolnya. Buat ulang sampai terasa pas." },
  { icon: LineChart, title: "Tren Emosi", text: "Amati cuaca batinmu selama berminggu-minggu — frekuensi emosi, keseimbangan positif, dan observasi lembut AI." },
  { icon: CalendarDays, title: "Kalender Mimpi", text: "Jelajahi riwayat mimpimu secara kronologis, dengan penanda emosi di tiap malam kamu bermimpi." },
  { icon: Sparkles, title: "Pustaka Simbol", text: "Air yang berulang? Terbang? Gigi copot? Pelajari makna simbol pribadimu — dan di mana ia muncul." },
  { icon: MessagesSquare, title: "Teman Mimpi AI", text: "Teman yang benar-benar mengenal riwayat mimpimu — tanya tentang pola, bandingkan mimpi, renungkan lebih dalam." },
  { icon: HeartHandshake, title: "Komunitas Anonim", text: "Bagikan mimpi pilihan dengan nama samaran, beri reaksi, dan berdiskusi. Mimpi pribadi tetap pribadi, selalu." },
];

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    if (hasToken()) router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen bg-base">
      {/* ── Hero ── */}
      <section className="night-sky relative text-white">
        <Stars />
        <nav className="relative max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <MoonStar className="size-6 text-night-300" />
            {APP_NAME}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-night-200 hover:text-white transition-colors px-3 py-2">
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-colors"
            >
              Mulai
            </Link>
          </div>
        </nav>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-28 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-night-300 border border-white/15 rounded-full px-3 py-1.5 mb-6 animate-fade-up">
            <Sparkles className="size-3.5" /> Jurnal mimpi bertenaga AI
          </p>
          <h1
            className="text-4xl sm:text-6xl font-semibold leading-tight animate-fade-up"
            style={{ fontFamily: "var(--font-display)", animationDelay: "0.05s" }}
          >
            Apa yang bisa kupelajari
            <br />
            <span className="bg-gradient-to-r from-night-300 via-dusk-300 to-night-200 bg-clip-text text-transparent">
              dari semua mimpiku?
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-night-200 text-lg leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {APP_NAME} mengubah jurnal mimpimu jadi pengetahuan diri yang terstruktur — pola emosi,
            simbol berulang, seni mimpi, dan refleksi yang makin cerdas di tiap entri.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-night-500 hover:bg-night-400 text-white font-medium rounded-xl px-7 py-3.5 shadow-dreamy-lg transition-colors"
            >
              <MoonStar className="size-5" /> Mulai Jurnal Mimpimu
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-night-200 hover:text-white font-medium rounded-xl px-6 py-3.5 border border-white/15 hover:border-white/30 transition-colors"
            >
              Coba akun demo
            </Link>
          </div>
          <p className="mt-4 text-xs text-night-300/80">
            Login demo: <code className="bg-white/10 rounded px-1.5 py-0.5">demo@somnia.app</code> ·{" "}
            <code className="bg-white/10 rounded px-1.5 py-0.5">dream1234</code>
          </p>
        </div>

        {/* soft wave divider */}
        <svg viewBox="0 0 1440 90" className="block w-full" aria-hidden preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,80 1440,40 L1440,90 L0,90 Z" fill="var(--bg)" />
        </svg>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-body" style={{ fontFamily: "var(--font-display)" }}>
          Dari ingatan yang memudar jadi insight yang bertahan
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { n: "01", t: "Catat", d: "Tulis mimpi sebelum ia lenyap — lengkap dengan suasana hati, tidur, dan gambar." },
            { n: "02", t: "Analisis", d: "AI mendeteksi emosi, simbol, dan tema, lalu merefleksikannya kembali dengan alasan." },
            { n: "03", t: "Renungkan", d: "Tren, laporan, dan teman yang mengingat — insight menumpuk seiring waktu." },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <span className="text-night-400 font-semibold text-sm">{s.n}</span>
              <h3 className="mt-2 font-semibold text-lg text-body">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 hover:shadow-dreamy-lg transition-shadow">
              <f.icon className="size-6 text-night-500" />
              <h3 className="mt-3 font-semibold text-body">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="card p-8 text-center">
          <ShieldCheck className="size-8 text-night-500 mx-auto" />
          <h2 className="mt-3 text-xl font-semibold text-body">Privat sejak awal</h2>
          <p className="mt-2 text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Mimpi termasuk hal paling pribadi yang bisa kamu tuliskan. Jurnalmu milikmu seorang —
            tidak ada yang dibagikan kecuali kamu memublikasikannya sendiri, aktivitas komunitas memakai
            nama samaran, dan kamu yang menentukan apakah AI boleh memakai riwayatmu sebagai konteks.
          </p>
        </div>
      </section>

      {/* ── Footer / disclaimer ── */}
      <footer className="border-t border-base">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center space-y-2">
          <p className="text-xs text-muted max-w-2xl mx-auto">
            {APP_NAME} adalah alat refleksi diri, bukan perangkat medis. Insight AI bersifat reflektif dan
            edukatif — bukan diagnosis psikologis dan tak pernah menggantikan bantuan profesional kesehatan
            mental.
          </p>
          <p className="text-xs text-muted">{`© ${new Date().getFullYear()} ${APP_NAME} — Penganalisis Jurnal Mimpi`}</p>
        </div>
      </footer>
    </main>
  );
}
