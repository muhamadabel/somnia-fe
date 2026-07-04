"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { ReactionBar } from "@/components/community/reaction-bar";
import { CommentForm, DeleteContentButton, ReportButton } from "@/components/community/post-interactions";
import { PageSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { safeParseJson, timeAgo } from "@/lib/utils";
import { emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { useApi } from "@/lib/use-api";
import { ArrowLeft } from "lucide-react";

interface PostMeta {
  emotions: Array<{ name: string; color: string }>;
  symbols: string[];
  mood: string | null;
}
interface PostDetail {
  id: string;
  title: string;
  content: string;
  meta: string;
  createdAt: string;
  user: { anonName: string };
  comments: Array<{ id: string; content: string; createdAt: string; user: { anonName: string }; mine: boolean }>;
  reactionCounts: Record<string, number>;
  myReactions: string[];
  mine: boolean;
}

export default function CommunityPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, loading, error } = useApi<PostDetail>(`/api/community/posts/${id}`, [id]);

  if (loading) return <PageSkeleton />;
  if (error || !post) {
    return (
      <EmptyState
        title="Postingan tidak ditemukan"
        message="Postingan ini mungkin sudah dihapus."
        action={
          <Link href="/community" className="inline-flex items-center gap-2 bg-night-600 hover:bg-night-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
            Feed komunitas
          </Link>
        }
      />
    );
  }

  const meta = safeParseJson<PostMeta>(post.meta, { emotions: [], symbols: [], mood: null });

  return (
    <div className="max-w-3xl">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body mb-4">
        <ArrowLeft className="size-4" /> Feed komunitas
      </Link>

      <article className="card p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-muted">
            <span className="size-8 rounded-full bg-gradient-to-br from-night-300 to-night-600 text-white grid place-items-center text-xs font-semibold" aria-hidden>
              {post.user.anonName.slice(0, 1)}
            </span>
            <div>
              <p className="font-medium text-body text-sm">
                {post.user.anonName} {post.mine && <Badge className="ml-1">kamu</Badge>}
              </p>
              <time>{timeAgo(post.createdAt)}</time>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {post.mine ? (
              <DeleteContentButton postId={post.id} redirectTo="/community" />
            ) : (
              <ReportButton postId={post.id} />
            )}
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-body" style={{ fontFamily: "var(--font-display)" }}>
          {post.title}
        </h1>
        <p className="mt-3 text-[15px] text-body leading-relaxed whitespace-pre-line">{post.content}</p>

        {(meta.emotions.length > 0 || meta.symbols.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {meta.emotions.map((e) => (
              <Badge key={e.name} color={e.color}>
                <EmotionDot color={e.color} /> {emotionLabel(e.name)}
              </Badge>
            ))}
            {meta.symbols.map((s) => (
              <Badge key={s}>✧ {symbolLabel(s)}</Badge>
            ))}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-base">
          <ReactionBar postId={post.id} counts={post.reactionCounts} mine={post.myReactions} />
        </div>
      </article>

      <section className="mt-6">
        <h2 className="font-semibold text-body mb-3">
          Komentar <span className="text-muted font-normal text-sm">({post.comments.length})</span>
        </h2>
        <div className="card p-5 space-y-5">
          <CommentForm postId={post.id} />
          {post.comments.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Belum ada komentar — sampaikan kata baik pertama.</p>
          ) : (
            <ul className="space-y-4">
              {post.comments.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <span className="size-7 shrink-0 rounded-full bg-gradient-to-br from-dusk-200 to-night-400 text-white grid place-items-center text-[11px] font-semibold" aria-hidden>
                    {c.user.anonName.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-medium text-body">{c.user.anonName}</span>
                      <time>{timeAgo(c.createdAt)}</time>
                    </div>
                    <p className="mt-1 text-sm text-body leading-relaxed whitespace-pre-line">{c.content}</p>
                    <div className="mt-1.5 flex gap-3">
                      {c.mine ? <DeleteContentButton commentId={c.id} /> : <ReportButton commentId={c.id} />}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
