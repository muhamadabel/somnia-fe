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
    label: "PENCATATAN",
    title: "Catat Mimpi",
    text: "Tangkap mimpi begitu kamu bangun — judul, suasana hati, tidur, dan setiap detail yang memudar, tersimpan aman.",
    bgClass: "bg-[#eef5fc] dark:bg-[#0d1f38]",
    labelBgClass: "bg-white dark:bg-[#1e2f47]",
    labelTextColor: "text-[#0b3658] dark:text-[#a5c2f4]",
    titleColor: "text-[#0b3658] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#0b3658] dark:text-[#4e9ad9]",
    gradStart: "#0b3658",
    gradEnd: "#4e9ad9",
    shapeId: "catat"
  },
  {
    icon: BrainCircuit,
    label: "ANALISIS AI",
    title: "Analisis Mimpi AI",
    text: "Insight terstruktur untuk tiap entri: ringkasan, emosi dominan, simbol terdeteksi, dan refleksi mendalam.",
    bgClass: "bg-[#f3effc] dark:bg-[#1a143b]",
    labelBgClass: "bg-white dark:bg-[#282154]",
    labelTextColor: "text-[#4a2ba3] dark:text-[#bca8ff]",
    titleColor: "text-[#4a2ba3] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#4a2ba3] dark:text-[#7f00ff]",
    gradStart: "#3b3086",
    gradEnd: "#7f00ff",
    shapeId: "analisis"
  },
  {
    icon: Palette,
    label: "KREATIVITAS",
    title: "Visualisasi Mimpi",
    text: "Tiap mimpi jadi karya seni unik yang dibentuk oleh emosi dan simbolnya. Buat ulang sampai terasa pas.",
    bgClass: "bg-[#fcf4ec] dark:bg-[#2a1b10]",
    labelBgClass: "bg-white dark:bg-[#3d2719]",
    labelTextColor: "text-[#d35400] dark:text-[#ffb380]",
    titleColor: "text-[#d35400] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#d35400] dark:text-[#f39c12]",
    gradStart: "#e65c00",
    gradEnd: "#f9d423",
    shapeId: "visual"
  },
  {
    icon: LineChart,
    label: "STATISTIK",
    title: "Tren Emosi",
    text: "Amati cuaca batinmu selama berminggu-minggu — frekuensi emosi, keseimbangan positif, dan observasi lembut AI.",
    bgClass: "bg-[#ecfcfb] dark:bg-[#0e2729]",
    labelBgClass: "bg-white dark:bg-[#1a3d3f]",
    labelTextColor: "text-[#008080] dark:text-[#80e5e5]",
    titleColor: "text-[#008080] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#008080] dark:text-[#42b3b1]",
    gradStart: "#0083b0",
    gradEnd: "#42b3b1",
    shapeId: "tren"
  },
  {
    icon: CalendarDays,
    label: "KRONOLOGI",
    title: "Kalender Mimpi",
    text: "Jelajahi riwayat mimpimu secara kronologis, dengan penanda emosi di tiap malam kamu bermimpi.",
    bgClass: "bg-[#f0f2ff] dark:bg-[#121636]",
    labelBgClass: "bg-white dark:bg-[#202554]",
    labelTextColor: "text-[#3f51b5] dark:text-[#a2b2ff]",
    titleColor: "text-[#3f51b5] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#3f51b5] dark:text-[#8f94fb]",
    gradStart: "#4e54c8",
    gradEnd: "#8f94fb",
    shapeId: "kalender"
  },
  {
    icon: Sparkles,
    label: "EKSPLORASI",
    title: "Pustaka Simbol",
    text: "Air yang berulang? Terbang? Gigi copot? Pelajari makna simbol pribadimu — dan di mana ia muncul.",
    bgClass: "bg-[#fcf9eb] dark:bg-[#2b2713]",
    labelBgClass: "bg-white dark:bg-[#3d371d]",
    labelTextColor: "text-[#b78a00] dark:text-[#ffd966]",
    titleColor: "text-[#b78a00] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#b78a00] dark:text-[#f1c40f]",
    gradStart: "#d38312",
    gradEnd: "#a83279",
    shapeId: "simbol"
  },
  {
    icon: MessagesSquare,
    label: "ASISTEN",
    title: "Teman Mimpi AI",
    text: "Teman yang benar-benar mengenal riwayat mimpimu — tanya tentang pola, bandingkan mimpi, renungkan lebih dalam.",
    bgClass: "bg-[#edfbf3] dark:bg-[#0c2417]",
    labelBgClass: "bg-white dark:bg-[#193d28]",
    labelTextColor: "text-[#1b5e20] dark:text-[#8ee4af]",
    titleColor: "text-[#1b5e20] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#1b5e20] dark:text-[#38ef7d]",
    gradStart: "#11998e",
    gradEnd: "#38ef7d",
    shapeId: "teman"
  },
  {
    icon: HeartHandshake,
    label: "KOMUNITAS",
    title: "Komunitas Anonim",
    text: "Bagikan mimpi pilihan dengan nama samaran, beri reaksi, dan berdiskusi. Mimpi pribadi tetap pribadi, selalu.",
    bgClass: "bg-[#fdf0f7] dark:bg-[#2e1222]",
    labelBgClass: "bg-white dark:bg-[#471f37]",
    labelTextColor: "text-[#c2185b] dark:text-[#ffa6cd]",
    titleColor: "text-[#c2185b] dark:text-white",
    textColor: "text-[#486984] dark:text-[#c8d8e4]",
    linkColor: "text-[#c2185b] dark:text-[#ec407a]",
    gradStart: "#ec008c",
    gradEnd: "#fc6767",
    shapeId: "komunitas"
  }
];

