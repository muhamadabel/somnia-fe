"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/client";
import { useMutation } from "@/lib/use-mutation";
import { cn, timeAgo } from "@/lib/utils";
import { MessagesSquare, MoonStar, Plus, SendHorizontal, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";

interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}
interface Message {
  id: string;
  role: string;
  content: string;
}
interface FullConversation extends ConversationSummary {
  messages: Message[];
}

/** Typewriter renderer — gives streaming feel regardless of provider. */
function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= text.length) {
      onDone();
      return;
    }
    const step = Math.max(2, Math.round(text.length / 120));
    const t = setTimeout(() => setShown((s) => Math.min(text.length, s + step)), 16);
    return () => clearTimeout(t);
  }, [shown, text, onDone]);
  return <>{text.slice(0, shown)}</>;
}

export function CompanionChat({
  initialConversations,
  aiMode,
  memoryEnabled,
}: {
  initialConversations: ConversationSummary[];
  aiMode: { id: string; label: string };
  memoryEnabled: boolean;
}) {
  const toast = useToast();
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stopAnimating = useCallback(() => setAnimatingId(null), []);

  useEffect(() => {
    api<string[]>("/api/companion/suggestions")
      .then(({ data }) => setSuggestions(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, animatingId]);

  async function openConversation(id: string) {
    setActiveId(id);
    setMessages([]);
    setAnimatingId(null);
    try {
      const { data } = await api<FullConversation>(`/api/conversations/${id}`);
      setMessages(data.messages);
    } catch {
      toast("error", "Gagal memuat percakapan itu.");
      setActiveId(null);
    }
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    const optimistic: Message = { id: `tmp-${Date.now()}`, role: "user", content };
    setMessages((m) => [...m, optimistic]);

    try {
      if (!activeId) {
        const { data } = await api<FullConversation>("/api/conversations", { method: "POST", json: { content } });
        setActiveId(data.id);
        setMessages(data.messages);
        setConversations((c) => [{ id: data.id, title: data.title, updatedAt: new Date().toISOString() }, ...c]);
        const last = data.messages[data.messages.length - 1];
        if (last?.role === "assistant") setAnimatingId(last.id);
      } else {
        const { data } = await api<{ userMessage: Message; assistantMessage: Message }>(
          `/api/conversations/${activeId}/messages`,
          { method: "POST", json: { content } }
        );
        setMessages((m) => [...m.filter((x) => x.id !== optimistic.id), data.userMessage, data.assistantMessage]);
        setAnimatingId(data.assistantMessage.id);
        setConversations((c) => {
          const cur = c.find((x) => x.id === activeId);
          if (!cur) return c;
          return [{ ...cur, updatedAt: new Date().toISOString() }, ...c.filter((x) => x.id !== activeId)];
        });
      }
    } catch (err) {
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      setInput(content);
      toast("error", err instanceof ApiError ? err.message : "Teman AI sedang tidak tersedia — jurnalmu tetap berfungsi normal.");
    } finally {
      setSending(false);
    }
  }

  const { mutate: doRemoveConversation } = useMutation(
    (id: string) => api(`/api/conversations/${id}`, { method: "DELETE" }),
    {
      successMessage: "Percakapan dihapus.",
      errorMessage: "Gagal menghapus.",
    }
  );

  function removeConversation(id: string) {
    setConversations((c) => c.filter((x) => x.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
    doRemoveConversation(id).catch(() => {});
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:h-[calc(100vh-7.5rem)]">
      {/* ── Conversation list ── */}
      <aside className="lg:w-72 shrink-0 card p-3 flex flex-col max-h-56 lg:max-h-none">
        <Button
          variant="secondary"
          size="sm"
          className="w-full mb-2"
          onClick={() => {
            setActiveId(null);
            setMessages([]);
            setAnimatingId(null);
          }}
        >
          <Plus className="size-4" /> Percakapan baru
        </Button>
        <div className="overflow-y-auto flex-1 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-muted text-center py-6 px-3">
              Belum ada percakapan — ajukan pertanyaan pertamamu.
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-1 rounded-xl px-3 py-2 cursor-pointer transition-colors",
                activeId === c.id ? "bg-night-600 text-white" : "hover:bg-(--surface-2) text-body"
              )}
              onClick={() => openConversation(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openConversation(c.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className={cn("text-[11px]", activeId === c.id ? "text-white/70" : "text-muted")}>
                  {timeAgo(c.updatedAt)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeConversation(c.id);
                }}
                aria-label="Hapus percakapan"
                className={cn(
                  "p-1.5 rounded-lg cursor-pointer transition-opacity text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20",
                  activeId === c.id && "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Chat area ── */}
      <section className="card flex-1 flex flex-col min-h-[60vh]">
        <header className="flex items-center justify-between border-b border-base px-5 py-3.5">
          <div className="flex items-center gap-2">
            <MessagesSquare className="size-5 text-night-500" />
            <h1 className="font-semibold text-body">Teman Mimpi</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.length === 0 && !sending && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <span className="rounded-full surface-2 p-4 text-night-400 mb-4">
                <MoonStar className="size-7" />
              </span>
              <h2 className="font-semibold text-body">Tanya tentang mimpimu</h2>
              <p className="mt-1.5 text-sm text-muted max-w-sm">
                Berbeda dari chatbot biasa, teman ini membaca jurnalmu — pola, simbol, dan tren emosi —
                sebelum menjawab.
              </p>
              {!memoryEnabled && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 max-w-sm">
                  Memori AI nonaktif di <Link href="/settings" className="underline">Pengaturan → Privasi</Link>, jadi
                  jawaban akan tetap umum.
                </p>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-md">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs surface border-base rounded-full px-3.5 py-2 text-muted hover:text-body hover:border-night-400 transition-colors cursor-pointer"
                  >
                    <Sparkles className="size-3 inline mr-1 text-night-400" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user"
                    ? "bg-night-600 text-white rounded-br-md"
                    : "surface-2 text-body rounded-bl-md"
                )}
              >
                {m.role === "assistant" && m.id === animatingId ? (
                  <TypewriterText text={m.content} onDone={stopAnimating} />
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start" aria-label="Teman AI sedang berpikir">
              <div className="surface-2 rounded-2xl rounded-bl-md px-4 py-3.5 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full bg-night-400 animate-pulse-soft"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-base p-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya tentang mimpi, pola, simbol…"
            aria-label="Pesan untuk teman mimpi"
            maxLength={2000}
            className="input-base flex-1"
            disabled={sending}
          />
          <Button type="submit" className="rounded-full" disabled={!input.trim() || sending} aria-label="Kirim pesan">
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </section>
    </div>
  );
}
