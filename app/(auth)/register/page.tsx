"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { setToken } from "@/lib/session";

export default function RegisterPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      <h1 className="text-xl font-semibold text-body">Mulai jurnal mimpimu</h1>
      <p className="text-sm text-muted mt-1">Gratis, pribadi, dan milikmu seorang.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Input label="Nama" name="fullName" placeholder="Namamu" required autoComplete="name" error={fieldErrors.fullName} />
        <Input label="Email" name="email" type="email" placeholder="kamu@contoh.com" required autoComplete="email" error={fieldErrors.email} />
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
          <p className="text-sm text-red-600 dark:text-red-400 surface-2 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Buat akun
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-night-600 dark:text-night-300 font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
