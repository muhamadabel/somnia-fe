import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Stars } from "@/components/layout/stars";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen night-sky lg:grid lg:grid-cols-2">
      {/* ── Left: night scenery + tagline (desktop only) ── */}
      <section 
        className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white bg-midnight-harbor"
        style={{
          backgroundImage: "url('/book-image-crop.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
      <section className="relative flex flex-col items-center justify-center p-4 py-10 min-h-screen lg:min-h-0 bg-canvas-white">
        <Link href="/" className="lg:hidden flex items-center mb-6">
          <span className="font-extrabold text-3xl tracking-tighter text-signal-blue lowercase">somnia</span>
        </Link>
        <div className=" w-full max-w-md p-8 animate-fade-up">{children}</div>
      </section>
    </main>
  );
}

