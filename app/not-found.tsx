import Link from "next/link";
import { MoonStar } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen night-sky flex flex-col items-center justify-center p-6 text-center text-white">
      <MoonStar className="size-10 text-night-300" />
      <h1 className="mt-4 text-3xl font-semibold font-display">
        Halaman ini menghilang
      </h1>
      <p className="mt-2 text-night-200 max-w-sm">
        Seperti mimpi setelah bangun, apa pun yang tadi di sini tak bisa ditemukan. Ayo kembali ke tempat yang familiar.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 bg-night-500 hover:bg-night-400 text-white font-medium rounded-xl px-6 py-3 transition-colors"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
