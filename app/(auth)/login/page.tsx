"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { api, ApiError } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { setToken } from "@/lib/session";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

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

  const { mutate: doLogin, isMutating: loggingIn } = useMutation(
    (json: any) => api<{ token: string; onboarded: boolean }>("/api/auth/login", { method: "POST", json }),
    {
      successMessage: "Selamat datang kembali!",
      disableErrorToast: true,
      onSuccess: ({ data }) => {
        setToken(data.token);
        router.push(data.onboarded ? "/dashboard" : "/onboarding");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          setError(err.message);
          setFieldErrors(err.fieldErrors);
        } else setError("Gangguan jaringan — periksa koneksimu dan coba lagi.");
      }
    }
  );

  function onLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    doLogin({ email: form.get("email"), password: form.get("password") }).catch(() => {});
  }

  const { mutate: doRegister, isMutating: registering } = useMutation(
    (json: any) => api<{ token: string }>("/api/auth/register", { method: "POST", json }),
    {
      successMessage: "Akun dibuat — selamat datang!",
      disableErrorToast: true,
      onSuccess: ({ data }) => {
        setToken(data.token);
        router.push("/onboarding");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          setError(err.fieldErrors.fullName || err.fieldErrors.email || err.fieldErrors.password ? null : err.message);
          setFieldErrors(err.fieldErrors);
        } else setError("Gangguan jaringan — periksa koneksimu dan coba lagi.");
      }
    }
  );

  function onRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    
    setError(null);
    setFieldErrors({});
    
    if (password !== confirm) {
      setFieldErrors({ confirm: "Kata sandi tidak cocok" });
      return;
    }
    
    doRegister({
      fullName: form.get("fullName"),
      email: form.get("email"),
      password,
    }).catch(() => {});
  }

  return (
    <div>

      {/* ── Interactive Switcher Tabs with Sliding Indicator ── */}
      <SegmentedControl
        value={activeTab}
        onChange={(v) => handleTabChange(v as "login" | "register")}
        className="mb-8 w-full"
        options={[
          { value: "login", label: "Masuk" },
          { value: "register", label: "Daftar" },
        ]}
      />

      {activeTab === "login" ? (
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-midnight-harbor">Selamat datang kembali</h1>
          <p className="text-sm text-slate-channel mt-2 leading-relaxed">
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
            <Button type="submit" loading={loggingIn} className="w-full" size="lg">
              Masuk
            </Button>
          </form>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-midnight-harbor">Mulai jurnal mimpimu</h1>
          <p className="text-sm text-slate-channel mt-2 leading-relaxed">Pribadi, dan milikmu seorang.</p>

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
            <Button type="submit" loading={registering} className="w-full" size="lg">
              Buat akun
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
