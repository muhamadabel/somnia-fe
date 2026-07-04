"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { setToken } from "@/lib/session";

export default function LoginPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  return (
    <div>
      <h1 className="text-xl font-semibold text-body">Selamat datang kembali</h1>
      <p className="text-sm text-muted mt-1">Masuk untuk melanjutkan jurnal mimpimu.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
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
          <p className="text-sm text-red-600 dark:text-red-400 surface-2 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Masuk
        </Button>
      </form>

      <div className="mt-5 rounded-xl surface-2 p-3 text-xs text-muted leading-relaxed">
        <span className="font-medium text-body">Akun demo:</span> demo@somnia.app · dream1234
      </div>

      <p className="mt-5 text-sm text-muted text-center">
        Baru di sini?{" "}
        <Link href="/register" className="text-night-600 dark:text-night-300 font-medium hover:underline">
          Buat akun
        </Link>
      </p>
    </div>
  );
}
