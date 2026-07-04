"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ModerationActions } from "@/components/admin/moderation-actions";
import { formatDateTime, timeAgo, truncate } from "@/lib/utils";
import { useApi } from "@/lib/use-api";
import { Activity, Flag, ShieldCheck, Users } from "lucide-react";

const STATUS_LABEL: Record<string, string> = { open: "terbuka", resolved: "diselesaikan", dismissed: "diabaikan" };

interface AdminReport {
  id: string;
  status: string;
  reason: string;
  createdAt: string;
  reporter: { anonName: string };
  post: { id: string; title: string; content: string } | null;
  comment: { id: string; content: string; postId: string } | null;
}
interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  _count: { dreams: number; posts: number };
}
interface AdminLog {
  id: string;
  event: string;
  detail: string | null;
  createdAt: string;
  user: { email: string } | null;
}
interface AdminOverview {
  stats: { userCount: number; dreamCount: number; postCount: number; openReports: number };
  reports: AdminReport[];
  users: AdminUser[];
  logs: AdminLog[];
}

export default function AdminPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "moderation";

  const { data, loading, error } = useApi<AdminOverview>(`/api/admin/overview?tab=${tab}`, [tab]);

  useEffect(() => {
    if (error) router.replace("/dashboard");
  }, [error, router]);

  if (loading || !data) return <PageSkeleton />;

  const { stats, reports, users, logs } = data;
  const openReports = stats.openReports;

  return (
    <>
      <PageHeader title="Administrasi" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { icon: Users, label: "Pengguna", value: stats.userCount },
          { icon: Activity, label: "Mimpi", value: stats.dreamCount },
          { icon: ShieldCheck, label: "Postingan komunitas", value: stats.postCount },
          { icon: Flag, label: "Laporan terbuka", value: stats.openReports },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <span className="rounded-xl surface-2 p-2.5 text-night-500">
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-xl font-semibold text-body leading-none">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Bagian admin">
        {[
          { key: "moderation", label: `Moderasi${openReports ? ` (${openReports})` : ""}` },
          { key: "users", label: "Pengguna" },
          { key: "audit", label: "Jejak audit" },
        ].map((t) => (
          <Link
            key={t.key}
            href={`/admin?tab=${t.key}`}
            role="tab"
            aria-selected={tab === t.key}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-night-600 text-white" : "surface border-base text-muted hover:text-body"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "moderation" && (
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-sm text-muted">Tidak ada laporan konten.</p>}
          {reports.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Badge
                    color={r.status === "open" ? "#f97316" : r.status === "resolved" ? "#ef4444" : "#64748b"}
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </Badge>
                  <span>{r.comment ? "Komentar" : "Postingan"} dilaporkan oleh {r.reporter.anonName}</span>
                  <span aria-hidden>·</span>
                  <time>{timeAgo(r.createdAt)}</time>
                </div>
                {r.status === "open" && <ModerationActions reportId={r.id} />}
              </div>
              <p className="mt-3 text-sm text-body">
                <span className="font-medium">Alasan:</span> {r.reason}
              </p>
              <div className="mt-2 rounded-xl surface-2 p-3.5 text-sm text-muted">
                {r.comment ? (
                  <>“{truncate(r.comment.content, 220)}”</>
                ) : r.post ? (
                  <>
                    <span className="font-medium text-body">{r.post.title}</span> — {truncate(r.post.content, 200)}{" "}
                    <Link href={`/community/${r.post.id}`} className="text-night-600 dark:text-night-300 hover:underline">
                      lihat
                    </Link>
                  </>
                ) : (
                  <em>Konten sudah dihapus.</em>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-base">
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Peran</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Mimpi</th>
                <th className="px-4 py-3 font-medium">Postingan</th>
                <th className="px-4 py-3 font-medium">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-base last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-body">{u.fullName}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge>{u.role === "admin" ? "admin" : "pengguna"}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge color={u.status === "active" ? "#34d399" : "#ef4444"}>{u.status === "active" ? "aktif" : "ditangguhkan"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{u._count.dreams}</td>
                  <td className="px-4 py-3 text-muted">{u._count.posts}</td>
                  <td className="px-4 py-3 text-muted text-xs">{formatDateTime(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "audit" && (
        <div className="card divide-y divide-(--border)">
          {logs.length === 0 && <p className="p-5 text-sm text-muted">Tidak ada peristiwa audit.</p>}
          {logs.map((l) => (
            <div key={l.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge>{l.event}</Badge>
                <span className="text-muted text-xs">{l.user?.email ?? "system"}{l.detail ? ` · ${l.detail}` : ""}</span>
              </div>
              <time className="text-xs text-muted">{formatDateTime(l.createdAt)}</time>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
