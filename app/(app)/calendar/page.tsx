"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { EmotionDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/input";
import { DreamRow, type DreamCardData } from "@/components/dream/dream-card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EMOTIONS, emotionLabel } from "@/lib/constants";
import { useApi } from "@/lib/use-api";
import { ChevronLeft, ChevronRight, MoonStar } from "lucide-react";

function monthLabel(y: number, m: number) {
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function topEmotion(d: DreamCardData) {
  return [...d.emotions].sort((a, b) => b.intensity - a.intensity)[0]?.emotion;
}
function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export default function CalendarPage() {
  const sp = useSearchParams();

  const now = new Date();
  const [yStr, mStr] = (sp.get("month") ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`).split("-");
  const year = parseInt(yStr, 10) || now.getFullYear();
  const month = Math.min(12, Math.max(1, parseInt(mStr, 10) || now.getMonth() + 1));
  const emotionFilter = sp.get("emotion") ?? "";
  const view = sp.get("view") === "week" ? "week" : "month";
  const selectedDay = sp.get("day") ?? undefined;

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const rangeStart = view === "week" ? weekStart : monthStart;
  const rangeEnd = view === "week" ? new Date() : monthEnd;

  const fromStr = new Date(rangeStart.getTime() - rangeStart.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const toStr = new Date(rangeEnd.getTime() - rangeEnd.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const query = new URLSearchParams({ from: fromStr, to: toStr, limit: "100" });
  if (emotionFilter) query.set("emotion", emotionFilter);

  const { data, loading } = useApi<DreamCardData[]>(`/api/dreams?${query}`, [query.toString()]);
  const dreams = data ?? [];

  // Emotion legend: only the emotions that actually occur in this range.
  const legend = new Map<string, string>();
  for (const d of dreams) {
    const top = topEmotion(d);
    if (top && !legend.has(top.name)) legend.set(top.name, top.color);
  }

  const byDay = new Map<string, DreamCardData[]>();
  for (const d of dreams) {
    const key = dayKey(String(d.dreamDate));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(d);
  }

  const prev = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);
  const qp = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      month: `${year}-${String(month).padStart(2, "0")}`,
      emotion: emotionFilter || undefined,
      view: view === "week" ? "week" : undefined,
      day: selectedDay,
      ...patch,
    };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/calendar${s ? `?${s}` : ""}`;
  };

  // month grid cells (Monday-first)
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();
  const cells: Array<{ day: number; key: string } | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(Date.UTC(year, month - 1, i + 1, 12));
      return { day: i + 1, key: d.toISOString().slice(0, 10) };
    }),
  ];

  const todayKey = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dayDreams = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  if (loading) return <PageSkeleton />;

  return (
    <>
      <PageHeader title="Kalender Mimpi" subtitle="Riwayat mimpimu, malam demi malam." />

      {/* controls */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Month nav / week label */}
        <div className="flex items-center gap-2">
          {view === "month" && (
            <>
              <Link
                href={qp({ month: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`, day: undefined })}
                aria-label="Bulan sebelumnya"
                className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
              >
                <ChevronLeft className="size-4" />
              </Link>
              <span className="font-semibold text-body min-w-32 text-center text-sm sm:text-base">{monthLabel(year, month)}</span>
              <Link
                href={qp({ month: `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`, day: undefined })}
                aria-label="Bulan berikutnya"
                className="p-2 rounded-lg text-muted hover:text-body hover:bg-(--surface-2)"
              >
                <ChevronRight className="size-4" />
              </Link>
            </>
          )}
          {view === "week" && <span className="font-semibold text-body text-sm">7 hari terakhir</span>}
        </div>

        {/* View toggle + emotion filter */}
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            ariaLabel="Tampilan kalender"
            value={view}
            options={[
              { value: "month", label: "Bulan", href: qp({ view: undefined, day: undefined }) },
              { value: "week", label: "Minggu", href: qp({ view: "week", day: undefined }) },
            ]}
          />
          <form method="GET" className="flex items-center gap-2 flex-1 sm:flex-none">
            <input type="hidden" name="month" value={`${year}-${String(month).padStart(2, "0")}`} />
            {view === "week" && <input type="hidden" name="view" value="week" />}
            <Select
              name="emotion"
              defaultValue={emotionFilter}
              aria-label="Filter emosi"
              className="flex-1 sm:flex-none !w-auto sm:!w-40 !py-1.5 text-sm"
            >
              <option value="">Semua emosi</option>
              {EMOTIONS.map((e) => (
                <option key={e.name} value={e.name}>{e.label}</option>
              ))}
            </Select>
            <button type="submit" className="text-sm font-medium bg-night-600 hover:bg-night-700 text-white rounded-full px-3.5 py-1.5 cursor-pointer shrink-0">
              Filter
            </button>
          </form>
        </div>
      </div>

      {view === "month" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Month grid ── */}
          <div className="card p-4 sm:p-5 lg:col-span-2">
            <div className="grid grid-cols-7 text-center text-xs font-medium text-muted mb-2">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                <span key={d} className="py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((cell, i) =>
                cell === null ? (
                  <span key={`x${i}`} />
                ) : (
                  <Link
                    key={cell.key}
                    href={qp({ day: cell.key })}
                    aria-label={`${cell.day} ${monthLabel(year, month)} — ${byDay.get(cell.key)?.length ?? 0} mimpi`}
                    className={`relative aspect-square rounded-xl p-1.5 text-sm flex flex-col items-center justify-start transition-colors ${
                      selectedDay === cell.key
                        ? "bg-night-600 text-white"
                        : cell.key === todayKey
                          ? "surface-2 text-body font-semibold ring-1 ring-night-400"
                          : byDay.has(cell.key)
                            ? "surface-2 text-body hover:bg-night-100 dark:hover:bg-night-800"
                            : "text-muted hover:bg-(--surface-2)"
                    }`}
                  >
                    <span>{cell.day}</span>
                    <span className="mt-auto mb-0.5 flex gap-0.5 flex-wrap justify-center">
                      {(byDay.get(cell.key) ?? []).slice(0, 3).map((d) => {
                        const top = d.emotions[0]?.emotion;
                        return (
                          <EmotionDot
                            key={d.id}
                            color={selectedDay === cell.key ? "#ffffff" : (top?.color ?? "#9a8cd2")}
                            className="size-1.5"
                          />
                        );
                      })}
                    </span>
                  </Link>
                )
              )}
            </div>
            {legend.size > 0 && (
              <div className="mt-4 pt-3 border-t border-base flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
                {[...legend].map(([name, color]) => (
                  <span key={name} className="flex items-center gap-1.5">
                    <EmotionDot color={color} /> {emotionLabel(name)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Day preview ── */}
          <div>
            <h2 className="font-semibold text-body mb-3">
              {selectedDay
                ? new Date(selectedDay + "T12:00:00").toLocaleDateString("id-ID", { weekday: "long", month: "long", day: "numeric" })
                : "Pilih tanggal"}
            </h2>
            {!selectedDay ? (
              <p className="text-sm text-muted">Ketuk tanggal untuk melihat mimpi dari malam itu.</p>
            ) : dayDreams.length === 0 ? (
              <p className="text-sm text-muted">Tidak ada mimpi tercatat di malam ini.</p>
            ) : (
              <div className="card p-2 space-y-0.5">
                {dayDreams.map((d) => (
                  <DreamRow key={d.id} dream={d} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Week view ── */
        <div className="space-y-3">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
            const list = byDay.get(key) ?? [];
            return (
              <div key={key} className="card p-4">
                <p className="text-sm font-semibold text-body flex items-center gap-2">
                  {d.toLocaleDateString("id-ID", { weekday: "long", month: "short", day: "numeric" })}
                  {key === todayKey && (
                    <span className="rounded-full surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">Hari ini</span>
                  )}
                </p>
                {list.length === 0 ? (
                  <p className="mt-1 text-xs text-muted">Tidak ada mimpi tercatat.</p>
                ) : (
                  <div className="mt-1.5 grid gap-x-2 sm:grid-cols-2">
                    {list.map((dr) => (
                      <DreamRow key={dr.id} dream={dr} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {dreams.length === 0 && view === "month" && (
        <div className="mt-6">
          <EmptyState
            icon={<MoonStar className="size-8" />}
            title={emotionFilter ? `Tidak ada mimpi ${emotionLabel(emotionFilter).toLowerCase()} bulan ini` : "Tidak ada mimpi bulan ini"}
            message="Setiap malam adalah kesempatan baru — mimpi berikutnya bisa muncul di sini."
          />
        </div>
      )}
    </>
  );
}