function renderFeatureShape(shapeId: string, gradId: string, gradStart: string, gradEnd: string) {
  switch (shapeId) {
    case "catat":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <path d="M70,50 C110,50 140,80 140,120 C140,150 120,175 90,185 C125,175 150,140 150,105 C150,65 115,35 75,35 C73,35 71,35 70,35.1 Z" fill={`url(#${gradId})`} />
          <rect x="55" y="85" width="75" height="65" rx="10" fill={`url(#${gradId})`} opacity="0.85" transform="rotate(-10 90 115)" />
          <line x1="70" y1="105" x2="115" y2="105" stroke="white" strokeWidth="3" strokeLinecap="round" transform="rotate(-10 90 115)" />
          <line x1="70" y1="120" x2="100" y2="120" stroke="white" strokeWidth="3" strokeLinecap="round" transform="rotate(-10 90 115)" />
        </svg>
      );
    case "analisis":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <rect x="85" y="45" width="30" height="60" rx="8" fill={`url(#${gradId})`} opacity="0.4" />
          <circle cx="100" cy="120" r="50" fill={`url(#${gradId})`} />
          <circle cx="100" cy="120" r="28" fill="white" opacity="0.2" />
        </svg>
      );
    case "visual":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <circle cx="85" cy="100" r="45" fill={`url(#${gradId})`} opacity="0.35" />
          <path d="M120,55 A45,45 0 0,1 120,145 Z" fill={`url(#${gradId})`} />
        </svg>
      );
    case "tren":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <rect x="65" y="100" width="16" height="50" rx="8" fill={`url(#${gradId})`} opacity="0.3" />
          <rect x="92" y="70" width="16" height="80" rx="8" fill={`url(#${gradId})`} />
          <rect x="119" y="85" width="16" height="65" rx="8" fill={`url(#${gradId})`} opacity="0.75" />
        </svg>
      );
    case "kalender":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <rect x="60" y="60" width="80" height="80" rx="16" fill={`url(#${gradId})`} opacity="0.2" />
          <circle cx="80" cy="80" r="9" fill={`url(#${gradId})`} />
          <circle cx="100" cy="80" r="9" fill={`url(#${gradId})`} opacity="0.6" />
          <circle cx="120" cy="80" r="9" fill={`url(#${gradId})`} />
          <circle cx="80" cy="100" r="9" fill={`url(#${gradId})`} opacity="0.4" />
          <circle cx="100" cy="100" r="9" fill={`url(#${gradId})`} />
          <circle cx="120" cy="100" r="9" fill={`url(#${gradId})`} opacity="0.7" />
          <circle cx="80" cy="120" r="9" fill={`url(#${gradId})`} />
          <circle cx="100" cy="120" r="9" fill={`url(#${gradId})`} opacity="0.5" />
          <circle cx="120" cy="120" r="9" fill={`url(#${gradId})`} />
        </svg>
      );
    case "simbol":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <path d="M100,40 Q100,100 40,100 Q100,100 100,160 Q100,100 160,100 Q100,100 100,40 Z" fill={`url(#${gradId})`} />
        </svg>
      );
    case "teman":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <path d="M100,35 L65,80 H78 L55,120 H83 L45,165 H90 V175 H110 V165 H155 L117,120 H145 L122,80 H135 Z" fill={`url(#${gradId})`} />
        </svg>
      );
    case "komunitas":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] max-h-[130px] select-none pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="white" className="dark:fill-slate-950" opacity="0.45" />
          <circle cx="85" cy="100" r="32" stroke={`url(#${gradId})`} strokeWidth="10" fill="none" opacity="0.5" />
          <circle cx="115" cy="100" r="32" stroke={`url(#${gradId})`} strokeWidth="10" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

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
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map((f, idx) => {
            const gradientId = `shape-grad-${idx}`;
            return (
              <div 
                key={f.title} 
                className={`relative overflow-hidden ${f.bgClass} rounded-3xl p-6 sm:p-8 flex flex-row items-center justify-between border border-black/[0.03] dark:border-white/[0.03] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group min-h-[180px] sm:min-h-[220px]`}
              >
                {/* Left Side: Content */}
                <div className="flex-1 flex flex-col items-start text-left pr-4 sm:pr-8 z-10">
                  {/* Label Pill */}
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${f.labelBgClass} ${f.labelTextColor} shadow-sm mb-3.5`}>
                    {f.label}
                  </span>
                  
                  {/* Title */}
                  <h3 className={`font-extrabold text-xl sm:text-2xl ${f.titleColor} tracking-tight mb-2`}>
                    {f.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-xs sm:text-sm ${f.textColor} leading-relaxed max-w-sm mb-4`}>
                    {f.text}
                  </p>
                  
                  {/* Link */}
                  <Link 
                    href="/register" 
                    className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold ${f.linkColor} hover:underline transition-colors mt-auto`}
                  >
                    Pelajari selengkapnya
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className="size-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>

                {/* Right Side: Shape Graphic */}
                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] flex items-center justify-center shrink-0 relative z-0">
                  {renderFeatureShape(f.shapeId, gradientId, f.gradStart, f.gradEnd)}
                </div>
              </div>
            );
          })}
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
