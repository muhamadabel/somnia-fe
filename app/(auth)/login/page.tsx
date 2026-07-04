"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { setToken } from "@/lib/session";

export default function LoginPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "register") {
        setActiveTab("register");
      }
    }
  }, []);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setError(null);
    setFieldErrors({});
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  async function onLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    try {
      const { data } = await api<{ token: string; onboarded: boolean }>("/api/auth/login", {
        method: "POST",
        json: { email: form.get("email"), password: form.get("password") },
      });
      setToken(data.token);
      toast("success", "Selamat datang kembali!");
      window.location.href = data.onboarded ? "/dashboard" : "/onboarding";
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors);
      } else setError("Gangguan jaringan — periksa koneksimu dan coba lagi.");
      setLoading(false);
    }
  }

  async function onRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password !== confirm) {
      setFieldErrors({ confirm: "Kata sandi tidak cocok" });
      return;
    }
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await api<{ token: string }>("/api/auth/register", {
        method: "POST",
        json: {
          fullName: form.get("fullName"),
          email: form.get("email"),
          password,
        },
      });
      setToken(data.token);
      toast("success", "Akun dibuat — selamat datang!");
      window.location.href = "/onboarding";
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.fieldErrors.fullName || err.fieldErrors.email || err.fieldErrors.password ? null : err.message);
        setFieldErrors(err.fieldErrors);
      } else setError("Gangguan jaringan — periksa koneksimu dan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ── Interactive Switcher Tabs with Sliding Indicator ── */}
      <div className="relative flex rounded-full bg-ice-tint p-1 mb-6" role="tablist">
        {/* Sliding Background Box */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            activeTab === "register" ? "left-[calc(50%+2px)]" : "left-1"
          }`}
        />
        <button
          onClick={() => handleTabChange("login")}
          role="tab"
          aria-selected={activeTab === "login"}
          className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
            activeTab === "login"
              ? "text-signal-blue font-bold"
              : "text-slate-channel hover:text-midnight-harbor"
          }`}
        >
          Masuk
        </button>
        <button
          onClick={() => handleTabChange("register")}
          role="tab"
          aria-selected={activeTab === "register"}
          className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
            activeTab === "register"
              ? "text-signal-blue font-bold"
              : "text-slate-channel hover:text-midnight-harbor"
          }`}
        >
          Daftar
        </button>
      </div>

      {activeTab === "login" ? (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-extrabold tracking-tight text-midnight-harbor">Selamat datang kembali</h1>
          <p className="text-sm text-slate-channel mt-1.5">
            Masuk untuk melanjutkan jurnal mimpimu, menjelajahi alam bawah sadar, dan berdiskusi dengan Teman AI tentang arti mimpimu.
          </p>

          <form onSubmit={onLoginSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="kamu@contoh.com"
              required
              error={fieldErrors.email}
            />
            <Input
              label="Kata sandi"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              error={fieldErrors.password}
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Masuk
            </Button>
          </form>

          <div className="mt-5 rounded-xl bg-ice-tint border border-sea-fog/50 p-3 text-xs text-slate-channel leading-relaxed text-center">
            <span className="font-bold text-midnight-harbor">Akun demo:</span> demo@somnia.app · dream1234
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-extrabold tracking-tight text-midnight-harbor">Mulai jurnal mimpimu</h1>
          <p className="text-sm text-slate-channel mt-1.5">Pribadi, dan milikmu seorang.</p>

          <form onSubmit={onRegisterSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Nama"
              name="fullName"
              placeholder="Namamu"
              required
              autoComplete="name"
              error={fieldErrors.fullName}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="kamu@contoh.com"
              required
              autoComplete="email"
              error={fieldErrors.email}
            />
            <Input
              label="Kata sandi"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter, huruf + angka"
              required
              autoComplete="new-password"
              error={fieldErrors.password}
              hint="Minimal 8 karakter dengan setidaknya satu huruf dan satu angka."
            />
            <Input
              label="Konfirmasi kata sandi"
              name="confirm"
              type="password"
              placeholder="Ulangi kata sandimu"
              required
              autoComplete="new-password"
              error={fieldErrors.confirm}
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Buat akun
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
