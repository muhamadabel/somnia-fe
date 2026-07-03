"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--text)",
};

export function MoodScoreChart({
  data,
  height = 260,
}: {
  data: Array<{ label: string; score: number | null; count: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f6ac1" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#7f6ac1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} width={46} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: unknown) => [`${value}/100`, "Positivitas"]}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#7f6ac1"
          strokeWidth={2.5}
          fill="url(#scoreFill)"
          connectNulls
          dot={{ r: 2.5, fill: "#7f6ac1", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EmotionFrequencyChart({
  data,
}: {
  data: Array<{ name: string; count: number; color: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" width={86} tick={{ fontSize: 12, fill: "var(--text)" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v} mimpi`, "Terdeteksi di"]} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ToneDonut({ positive, negative, neutral }: { positive: number; negative: number; neutral: number }) {
  const data = [
    { name: "Positif", value: positive, color: "#34d399" },
    { name: "Negatif", value: negative, color: "#f87171" },
    { name: "Netral", value: neutral, color: "#a78bfa" },
  ].filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3} strokeWidth={0}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown, n: unknown) => [`${v} sinyal`, String(n)]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DreamCountChart({
  data,
}: {
  data: Array<{ label: string; count: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v}`, "Mimpi"]} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="count" fill="#9a8cd2" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
