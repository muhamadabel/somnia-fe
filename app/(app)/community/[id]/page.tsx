import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, EmotionDot } from "@/components/ui/badge";
import { ReactionBar } from "@/components/community/reaction-bar";
import {
  CommentForm,
  DeleteContentButton,
  ReportButton,
} from "@/components/community/post-interactions";
import { safeParseJson, timeAgo } from "@/lib/utils";
import { emotionLabel } from "@/lib/constants";
import { symbolLabel } from "@/lib/ai/lexicon";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Mimpi Dibagikan" };

interface PostMeta {
  emotions: Array<{ name: string; color: string }>;
  symbols: string[];
  mood: string | null;
}

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getCurrentUser())!;
  const { id } = await params;

  const post = await db.communityPost.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: { select: { anonName: true } },
      comments: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { anonName: true } } },
      },
      reactions: true,
    },
  });
  if (!post) notFound();

  const meta = safeParseJson<PostMeta>(post.meta, { emotions: [], symbols: [], mood: null });
  const counts: Record<string, number> = {};
  for (const r of post.reactions) counts[r.type] = (counts[r.type] ?? 0) + 1;
  const mine = post.reactions.filter((r) => r.userId === user.id).map((r) => r.type);
  const isOwner = post.userId === user.id;

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
                {post.user.anonName} {isOwner && <Badge className="ml-1">kamu</Badge>}
              </p>
              <time>{timeAgo(post.createdAt)}</time>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isOwner ? (
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
          <ReactionBar postId={post.id} counts={counts} mine={mine} />
        </div>
      </article>

      {/* ── Comments ── */}
      <section className="mt-6">
        <h2 className="font-semibold text-body mb-3">
          Komentar <span className="text-muted font-normal text-sm">({post.comments.length})</span>
        </h2>
        <div className="card p-5 space-y-5">
          <CommentForm postId={post.id} />
          {post.comments.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">
              Belum ada komentar — sampaikan kata baik pertama.
            </p>
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
                      {c.userId === user.id || user.role === "admin" ? (
                        <DeleteContentButton commentId={c.id} />
                      ) : (
                        <ReportButton commentId={c.id} />
                      )}
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
