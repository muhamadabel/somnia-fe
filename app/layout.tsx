import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeApplier } from "@/components/layout/theme-applier";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} — ${APP_TAGLINE}`, template: `%s · ${APP_NAME}` },
  description:
    "Somnia adalah jurnal mimpi bertenaga AI yang membantumu memahami diri — catat mimpi, temukan pola emosi, simbol berulang, dan insight reflektif.",
  icons: { icon: "/icon.svg" },
};

// Dreamy night look by default; ThemeApplier switches to light if chosen.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeApplier />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
