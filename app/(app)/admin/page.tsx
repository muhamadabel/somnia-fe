"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
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

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { icon: Users, label: "Pengguna", value: stats.userCount },
          { icon: Activity, label: "Mimpi", value: stats.dreamCount },
          { icon: ShieldCheck, label: "Postingan komunitas", value: stats.postCount },
          { icon: Flag, label: "Laporan terbuka", value: stats.openReports },
        ].map((s) => (
          <div key={s.label} className="card p-3.5 sm:p-4 flex items-center gap-3 rounded-[20px] sm:rounded-[24px]">
            <span className="rounded-xl surface-2 p-2 sm:p-2.5 text-night-500 shrink-0">
              <s.icon className="size-4.5 sm:size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-body leading-none">{s.value}</p>
              <p className="text-[11px] sm:text-xs text-muted mt-1 leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <SegmentedControl
        ariaLabel="Bagian admin"
        value={tab}
        className="mb-6 w-full sm:max-w-md"
        options={[
          { value: "moderation", label: `Moderasi${openReports ? ` (${openReports})` : ""}`, href: `/admin?tab=moderation` },
          { value: "users", label: "Pengguna", href: `/admin?tab=users` },
          { value: "audit", label: "Jejak audit", href: `/admin?tab=audit` },
        ]}
      />

      {tab === "moderation" && (
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-sm text-muted py-6 text-center">Tidak ada laporan konten.</p>}
          {reports.map((r) => (
            <div key={r.id} className="card p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted min-w-0">
                  <Badge
                    color={r.status === "open" ? "#f97316" : r.status === "resolved" ? "#ef4444" : "#64748b"}
                    className="shrink-0"
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </Badge>
                  <span className="truncate">{r.comment ? "Komentar" : "Postingan"} oleh {r.reporter.anonName}</span>
                  <span aria-hidden className="hidden sm:inline">·</span>
                  <time className="shrink-0">{timeAgo(r.createdAt)}</time>
                </div>
                {r.status === "open" && (
                  <div className="flex justify-end pt-1 sm:pt-0 shrink-0">
                    <ModerationActions reportId={r.id} />
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-body">
                <span className="font-semibold">Alasan:</span> {r.reason}
              </p>
              <div className="mt-2 rounded-xl surface-2 p-3 sm:p-3.5 text-sm text-muted break-words">
                {r.comment ? (
                  <>“{truncate(r.comment.content, 220)}”</>
                ) : r.post ? (
                  <>
                    <span className="font-medium text-body">{r.post.title}</span> — {truncate(r.post.content, 200)}{" "}
                    <Link href={`/community/${r.post.id}`} className="text-night-600 dark:text-night-300 hover:underline inline-flex items-center gap-0.5">
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
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted border-b border-base bg-ice-tint/30 dark:bg-night-950/20">
                    <th className="px-4 py-3 font-medium">Pengguna</th>
                    <th className="px-4 py-3 font-medium">Peran</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-center">Mimpi</th>
                    <th className="px-4 py-3 font-medium text-center">Post</th>
                    <th className="px-4 py-3 font-medium">Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-base last:border-0 hover:bg-ice-tint/10 dark:hover:bg-night-950/10">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-body">{u.fullName}</p>
                        <p className="text-xs text-muted">{u.email}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><Badge>{u.role === "admin" ? "admin" : "pengguna"}</Badge></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge color={u.status === "active" ? "#34d399" : "#ef4444"}>{u.status === "active" ? "aktif" : "ditangguhkan"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted text-center">{u._count.dreams}</td>
                      <td className="px-4 py-3 text-muted text-center">{u._count.posts}</td>
                      <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{formatDateTime(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="card divide-y divide-(--border) overflow-hidden">
          {logs.length === 0 && <p className="p-6 text-sm text-muted text-center">Tidak ada peristiwa audit.</p>}
          {logs.map((l) => (
            <div key={l.id} className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm hover:bg-ice-tint/10 dark:hover:bg-night-950/10">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <Badge className="shrink-0">{l.event}</Badge>
                <span className="text-muted text-xs truncate">{l.user?.email ?? "system"}{l.detail ? ` · ${l.detail}` : ""}</span>
              </div>
              <time className="text-xs text-muted shrink-0 sm:text-right">{formatDateTime(l.createdAt)}</time>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
