"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ReactionBar } from "@/components/community/reaction-bar";
import { safeParseJson, timeAgo, truncate } from "@/lib/utils";
import { emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { useApi } from "@/lib/use-api";
import { HeartHandshake, MessageCircle, Search } from "lucide-react";

interface PostMeta {
  emotions: Array<{ name: string; color: string }>;
  symbols: string[];
  mood: string | null;
}
interface FeedPost {
  id: string;
  title: string;
  content: string;
  meta: string;
  createdAt: string;
  user: { anonName: string };
  reactionCounts: Record<string, number>;
  myReactions: string[];
  commentCount: number;
}

export default function CommunityPage() {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const sort = sp.get("sort") ?? "top";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort !== "recent") query.set("sort", sort);
  query.set("page", String(page));

  const { data: posts, meta, loading } = useApi<FeedPost[]>(`/api/community/posts?${query}`, [query.toString()]);
  const totalPages = (meta.totalPages as number) ?? 1;

  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { q, sort, page: "", ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && v !== "top") params.set(k, v);
    const s = params.toString();
    return `/community${s ? `?${s}` : ""}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Komunitas"
        subtitle="Dibagikan secara anonim — bersikaplah baik."
      />

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sea-fog/60 shadow-dreamy-lg rounded-2xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <form method="GET" className="flex gap-2 flex-1 w-full relative">
          <SearchBar 
            name="q" 
            defaultValue={q} 
            placeholder="Cari mimpi yang dibagikan…" 
            aria-label="Cari komunitas" 
          />
          {sort !== "top" && <input type="hidden" name="sort" value={sort} />}
          <button 
            type="submit" 
            className="bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-full px-5 cursor-pointer transition-colors"
          >
            Cari
          </button>
        </form>

        <SegmentedControl
          ariaLabel="Urutkan feed"
          value={sort}
          className="w-full sm:w-64 shrink-0"
          options={[
            { value: "top", label: "Paling disukai", href: link({ sort: "top" }) },
            { value: "recent", label: "Terbaru", href: link({ sort: "recent" }) },
          ]}
        />
      </div>

      {loading ? (
        <PageSkeleton />
      ) : !posts || posts.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake className="size-8" />}
          title={q ? "Tidak ada postingan yang cocok" : "Belum ada mimpi dibagikan"}
          message={q ? "Coba kata kunci lain." : "Jadilah yang pertama — buka salah satu mimpimu dan tekan Bagikan."}
          action={
            <Link href="/dreams" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
              Jelajahi mimpiku
            </Link>
          }
        />
      ) : (
        <div className="space-y-4 max-w-3xl">
          {posts.map((post) => {
            const meta = safeParseJson<PostMeta>(post.meta, { emotions: [], symbols: [], mood: null });
            return (
              <article key={post.id} className="card p-5 hover:shadow-dreamy-lg transition-shadow">
                <Link href={`/community/${post.id}`} className="block group">
                  <div className="flex items-center gap-2.5 text-xs text-muted">
                    <span className="size-7 rounded-full bg-gradient-to-br from-night-300 to-night-600 text-white grid place-items-center text-[11px] font-semibold" aria-hidden>
                      {post.user.anonName.slice(0, 1)}
                    </span>
                    <span className="font-medium text-body">{post.user.anonName}</span>
                    <span aria-hidden>·</span>
                    <time>{timeAgo(post.createdAt)}</time>
                  </div>
                  <h2 className="mt-2.5 font-semibold text-body text-lg group-hover:text-night-600 dark:group-hover:text-night-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{truncate(post.content, 260)}</p>
                  {(meta.emotions.length > 0 || meta.symbols.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {meta.emotions.slice(0, 2).map((e) => (
                        <Badge key={e.name} color={e.color}>{emotionLabel(e.name)}</Badge>
                      ))}
                      {meta.symbols.slice(0, Math.max(0, 3 - Math.min(meta.emotions.length, 2))).map((s) => (
                        <Badge key={s}>✧ {symbolLabel(s)}</Badge>
                      ))}
                    </div>
                  )}
                </Link>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <ReactionBar postId={post.id} counts={post.reactionCounts} mine={post.myReactions} />
                  <Link href={`/community/${post.id}`} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-body">
                    <MessageCircle className="size-3.5" /> {post.commentCount} komentar
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginasi">
          {page > 1 && (
            <Link href={link({ page: String(page - 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              ← Sebelumnya
            </Link>
          )}
          <span className="text-sm text-muted px-2">Halaman {page} dari {totalPages}</span>
          {page < totalPages && (
            <Link href={link({ page: String(page + 1) })} className="surface border-base rounded-xl px-4 py-2 text-sm text-body hover:bg-(--surface-2)">
              Berikutnya →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
