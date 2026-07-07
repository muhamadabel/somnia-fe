import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeApplier } from "@/components/layout/theme-applier";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s — ${APP_NAME}` },
  description:
    "Somnia adalah jurnal mimpi bertenaga AI yang membantumu memahami diri — catat mimpi, temukan pola emosi, simbol berulang, dan insight reflektif.",
  icons: { icon: "/icon-white.png" },
};

// Default to light theme; ThemeApplier switches according to saved preference.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${figtree.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeApplier />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
