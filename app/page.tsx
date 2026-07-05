"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { hasToken } from "@/lib/session";
import {
  BookOpenText,
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
    image: "/features/catat.png",
    title: "Catat Mimpi",
    text: "Tangkap mimpi begitu kamu bangun — judul, suasana hati, tidur, dan setiap detail yang memudar, tersimpan aman.",
  },
  {
    image: "/features/analisis.png",
    title: "Analisis Mimpi AI",
    text: "Insight terstruktur untuk tiap entri: ringkasan, emosi dominan, simbol terdeteksi, dan refleksi mendalam.",
  },
  {
    image: "/features/visual.png",
    title: "Visualisasi Mimpi",
    text: "Tiap mimpi jadi karya seni unik yang dibentuk oleh emosi dan simbolnya. Buat ulang sampai terasa pas.",
  },
  {
    image: "/features/tren.png",
    title: "Tren Emosi",
    text: "Amati cuaca batinmu selama berminggu-minggu — frekuensi emosi, keseimbangan positif, dan observasi lembut AI.",
  },
  {
    image: "/features/kalender.png",
    title: "Kalender Mimpi",
    text: "Jelajahi riwayat mimpimu secara kronologis, dengan penanda emosi di tiap malam kamu bermimpi.",
  },
  {
    image: "/features/simbol.png",
    title: "Pustaka Simbol",
    text: "Air yang berulang? Terbang? Gigi copot? Pelajari makna simbol pribadimu — dan di mana ia muncul.",
  },
  {
    image: "/features/teman.png",
    title: "Teman Mimpi AI",
    text: "Teman yang benar-benar mengenal riwayat mimpimu — tanya tentang pola, bandingkan mimpi, renungkan lebih dalam.",
  },
  {
    image: "/features/komunitas.png",
    title: "Komunitas Anonim",
    text: "Bagikan mimpi pilihan dengan nama samaran, beri reaksi, dan berdiskusi. Mimpi pribadi tetap pribadi, selalu.",
  }
];


interface FeedPost {
  id: string;
  title: string;
  content: string;
  meta: string;
  createdAt: string;
  user: { anonName: string };
}

