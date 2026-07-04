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
} from "lucide-react";

const FEATURES = [
  { 
    icon: BookOpenText, 
    title: "Catat Mimpi", 
    text: "Tangkap mimpi begitu kamu bangun — judul, suasana hati, tidur, dan setiap detail yang memudar, tersimpan aman.",
    gradient: "from-purple-500 to-indigo-600",
    iconColor: "#8b5cf6",
    tags: ["JURNAL", "DETAIL"]
  },
  { 
    icon: BrainCircuit, 
    title: "Analisis Mimpi AI", 
    text: "Insight terstruktur untuk tiap entri: ringkasan, emosi dominan, simbol terdeteksi, dan refleksi mendalam.",
    gradient: "from-orange-500 to-red-600",
    iconColor: "#f97316",
    tags: ["INSIGHT", "EMOSI"]
  },
  { 
    icon: Palette, 
    title: "Visualisasi Mimpi", 
    text: "Tiap mimpi jadi karya seni unik yang dibentuk oleh emosi dan simbolnya. Buat ulang sampai terasa pas.",
    gradient: "from-sky-500 to-teal-600",
    iconColor: "#0ea5e9",
    tags: ["SENI", "SIMBOL"]
  },
  { 
    icon: LineChart, 
    title: "Tren Emosi", 
    text: "Amati cuaca batinmu selama berminggu-minggu — frekuensi emosi, keseimbangan positif, dan observasi lembut AI.",
    gradient: "from-pink-500 to-rose-600",
    iconColor: "#ec4899",
    tags: ["GRAFIK", "KONDISI"]
  },
  { 
    icon: CalendarDays, 
    title: "Kalender Mimpi", 
    text: "Jelajahi riwayat mimpimu secara kronologis, dengan penanda emosi di tiap malam kamu bermimpi.",
    gradient: "from-blue-500 to-indigo-700",
    iconColor: "#3b82f6",
    tags: ["KRONOLOGI", "RIWAYAT"]
  },
  { 
    icon: Sparkles, 
    title: "Pustaka Simbol", 
    text: "Air yang berulang? Terbang? Gigi copot? Pelajari makna simbol pribadimu — dan di mana ia muncul.",
    gradient: "from-emerald-500 to-teal-700",
    iconColor: "#10b981",
    tags: ["MAKNA", "POLA"]
  },
  { 
    icon: MessagesSquare, 
    title: "Teman Mimpi AI", 
    text: "Teman yang benar-benar mengenal riwayat mimpimu — tanya tentang pola, bandingkan mimpi, renungkan lebih dalam.",
    gradient: "from-amber-500 to-orange-600",
    iconColor: "#f59e0b",
    tags: ["TANYA", "BANDING"]
  },
  { 
    icon: HeartHandshake, 
    title: "Komunitas Anonim", 
    text: "Bagikan mimpi pilihan dengan nama samaran, beri reaksi, dan berdiskusi. Mimpi pribadi tetap pribadi, selalu.",
    gradient: "from-slate-500 to-slate-700",
    iconColor: "#64748b",
    tags: ["BERBAGI", "REAKSI"]
  },
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
            {recentDreams.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white border border-sea-fog rounded-2xl p-6">
                <HeartHandshake className="size-8 text-night-400 mx-auto" />
                <p className="mt-3 text-sm text-slate-channel">Belum ada mimpi terbaru yang dibagikan ke komunitas saat ini.</p>
              </div>
            ) : (
              recentDreams.map((dream) => {
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
                        {topEmotion && (
                          <p className="text-xs text-slate-channel font-semibold mb-3 flex items-center gap-1.5">
                            <span className="inline-block size-2 rounded-full" style={{ backgroundColor: topEmotion.color }} />
                            Emosi: {topEmotion.name}
                          </p>
                        )}
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
              })
            )}
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
            <div 
              key={f.title} 
              className="group relative flex flex-col bg-white rounded-[24px] border border-sea-fog overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Colored gradient background layer */}
              <div className={`absolute inset-0 bg-gradient-to-b ${f.gradient} -z-10`} />

              {/* White top header section */}
              <div className="bg-white pt-8 pb-4 px-6 flex flex-col items-center text-center">
                <div className="p-3 bg-slate-50 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="size-7" style={{ color: f.iconColor }} />
                </div>
                <h3 className="font-extrabold text-base text-slate-800 tracking-tight">
                  {f.title}
                </h3>
              </div>

              {/* Double-layered Wave Divider */}
              <div className="relative select-none pointer-events-none -mt-1 bg-white">
                {/* Secondary faint wave */}
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-8 text-white/20 fill-current absolute top-[2px] left-0">
                  <path d="M0,0 L1440,0 L1440,60 C1080,30 360,80 0,50 Z" />
                </svg>
                {/* Primary white wave */}
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-8 text-white fill-current relative">
                  <path d="M0,0 L1440,0 L1440,40 C1080,90 360,20 0,70 Z" />
                </svg>
              </div>

              {/* Bottom gradient section containing description and actions */}
              <div className="p-6 pt-2 flex-1 flex flex-col justify-between text-white">
                <p className="text-xs sm:text-sm leading-relaxed text-center text-white/90">
                  {f.text}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
                  <div className="flex justify-center items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-white/80">
                    {f.tags.map((tag, idx) => (
                      <span key={idx} className="border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
