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
import {
  Laugh,
  Smile,
  Meh,
  Frown,
  Angry,
  Sun,
  Cloud,
  CloudRain,
  Moon,
  Star
} from "lucide-react";

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
  let animationClass = "";
  
  if (val === 100) { Icon = Laugh; label = "Happy"; animationClass = "animate-bounce-soft hover:scale-110 transition-transform"; }
  else if (val === 75) { Icon = Smile; label = "Calm"; animationClass = "animate-bounce-soft hover:scale-110 transition-transform"; }
  else if (val === 50) { Icon = Meh; label = "Neutral"; animationClass = "animate-pulse-soft hover:scale-110 transition-transform"; }
  else if (val === 25) { Icon = Frown; label = "Sad"; animationClass = "animate-wiggle hover:scale-110 transition-transform"; }
  else if (val === 0) { Icon = Angry; label = "Down"; animationClass = "animate-wiggle hover:scale-110 transition-transform"; }
  else return null; // Only render at these specific intervals

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-85} y={-12} width={80} height={24}>
        <div className="flex items-center justify-end gap-2 h-full text-[#3b82f6]">
          <div className={`${animationClass} hidden sm:block duration-500`}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <span className="text-[11px] font-semibold">{label}</span>
        </div>
      </foreignObject>
    </g>
  );
};

// Custom X-Axis tick to render Weather icons and Days
const CustomXAxisTick = (props: any) => {
  const { x, y, payload, index } = props;
  
  // Deterministic weather icon picking based on index for visual effect
  const weatherIcons = [Sun, Cloud, CloudRain, Sun, Star, Moon, Cloud];
  const WeatherIcon = weatherIcons[index % weatherIcons.length];

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-20} y={6} width={40} height={40}>
        <div className="flex flex-col items-center justify-center gap-1 h-full text-[#3b82f6]">
          <div className="hidden sm:block animate-pulse-soft" style={{ animationDelay: `${index * 100}ms` }}>
            <WeatherIcon size={18} strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold text-body">{payload.value.substring(0, 3)}</span>
        </div>
      </foreignObject>
    </g>
  );
};

// Custom Dot for the Line Chart
const CustomLineDot = (props: any) => {
  const { cx, cy, payload, index } = props;
  if (!cx || !cy || payload.score === null) return null;
  
  let Icon = Meh;
  if (payload.score >= 87.5) Icon = Laugh;
  else if (payload.score >= 62.5) Icon = Smile;
  else if (payload.score >= 37.5) Icon = Meh;
  else if (payload.score >= 12.5) Icon = Frown;
  else Icon = Angry;

  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Hide the complex emoji dot on mobile, show on desktop (sm:block) */}
      <g className="hidden sm:block animate-bounce-soft" style={{ animationDelay: `${index * 150}ms` }}>
        <circle cx="0" cy="0" r="14" fill="var(--surface)" stroke="#3b82f6" strokeWidth="1.5" />
        <foreignObject x={-10} y={-10} width={20} height={20}>
          <div className="flex items-center justify-center w-full h-full text-[#3b82f6] hover:scale-110 transition-transform">
            <Icon size={18} strokeWidth={2} />
          </div>
        </foreignObject>
      </g>
      <circle cx="0" cy="0" r="5" fill="#3b82f6" stroke="var(--surface)" strokeWidth="1.5" className="sm:hidden" />
    </g>
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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        
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
        
        <Bar dataKey="barRange" radius={[8, 8, 8, 8]} barSize={24}>
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
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`Terdeteksi di : ${v} mimpi`, ""]} labelStyle={{ fontWeight: "bold", color: "var(--text)", marginBottom: 4 }} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={20}>
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
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4} stroke="var(--surface)" strokeWidth={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v} sinyal`, ""]} />
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
        <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v} mimpi`, ""]} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="count" fill="#a78bfa" radius={[12, 12, 12, 12]} barSize={8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
