import Link from "next/link";
import { MoonStar } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Stars } from "@/components/layout/stars";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen night-sky lg:grid lg:grid-cols-2">
      {/* ── Left: night scenery + tagline (desktop only) ── */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white">
        <Stars count={70} />
        <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f6d9c0 0%, rgba(246,217,192,0.25) 45%, transparent 70%)" }} />
        <Link href="/" className="relative flex items-center gap-2 font-semibold text-lg w-fit">
          <MoonStar className="size-6 text-night-300" /> {APP_NAME}
        </Link>
        <div className="relative max-w-md">
          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Pahami mimpimu,
            <br />
            <span className="bg-gradient-to-r from-night-300 to-dusk-300 bg-clip-text text-transparent">
              kenali dirimu.
            </span>
          </h1>
        </div>
        <span aria-hidden />
      </section>

      {/* ── Right: form ── */}
      <section className="relative flex flex-col items-center justify-center p-4 py-10 min-h-screen lg:min-h-0">
        <Link href="/" className="lg:hidden flex items-center gap-2 text-white font-semibold text-xl mb-6">
          <MoonStar className="size-6 text-night-300" /> {APP_NAME}
        </Link>
        <div className="card w-full max-w-md p-7 animate-fade-up">{children}</div>
      </section>
    </main>
  );
}
