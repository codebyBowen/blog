import { color as d3color } from "d3-color";

// Default categorical palette (works on light & dark).
export const PALETTE = [
  "#3b82f6",
  "#f97316",
  "#10b981",
  "#a855f7",
  "#f43f5e",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
];

/** A base color -> [base, lighter] gradient stop pair. */
export function gradient(base: string): [string, string] {
  const c = d3color(base) as { brighter: (k: number) => { formatHex: () => string } } | null;
  return [base, c ? c.brighter(0.7).formatHex() : base];
}

/** Pick a per-index color, allowing a per-datum override. */
export function colorAt(i: number, override?: string) {
  return override ?? PALETTE[i % PALETTE.length];
}
