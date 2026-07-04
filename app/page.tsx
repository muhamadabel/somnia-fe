"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { hasToken } from "@/lib/session";
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
  Search,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  { icon: BookOpenText, title: "Catat Mimpi", text: "Tangkap mimpi begitu kamu bangun — judul, suasana hati, tidur, dan setiap detail yang memudar, tersimpan aman." },
  { icon: BrainCircuit, title: "Analisis Mimpi AI", text: "Insight terstruktur untuk tiap entri: ringkasan, emosi dominan, simbol terdeteksi, dan refleksi mendalam." },
  { icon: Palette, title: "Visualisasi Mimpi", text: "Tiap mimpi jadi karya seni unik yang dibentuk oleh emosi dan simbolnya. Buat ulang sampai terasa pas." },
  { icon: LineChart, title: "Tren Emosi", text: "Amati cuaca batinmu selama berminggu-minggu — frekuensi emosi, keseimbangan positif, dan observasi lembut AI." },
  { icon: CalendarDays, title: "Kalender Mimpi", text: "Jelajahi riwayat mimpimu secara kronologis, dengan penanda emosi di tiap malam kamu bermimpi." },
  { icon: Sparkles, title: "Pustaka Simbol", text: "Air yang berulang? Terbang? Gigi copot? Pelajari makna simbol pribadimu — dan di mana ia muncul." },
  { icon: MessagesSquare, title: "Teman Mimpi AI", text: "Teman yang benar-benar mengenal riwayat mimpimu — tanya tentang pola, bandingkan mimpi, renungkan lebih dalam." },
  { icon: HeartHandshake, title: "Komunitas Anonim", text: "Bagikan mimpi pilihan dengan nama samaran, beri reaksi, dan berdiskusi. Mimpi pribadi tetap pribadi, selalu." },
];

const FILTER_CHIPS = [
  { label: "Mimpi Terbang", count: "128x terdeteksi" },
  { label: "Tenggelam / Air", count: "84x terdeteksi" },
  { label: "Gigi Copot", count: "42x terdeteksi" },
  { label: "Terlambat Ujian", count: "31x terdeteksi" },
];

interface FeedPost {
  id: string;
  title: string;
  content: string;
  meta: string;
  createdAt: string;
  user: { anonName: string };
}

