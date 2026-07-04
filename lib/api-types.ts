// Shared response shapes for the frontend (client-safe — no server imports).

export interface TrendData {
  range: number;
  daily: Array<{ date: string; label: string; positive: number; negative: number; count: number; score: number | null }>;
  frequency: Array<{ name: string; count: number; color: string; tone: string }>;
  dominant: { name: string; count: number; color: string } | null;
  positiveRatio: number | null;
  totalDreams: number;
  observation: string;
}

export interface ReportContent {
  stats: {
    dreamCount: number;
    analyzedCount: number;
    avgSleep: number | null;
    streak: number;
    positiveRatio: number | null;
  };
  emotions: Array<{ name: string; count: number; color: string; tone: string }>;
  symbols: Array<{ name: string; count: number }>;
  highlights: Array<{ id: string; title: string; date: string; dominantEmotion: string | null; intensity: number | null }>;
  observations: string[];
  reflection: string;
}

export interface ReportRow {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  content: string;
  provider: string;
  generatedAt: string;
}