import { API_BASE, ApiEnvelope, fileUrl } from "@/lib/client";
import { timeAgo, safeParseJson } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const [recentDreams, setRecentDreams] = useState<FeedPost[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [worksActiveIndex, setWorksActiveIndex] = useState(0);
  const [dreamsActiveIndex, setDreamsActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWorksActiveIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recentDreams.length === 0) return;
    const timer = setInterval(() => {
      setDreamsActiveIndex((prev) => (prev + 1) % recentDreams.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [recentDreams]);

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
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tighter text-signal-blue lowercase">somnia</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-channel hover:text-midnight-harbor transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-signal-blue hover:bg-signal-blue/90 text-white rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-all"
            >
              Mulai
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section 
        className="relative overflow-hidden pt-24 pb-32 bg-no-repeat bg-cover bg-right-bottom sm:bg-[position:center_right] before:absolute before:inset-0 before:bg-white/80 before:z-0 sm:before:hidden"
        style={{
          backgroundImage: "url('/sleep-bg-hd.png')",
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
          <div className="hidden lg:block lg:col-span-5 lg:h-[450px] pointer-events-none" />
        </div>
      </section>

      {/* ── Product Preview (Grid of Cards) ── */}
      <section className="bg-ice-tint/30 border-y border-sea-fog py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-midnight-harbor tracking-tight">
              Mimpi Terbaru di Komunitas
            </h2>
            <p className="text-sm text-slate-channel mt-2">
              Diterbitkan secara anonim, dianalisis secara instan oleh kecerdasan buatan.
            </p>
          </div>

          {/* Desktop View */}
          <div className="hidden md:grid gap-8 md:grid-cols-3">
            {recentDreams.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white border border-sea-fog rounded-2xl p-6">
                <HeartHandshake className="size-8 text-night-400 mx-auto" />
                <p className="mt-3 text-sm text-slate-channel">Belum ada mimpi terbaru yang dibagikan ke komunitas saat ini.</p>
              </div>
            ) : (
              recentDreams.map((dream) => {
                const parsedMeta = safeParseJson<{ emotions?: { name: string; color: string }[]; imagePath?: string }>(dream.meta, {});
                const topEmotion = parsedMeta?.emotions?.[0];
                const imageUrl = parsedMeta?.imagePath ? fileUrl(parsedMeta.imagePath) : "/canvas.png";
                
                return (
                  <div 
                    key={dream.id} 
                    onClick={() => router.push(hasToken() ? `/community/${dream.id}` : "/login")}
                    className="card overflow-hidden bg-white border border-sea-fog rounded-2xl flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    {/* Full-bleed gradient dream imagery placeholder */}
                    <div className="h-40 bg-gradient-to-tr from-ice-tint via-sea-fog to-light-mist relative flex items-end p-4 rounded-t-2xl overflow-hidden transition-all group-hover:opacity-90">
                      <img 
                        src={imageUrl} 
                        alt={dream.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/canvas.png";
                        }}
                      />
                      <span className="absolute top-3 right-3 bg-white/95 text-signal-blue text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase shadow-sm z-10">
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

          {/* Mobile Carousel View */}
          <div className="md:hidden relative w-full h-[360px] flex items-center justify-center">
            {recentDreams.length === 0 ? (
              <div className="w-full text-center py-12 bg-white border border-sea-fog rounded-2xl p-6">
                <HeartHandshake className="size-8 text-night-400 mx-auto" />
                <p className="mt-3 text-sm text-slate-channel">Belum ada mimpi terbaru yang dibagikan ke komunitas saat ini.</p>
              </div>
            ) : (
              <div className="relative w-full h-[320px]">
                {recentDreams.map((dream, idx) => {
                  let offset = idx - dreamsActiveIndex;
                  if (offset < -1) offset += recentDreams.length;
                  if (offset > recentDreams.length - 2) offset -= recentDreams.length;

                  const isVisible = offset === 0 || offset === 1 || offset === -1;
                  const isCenter = offset === 0;

                  const parsedMeta = safeParseJson<{ emotions?: { name: string; color: string }[]; imagePath?: string }>(dream.meta, {});
                  const topEmotion = parsedMeta?.emotions?.[0];
                  const imageUrl = parsedMeta?.imagePath ? fileUrl(parsedMeta.imagePath) : "/canvas.png";

                  return (
                    <div 
                      key={dream.id} 
                      onClick={() => router.push(hasToken() ? `/community/${dream.id}` : "/login")}
                      className={`absolute top-0 left-1/2 w-[280px] max-w-[calc(100vw-3rem)] bg-white border border-sea-fog rounded-2xl flex flex-col cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-dreamy-lg overflow-hidden ${
                        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
                      }`}
                      style={{
                        transform: `translate3d(calc(-50% + ${offset * 105}%), ${isCenter ? "0px" : "15px"}, 0) scale(${isCenter ? 1.02 : 0.92})`,
                        zIndex: isCenter ? 20 : 10,
                      }}
                    >
                      <div className="h-28 bg-gradient-to-tr from-ice-tint via-sea-fog to-light-mist relative flex items-end p-4 rounded-t-2xl overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={dream.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/canvas.png";
                          }}
                        />
                        <span className="absolute top-3 right-3 bg-white/95 text-signal-blue text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase shadow-sm z-10">
                          {dream.user.anonName}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-base text-midnight-harbor line-clamp-1 mb-1.5">
                            {dream.title}
                          </h3>
                          {topEmotion && (
                            <p className="text-[10px] text-slate-channel font-semibold mb-2 flex items-center gap-1">
                              <span className="inline-block size-1.5 rounded-full" style={{ backgroundColor: topEmotion.color }} />
                              {topEmotion.name}
                            </p>
                          )}
                          <p className="text-xs text-slate-channel line-clamp-3 leading-relaxed mb-2">
                            {dream.content}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-sea-fog/50 mt-auto text-[10px] text-slate-channel">
                          <span>{timeAgo(dream.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 overflow-hidden">
        <h2 className="text-center text-3xl font-extrabold text-midnight-harbor tracking-tight mb-12">
          Dari ingatan yang memudar jadi insight yang bertahan
        </h2>
        
        {/* Desktop View */}
        <div className="hidden sm:grid gap-8 sm:grid-cols-3">
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

        {/* Mobile Carousel View (Looping Marquee) */}
        <div className="sm:hidden w-full overflow-hidden relative py-4">
          <div className="flex gap-6 animate-marquee w-max hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer">
            {[
              { n: "01", t: "Catat Seketika", d: "Tulis mimpi begitu terbangun sebelum ia menguap — lengkap dengan suasana hati, kualitas tidur, dan parameter mimpi." },
              { n: "02", t: "Analisis Mendalam AI", d: "AI mendeteksi nuansa emosi, simbol psikoanalisis, dan mengekstrak tema utama untuk dihubungkan dalam peta mimpi." },
              { n: "03", t: "Kenali Pola Jiwamu", d: "Mimpi yang menumpuk membentuk garis tren emosi, membantu mengenali stres bawah sadar dan perkembangan batinmu." },
              // Duplicate once for infinite loop
              { n: "01_dup", t: "Catat Seketika", d: "Tulis mimpi begitu terbangun sebelum ia menguap — lengkap dengan suasana hati, kualitas tidur, dan parameter mimpi." },
              { n: "02_dup", t: "Analisis Mendalam AI", d: "AI mendeteksi nuansa emosi, simbol psikoanalisis, dan mengekstrak tema utama untuk dihubungkan dalam peta mimpi." },
              { n: "03_dup", t: "Kenali Pola Jiwamu", d: "Mimpi yang menumpuk membentuk garis tren emosi, membantu mengenali stres bawah sadar dan perkembangan batinmu." },
            ].map((s) => (
              <div key={s.n} className="card p-6 bg-white border border-sea-fog rounded-2xl w-[260px] shrink-0 whitespace-normal transition-shadow hover:shadow-dreamy-lg">
                <span className="text-signal-blue font-extrabold text-sm">{s.n.replace("_dup", "")}</span>
                <h3 className="mt-2 font-bold text-base text-midnight-harbor">{s.t}</h3>
                <p className="mt-1 text-xs text-slate-channel leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features List ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Carousel Container */}
        <div className="relative overflow-hidden w-full max-w-4xl mx-auto min-h-[380px] flex items-center justify-center">
          <div className="relative w-full h-[360px]">
            {FEATURES.map((f, idx) => {
              // Calculate index difference for a smooth horizontal sliding carousel
              let offset = idx - activeIndex;
              // Handle wrap-around index offsets
              if (offset < -1) offset += FEATURES.length;
              if (offset > FEATURES.length - 2) offset -= FEATURES.length;

              const isVisible = offset === 0 || offset === 1 || offset === -1;
              const isCenter = offset === 0;

              return (
                <div
                  key={f.title}
                  className={`absolute top-0 left-1/2 w-[280px] max-w-[calc(100vw-3rem)] sm:w-[320px] bg-white border border-sea-fog rounded-[28px] shadow-dreamy-lg overflow-hidden flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
                  }`}
                  style={{
                    transform: `translate3d(calc(-50% + ${offset * 105}%), ${isCenter ? "0px" : "15px"}, 0) scale(${isCenter ? 1.02 : 0.92})`,
                    zIndex: isCenter ? 20 : 10,
                  }}
                >
                  {/* Top Half: Illustration placeholder */}
                  <div className="h-44 sm:h-48 relative overflow-hidden bg-white flex items-center justify-center border-b border-sea-fog/50">
                    <img 
                      src={f.image} 
                      alt={f.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 bg-white"
                      onError={(e) => {
                        // Fallback placeholder with nice gradient if image hasn't been generated/saved yet
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.className = "h-44 sm:h-48 w-full bg-gradient-to-tr from-ice-tint via-sea-fog to-light-mist flex items-center justify-center text-signal-blue/40 font-bold text-lg border-b border-sea-fog/50";
                          parent.innerText = "somnia";
                        }
                      }}
                    />
                  </div>
                  {/* Bottom Half: Clean White Text layout */}
                  <div className="p-6 flex-1 flex flex-col justify-start text-left bg-white">
                    <h3 className="font-extrabold text-base sm:text-lg text-midnight-harbor tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-channel leading-relaxed">
                      {f.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 select-none">
          {FEATURES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`size-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? "bg-signal-blue w-4" : "bg-sea-fog hover:bg-slate-channel/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
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
              className="inline-flex items-center gap-2 bg-signal-blue hover:bg-signal-blue/90 text-white font-bold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all"
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
            © 2026 Somnia — kurakuraninja
          </div>
        </div>
      </footer>
    </main>
  );
}
