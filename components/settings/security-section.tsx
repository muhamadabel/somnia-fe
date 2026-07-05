import React from "react";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SecuritySectionProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export function SecuritySection({
  onSubmit,
  loading,
}: SecuritySectionProps) {
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 font-semibold text-body mb-4">
        <ShieldCheck className="size-4.5 text-night-500" /> Keamanan
      </h2>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input label="Kata sandi saat ini" name="currentPassword" type="password" required autoComplete="current-password" />
        <Input
          label="Kata sandi baru"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          hint="Min. 8 karakter dengan huruf dan angka."
        />
        <div className="sm:col-span-2">
          <Button type="submit" variant="secondary" loading={loading}>Ubah kata sandi</Button>
        </div>
      </form>
    </section>
  );
}
