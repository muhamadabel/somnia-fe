import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { getCurrentUser } from "@/lib/auth";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Dreamy night look by default; signed-in users can switch in Settings.
  const dark = user ? user.theme === "dark" : true;
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} ${dark ? "dark" : ""}`}>
      <body className="min-h-screen antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