import { API_BASE, ApiEnvelope } from "@/lib/client";
import { timeAgo, safeParseJson } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [recentDreams, setRecentDreams] = useState<FeedPost[]>([]);

  useEffect(() => {
    if (hasToken()) {
      router.replace("/dashboard");
      return;
    }
    
    // Fetch dynamic community posts manually to avoid the 401 auto-redirect in lib/client 
    // until the backend is fully deployed with the public endpoint changes.
    fetch(`${API_BASE}/api/community/posts?limit=3`)
      .then(res => {
        if (!res.ok) throw new Error("Not authorized or failed");
        return res.json();
      })
      .then((body: ApiEnvelope<FeedPost[]>) => {
        if (body.success && body.data) setRecentDreams(body.data);
      })
      .catch(() => {
        // Silently fail if endpoint is still restricted on the remote server
        console.log("Community feed requires login on current backend version");
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-canvas-white font-sans text-midnight-harbor antialiased selection:bg-signal-blue selection:text-white">
      {/* ── Sticky Navigation Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sea-fog">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tighter text-signal-blue lowercase">somnia</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-channel hover:text-midnight-harbor transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-signal-blue hover:bg-signal-blue/90 text-white rounded-3xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all"
            >
              Mulai
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section 
        className="relative overflow-hidden pt-24 pb-32 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/sleep-bg-hd.png')",
          backgroundPosition: "center right",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Controls */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center relative z-10">
            {/* Stamped Hero Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-midnight-harbor">
              Apa yang bisa kupelajari <br />
              <span className="text-signal-blue">dari semua mimpiku?</span>
            </h1>

            <p className="mt-6 text-slate-channel text-base sm:text-lg leading-relaxed max-w-xl">
              Somnia mengubah catatan mimpi acak menjadi data diri terstruktur — mengungkap pola emosi bawah sadar, mendeteksi simbol berulang, dan memvisualisasikan memori malammu.
            </p>

            {/* Search Input */}
            <div className="mt-8 w-full max-w-lg relative">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-channel">
                  <Search className="size-5" />
                </span>
                <input
                  type="text"
                  placeholder="Cari arti simbol atau mulai menulis mimpi..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white border border-sea-fog rounded-3xl pl-12 pr-16 py-4 text-sm text-midnight-harbor shadow-sm hover:border-slate-channel/50 focus:outline-none focus:border-signal-blue focus:ring-4 focus:ring-signal-blue/15 transition-all placeholder:text-slate-channel/70"
                />
                <span className="absolute right-4 bg-ice-tint text-slate-channel font-semibold text-xs px-2.5 py-1 rounded-[5px] border border-sea-fog/30 pointer-events-none">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setSearchValue(chip.label)}
                  className="inline-flex items-center gap-1.5 bg-white border border-sea-fog hover:border-slate-channel/60 rounded-lg px-3 py-1.5 text-xs font-semibold text-midnight-harbor hover:bg-ice-tint/30 transition-all cursor-pointer"
                >
                  <Sparkles className="size-3 text-slate-channel" />
                  {chip.label}
                  <span className="text-[10px] text-slate-channel/70 font-normal">({chip.count})</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white font-semibold rounded-3xl px-7 py-3.5 shadow-sm hover:shadow-md transition-all"
              >
                Mulai Jurnal <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Empty, illustration is in the background image */}
          <div className="lg:col-span-5 h-[350px] lg:h-[450px] pointer-events-none" />
        </div>
      </section>

      {/* ── Product Preview (Grid of Cards) ── */}
      <section className="bg-ice-tint/30 border-y border-sea-fog py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-midnight-harbor tracking-tight">
              Mimpi Terbaru di Komunitas
            </h2>
            <p className="text-sm text-slate-channel mt-2">
              Diterbitkan secara anonim, dianalisis secara instan oleh kecerdasan buatan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {recentDreams.map((dream) => {
              const parsedMeta = safeParseJson<{ emotions?: { name: string; color: string }[] }>(dream.meta, {});
              const topEmotion = parsedMeta?.emotions?.[0];
              // fallback colors if not available
              const emotionLabelStr = topEmotion ? topEmotion.name : "Tidak terdeteksi";
              
              return (
                <div 
                  key={dream.id} 
                  onClick={() => router.push(hasToken() ? `/community/${dream.id}` : "/login")}
                  className="card overflow-hidden bg-white border border-sea-fog rounded-2xl flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
                >
                  {/* Full-bleed gradient dream imagery placeholder */}
                  <div className="h-40 bg-gradient-to-tr from-ice-tint via-sea-fog to-light-mist relative flex items-end p-4 rounded-t-2xl transition-all group-hover:opacity-90">
                    <span className="absolute top-3 right-3 bg-white/95 text-signal-blue text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase shadow-sm">
                      {dream.user.anonName}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-midnight-harbor line-clamp-1 mb-2 group-hover:text-signal-blue transition-colors">
                        {dream.title}
                      </h3>
                      <p className="text-xs text-slate-channel font-semibold mb-3 flex items-center gap-1.5">
                        <span className="inline-block size-2 rounded-full" style={{ backgroundColor: topEmotion?.color || "#cbd5e1" }} />
                        Emosi: {emotionLabelStr}
                      </p>
                      <p className="text-sm text-slate-channel line-clamp-3 leading-relaxed mb-4">
                        {dream.content}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sea-fog/50 mt-auto text-xs text-slate-channel">
                      <span>{timeAgo(dream.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold text-midnight-harbor tracking-tight mb-12">
          Dari ingatan yang memudar jadi insight yang bertahan
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { n: "01", t: "Catat Seketika", d: "Tulis mimpi begitu terbangun sebelum ia menguap — lengkap dengan suasana hati, kualitas tidur, dan parameter mimpi." },
            { n: "02", t: "Analisis Mendalam AI", d: "AI mendeteksi nuansa emosi, simbol psikoanalisis, dan mengekstrak tema utama untuk dihubungkan dalam peta mimpi." },
            { n: "03", t: "Kenali Pola Jiwamu", d: "Mimpi yang menumpuk membentuk garis tren emosi, membantu mengenali stres bawah sadar dan perkembangan batinmu." },
          ].map((s) => (
            <div key={s.n} className="card p-6 bg-white border border-sea-fog rounded-2xl">
              <span className="text-signal-blue font-extrabold text-sm">{s.n}</span>
              <h3 className="mt-3 font-bold text-lg text-midnight-harbor">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-channel leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features List ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 bg-white border border-sea-fog rounded-2xl hover:shadow-md transition-all">
              <f.icon className="size-6 text-signal-blue" />
              <h3 className="mt-4 font-bold text-base text-midnight-harbor">{f.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-channel leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy Panel ── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="card p-8 text-center bg-white border border-sea-fog rounded-2xl">
          <ShieldCheck className="size-10 text-active-teal mx-auto" />
          <h2 className="mt-4 text-2xl font-extrabold text-midnight-harbor tracking-tight">Privasi Penuh Sejak Awal</h2>
          <p className="mt-3 text-sm text-slate-channel max-w-xl mx-auto leading-relaxed">
            Mimpi adalah bagian terdalam dari privasi manusia. Catatanmu terenkripsi secara aman, aktivitas di komunitas sepenuhnya anonim menggunakan nama samaran acak, dan kamu memegang kendali penuh atas penggunaan kecerdasan buatan.
          </p>
        </div>
      </section>

      {/* ── Dark CTA Banner (Full Bleed contrast section) ── */}
      <section 
        className="text-white py-24 relative overflow-hidden bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/book-image.png')",
        }}
      >
        <div className="absolute inset-0 bg-midnight-harbor/85 backdrop-blur-[1px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6 z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Masuki Kedalaman Alam Bawah Sadarmu
          </h2>
          <p className="text-base sm:text-lg text-sea-fog max-w-xl mx-auto font-normal leading-relaxed">
            Daftarkan akun hari ini, catat jurnal mimpimu secara rutin, dan mulailah memahami pesan-pesan tersembunyi setiap malam.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white font-bold rounded-3xl px-8 py-4 shadow-lg hover:shadow-xl transition-all"
            >
              Mulai Jurnal
            </Link>
          </div>
          {/* Avatar Stack Social Proof */}
          <div className="pt-6 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full border-2 border-midnight-harbor bg-slate-400 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" className="object-cover size-full" />
              </div>
              <div className="size-8 rounded-full border-2 border-midnight-harbor bg-slate-400 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" className="object-cover size-full" />
              </div>
              <div className="size-8 rounded-full border-2 border-midnight-harbor bg-slate-400 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="avatar" className="object-cover size-full" />
              </div>
            </div>
            <p className="text-xs text-sea-fog/80">
              <span className="font-bold text-white">+463 pemimpi</span> bergabung minggu lalu
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-sea-fog bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center space-y-4">
          <p className="text-xs text-slate-channel max-w-2xl mx-auto leading-relaxed">
            {APP_NAME} adalah alat refleksi diri dan eksplorasi batin. Insight AI bersifat reflektif dan edukatif — bukan diagnosis klinis psikologis dan tidak pernah dimaksudkan untuk menggantikan penanganan profesional medis atau kesehatan mental.
          </p>
          <div className="text-xs font-semibold text-slate-channel/80">
            {`© ${new Date().getFullYear()} ${APP_NAME} — Penganalisis Jurnal Mimpi`}
          </div>
        </div>
      </footer>
    </main>
  );
}
