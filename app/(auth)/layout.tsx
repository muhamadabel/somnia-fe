import Link from "next/link";
import { Stars } from "@/components/layout/stars";
import { X } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-canvas-white lg:grid lg:grid-cols-2">

      {/* ── Mobile hero banner (hidden on desktop) ── */}
      <div className="lg:hidden relative overflow-hidden bg-midnight-harbor bg-[url('/book-image-crop.png')] bg-cover bg-center min-h-[200px] flex flex-col justify-end px-6 pb-8 pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-harbor/60 via-midnight-harbor/50 to-midnight-harbor/80" />
        <Stars count={25} />
        <Link href="/" className="relative flex items-center mb-3">
          <span className="font-extrabold text-3xl tracking-tighter text-white lowercase">somnia</span>
        </Link>
        <p className="relative text-sea-fog/90 text-sm font-medium leading-relaxed max-w-xs">
          Pahami mimpimu, kenali dirimu.
        </p>
      </div>

      {/* ── Left: night scenery + tagline (desktop only) ── */}
      <section 
        className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white bg-midnight-harbor bg-[url('/book-image-crop.png')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-midnight-harbor/40 backdrop-blur-[1px]" />
        <Stars count={50} />
        <Link href="/" className="relative flex items-center w-fit">
          <span className="font-extrabold text-2xl tracking-tighter text-white lowercase">somnia</span>
        </Link>
        <div className="relative max-w-md pb-20">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
            Pahami mimpimu,
            <br />
            <span className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              kenali dirimu.
            </span>
          </h1>
        </div>
        <span aria-hidden className="relative" />
      </section>

      {/* ── Right: form ── */}
      <section className="relative flex flex-col items-center justify-start lg:justify-center bg-canvas-white min-h-0">
        {/* ── Close Button ── */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 group">
          <span className="text-[10px] font-medium text-slate-channel bg-sea-fog/80 backdrop-blur-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Tekan ESC untuk keluar
          </span>
          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-full border-2 border-signal-blue text-signal-blue bg-white hover:bg-ice-tint hover:shadow-md transition-all cursor-pointer shadow-sm"
            aria-label="Tutup dan kembali ke beranda"
          >
            <X className="size-5" />
          </Link>
        </div>

        <div className="w-full max-w-md px-6 py-8 sm:px-8 animate-fade-up">
          {children}
        </div>
      </section>
    </main>
  );
}
