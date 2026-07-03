import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { DreamCard } from "@/components/dream/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { EMOTIONS, MOODS } from "@/lib/constants";
import { PenLine, Search } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Mimpi" };

const PAGE_SIZE = 12;

export default async function DreamsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = (await getCurrentUser())!;
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const emotion = sp.emotion ?? "";
  const mood = sp.mood ?? "";
  const status = sp.status ?? "active";
  const sort = sp.sort ?? "newest";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.DreamWhereInput = {
    userId: user.id,
    deletedAt: null,
    ...(status === "active" ? { isDraft: false, archivedAt: null } : {}),
    ...(status === "drafts" ? { isDraft: true } : {}),
    ...(status === "archived" ? { archivedAt: { not: null } } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}),
    ...(mood ? { mood } : {}),
    ...(emotion ? { emotions: { some: { emotion: { name: emotion } } } } : {}),
  };

  const [total, dreams] = await Promise.all([
    db.dream.count({ where }),
    db.dream.findMany({
      where,
      orderBy: sort === "oldest" ? { dreamDate: "asc" } : { dreamDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        emotions: { include: { emotion: true } },
        symbols: { include: { symbol: true } },
        visualizations: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { imagePath: true },
        },
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filterLink = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const next = { q, emotion, mood, status, sort, ...patch };
    for (const [k, v] of Object.entries(next)) if (v && v !== "active" && v !== "newest") params.set(k, v);
    const s = params.toString();
    return `/dreams${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Mimpi"
        subtitle={`${total} mimpi di tampilan ini`}
        action={
          <Link
            href="/dreams/new"
            className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 shadow-dreamy transition-colors"
          >
            <PenLine className="size-4" /> Catat Mimpi
          </Link>
        }
      />

      {/* ── Filter ── */}
      <form method="GET" className="card p-4 mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari mimpi…"
              aria-label="Cari mimpi"
              className="input-base pl-9"
            />
          </div>
          <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 cursor-pointer transition-colors">
            Terapkan
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          <select name="emotion" defaultValue={emotion} aria-label="Filter emosi" className="input-base text-sm">
            <option value="">Emosi</option>
            {EMOTIONS.map((e) => (
              <option key={e.name} value={e.name}>{e.label}</option>
            ))}
          </select>
          <select name="mood" defaultValue={mood} aria-label="Filter suasana hati" className="input-base text-sm">
            <option value="">Mood</option>
            {MOODS.map((m) => (
              <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} aria-label="Urutkan" className="input-base text-sm">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
        {status !== "active" && <input type="hidden" name="status" value={status} />}
      </form>

      {/* ── Status tabs ── */}
      <div className="flex gap-2 mb-5" role="tablist" aria-label="Status mimpi">
        {[
          { key: "active", label: "Jurnal" },
          { key: "drafts", label: "Draf" },
          { key: "archived", label: "Arsip" },
        ].map((t) => (
          <Link
            key={t.key}
            href={filterLink({ status: t.key, page: "" })}
            role="tab"
            aria-selected={status === t.key}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === t.key ? "bg-night-600 text-white" : "surface text-muted hover:text-body border-base"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {dreams.length === 0 ? (
        <EmptyState
          title={q || emotion || mood ? "Tidak ada mimpi yang cocok" : status === "drafts" ? "Belum ada draf" : status === "archived" ? "Belum ada arsip" : "Belum ada mimpi"}
          message={
            q || emotion || mood
              ? "Coba longgarkan pencarian atau hapus salah satu filter."
              : "Mulai dengan mencatat mimpi pertamamu — fragmen pun berarti."
          }
          action={
            <Link href="/dreams/new" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              <PenLine className="size-4" /> Catat mimpi
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.map((d) => (
            <DreamCard key={d.id} dream={d} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginasi">
          {page > 1 && (
            <Link href={filterLink({ page: String(page - 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              ← Sebelumnya
            </Link>
          )}
          <span className="text-sm text-muted px-2">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <Link href={filterLink({ page: String(page + 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              Berikutnya →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
