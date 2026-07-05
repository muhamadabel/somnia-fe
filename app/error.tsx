"use client";

import { Button } from "@/components/ui/button";
import { CloudMoon } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <CloudMoon className="size-10 text-night-400" />
      <h1 className="mt-4 text-2xl font-semibold text-body font-display">
        Terjadi kesalahan
      </h1>
      <p className="mt-2 text-sm text-muted max-w-sm">
        Gangguan sementara di sisi kami — mimpimu aman. Coba lagi, dan jika terus terjadi, muat ulang
        halamannya.
      </p>
      <Button onClick={reset} className="mt-5">
        Coba lagi
      </Button>
    </main>
  );
}
