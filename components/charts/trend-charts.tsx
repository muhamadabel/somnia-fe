"use client";

import {
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
  ComposedChart,
  Line,
  ReferenceLine,
} from "recharts";
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, CloudSun, Moon, Star, Wind } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--text)",
};

// Custom Y-Axis tick to render Smiley icons and Labels
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const val = payload.value;

  let Icon = Meh;
  let label = "Neutral";
  
  if (val === 100) { Icon = Smile; label = "Happy"; }
  else if (val === 75) { Icon = Smile; label = "Calm"; }
  else if (val === 50) { Icon = Meh; label = "Neutral"; }
  else if (val === 25) { Icon = Frown; label = "Sad"; }
  else if (val === 0) { Icon = Frown; label = "Down"; }
  else return null; // Only render at these specific intervals

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-75} y={-12} width={70} height={24}>
        <div className="flex items-center justify-end gap-1.5 h-full text-[#3b82f6]">
          <Icon className="size-4.5" />
          <span className="text-[10px] font-semibold">{label}</span>
        </div>
      </foreignObject>
    </g>
  );
};

// Custom X-Axis tick to render Weather icons and Days
const CustomXAxisTick = (props: any) => {
  const { x, y, payload, index } = props;
  
  // Deterministic weather icon picking based on index for visual effect
  const weatherIcons = [Sun, Cloud, CloudSun, CloudRain, Sun, Star, Moon, Wind];
  const WeatherIcon = weatherIcons[index % weatherIcons.length];

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-20} y={4} width={40} height={40}>
        <div className="flex flex-col items-center justify-center gap-1 text-[#3b82f6]">
          <WeatherIcon className="size-4.5" />
          <span className="text-[10px] font-bold text-midnight-harbor">{payload.value.substring(0, 3)}</span>
        </div>
      </foreignObject>
    </g>
  );
};

// Custom Dot for the Line Chart
const CustomLineDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy || payload.score === null) return null;
  
  let Icon = Meh;
  if (payload.score >= 75) Icon = Smile;
  else if (payload.score <= 25) Icon = Frown;

  return (
    <svg x={cx - 12} y={cy - 12} width={24} height={24} viewBox="0 0 24 24" fill="white" className="text-[#3b82f6] shadow-sm rounded-full bg-white">
      <circle cx="12" cy="12" r="11" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <Icon className="size-4" x="4" y="4" color="#3b82f6" strokeWidth={2.5} />
    </svg>
  );
};

export function MoodScoreChart({
  data,
  height = 360,
}: {
  data: Array<{ label: string; score: number | null; count: number }>;
  height?: number;
}) {
  // Map data to include the range for the bar chart (from 50 to score)
  const chartData = data.map(d => ({
    ...d,
    barRange: d.score !== null ? [50, d.score] : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        
        <XAxis 
          dataKey="label" 
          tickLine={false} 
          axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }} 
          tick={<CustomXAxisTick />} 
          interval="preserveStartEnd" 
          minTickGap={24} 
        />
        
        <YAxis 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]}
          tickLine={false} 
          axisLine={{ stroke: '#3b82f6', strokeWidth: 1.5 }} 
          width={80}
          tick={<CustomYAxisTick />}
        />
        
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: unknown, name: string) => {
            if (name === "barRange") return null;
            return [`${value}/100`, "Mood Score"];
          }}
          cursor={{ fill: "transparent" }}
        />
        
        <ReferenceLine y={50} stroke="#3b82f6" strokeWidth={1.5} />
        
        <Bar dataKey="barRange" radius={[6, 6, 6, 6]} barSize={16}>
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.score !== null && entry.score >= 50 ? "#7caef6" : "#2f64cf"} 
            />
          ))}
        </Bar>

        <Line
          type="monotone"
          dataKey="score"
          stroke="#3b82f6"
          strokeWidth={2}
          connectNulls
          dot={<CustomLineDot />}
          activeDot={{ r: 6, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
        />
      </ComposedChart>
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
