import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { GalleryItem } from "@/components/dream/gallery-item";
import { Images, Search } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Galeri" };

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = (await getCurrentUser())!;
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  const visualizations = await db.visualization.findMany({
    where: {
      deletedAt: null,
      dream: {
        userId: user.id,
        deletedAt: null,
        ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}),
      },
    },
    include: { dream: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <>
      <PageHeader
        title="Galeri Visualisasi"
        subtitle="Semua karya seni dari mimpimu, dalam satu tempat."
      />

      <form method="GET" className="card p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari berdasarkan judul atau isi mimpi…"
            aria-label="Cari galeri"
            className="input-base pl-9"
          />
        </div>
        <button type="submit" className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 cursor-pointer transition-colors">
          Cari
        </button>
      </form>

      {visualizations.length === 0 ? (
        <EmptyState
          icon={<Images className="size-8" />}
          title={q ? "Tidak ada karya yang cocok" : "Belum ada seni mimpi"}
          message={
            q
              ? "Coba kata kunci lain."
              : "Buka mimpi mana pun dan tekan “Buat karya seni” — emosi dan simbolnya jadi visual unik."
          }
          action={
            <Link href="/dreams" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              Jelajahi mimpi
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visualizations.map((v) => (
            <GalleryItem
              key={v.id}
              viz={{
                id: v.id,
                imagePath: v.imagePath,
                prompt: v.prompt,
                createdAt: v.createdAt.toISOString(),
                dreamId: v.dream.id,
                dreamTitle: v.dream.title ?? "Mimpi tanpa judul",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
