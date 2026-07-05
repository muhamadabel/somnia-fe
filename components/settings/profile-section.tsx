import React from "react";
import { UserAvatar } from "@/components/layout/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AVATAR_PRESETS, DEFAULT_AVATAR_PATH } from "@/lib/avatar-presets";
import { SettingsUser } from "./settings-form";

interface ProfileSectionProps {
  user: SettingsUser;
  stats: { dreamCount: number; analysisCount: number; postCount: number; artCount: number };
  avatarPath: string;
  onAvatarChange: (path: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export function ProfileSection({
  user,
  stats,
  avatarPath,
  onAvatarChange,
  onSubmit,
  loading,
}: ProfileSectionProps) {
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 font-semibold text-body mb-1">
        <User className="size-4.5 text-night-500" /> Profil
      </h2>
      <p className="text-xs text-muted mb-4">
        Anggota sejak {formatDate(user.memberSince, { month: "long" })} · {stats.dreamCount} mimpi ·{" "}
        {stats.analysisCount} analisis · {stats.artCount} karya seni · {stats.postCount} dibagikan
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl surface-2 p-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.fullName}
              avatarPath={avatarPath || DEFAULT_AVATAR_PATH}
              className="size-20 shrink-0 border border-base"
            />
            <div>
              <p className="text-sm font-medium text-body">Avatar profil</p>
              <p className="text-xs text-muted mt-1">
                Pilih avatar dari koleksi internal. File gambarnya bisa kamu ganti manual nanti tanpa ubah kode fitur.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AVATAR_PRESETS.map((avatar) => {
              const active = (avatarPath || DEFAULT_AVATAR_PATH) === avatar.path;
              return (
                <label
                  key={avatar.id}
                  className={`cursor-pointer rounded-2xl border p-3 transition ${
                    active ? "border-night-500 bg-night-500/8" : "border-base hover:border-night-300 hover:bg-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="avatarPath"
                    value={avatar.path}
                    defaultChecked={active}
                    onChange={() => onAvatarChange(avatar.path)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <img src={avatar.path} alt={avatar.label} className="size-12 rounded-full object-cover border border-base" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-body">{avatar.label}</p>
                      <p className="text-xs text-muted truncate">{avatar.id}</p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama" name="fullName" defaultValue={user.fullName} required minLength={2} maxLength={60} />
          <Input label="Email" value={user.email} disabled hint="Perubahan email butuh bantuan dukungan." />
          <Input label="Zona waktu" name="timezone" defaultValue={user.timezone} />
          <input type="hidden" name="language" value="id" />
        </div>
        <div className="rounded-xl surface-2 px-4 py-3 text-xs text-muted">
          Nama samaran komunitas: <span className="font-medium text-body">{user.anonName}</span> — ini satu-satunya
          nama yang dilihat pengguna lain.
        </div>
        <Button type="submit" loading={loading}>Simpan profil</Button>
      </form>
    </section>
  );
}
