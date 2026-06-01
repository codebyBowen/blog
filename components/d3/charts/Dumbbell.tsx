"use client";

import { useId } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { usd2, lerp } from "../lib/format";

interface Datum {
  label: string;
  from: number;
  to: number;
  changePct?: number;
}
interface Options {
  data?: Datum[];
  format?: "usd" | "pct" | "plain";
  fromLabel?: string;
  toLabel?: string;
  color?: string;
}

export default function Dumbbell({ width, active, options = {} }: ChartProps) {
  const o = options as Options;
  const data = Array.isArray(o.data) ? o.data : [];
  const uid = useId().replace(/:/g, "");
  const p = useAnimatedProgress(active, 1300);
  const toColor = o.color ?? "#10b981";

  const fmt = (n: number) =>
    o.format === "usd"
      ? usd2(n)
      : o.format === "pct"
      ? `${Math.round(n)}%`
      : `${Math.round(n * 100) / 100}`;

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Provide <code className="mx-1">data</code> with from/to values.
      </div>
    );
  }

  const w = Math.max(300, Math.min(width, 680));
  const m = { top: 16, right: 70, bottom: 34, left: 92 };
  const rowH = 66;
  const ih = data.length * rowH;
  const h = ih + m.top + m.bottom;
  const iw = w - m.left - m.right;

  const xMax = max(data, (d) => Math.max(d.from, d.to))! * 1.15;
  const x = scaleLinear().domain([0, xMax]).range([0, iw]);
  const y = scaleBand<string>()
    .domain(data.map((_, i) => String(i)))
    .range([0, ih])
    .padding(0.5);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="dumbbell comparison chart"
    >
      <defs>
        <linearGradient id={`db-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
        <filter id={`db-glow-${uid}`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${m.left},${m.top})`}>
        {x.ticks(5).map((t) => (
          <g key={t} transform={`translate(${x(t)},0)`}>
            <line y1={0} y2={ih} className="stroke-slate-100 dark:stroke-slate-800" />
            <text
              y={ih + 16}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize={9}
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cy = y(String(i))! + y.bandwidth() / 2;
          const x0 = x(d.from);
          const valCur = lerp(d.from, d.to, p);
          const x1 = x(valCur);
          const sub =
            d.changePct !== undefined
              ? `${fmt(d.from)} → +${Math.round(d.changePct)}%`
              : `${fmt(d.from)} → ${fmt(d.to)}`;
          return (
            <g key={i}>
              <text
                x={-12}
                y={cy}
                dy="0.32em"
                textAnchor="end"
                className="fill-slate-700 dark:fill-slate-200"
                fontSize={12}
                fontWeight={600}
              >
                {d.label}
              </text>
              <text
                x={x0}
                y={cy - 16}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize={9}
              >
                {sub}
              </text>
              <line
                x1={x0}
                x2={x1}
                y1={cy}
                y2={cy}
                stroke={`url(#db-${uid})`}
                strokeWidth={9}
                strokeLinecap="round"
              />
              <circle
                cx={x0}
                cy={cy}
                r={6}
                className="fill-slate-400 stroke-white dark:fill-slate-500 dark:stroke-slate-900"
                strokeWidth={2}
              />
              <circle
                cx={x1}
                cy={cy}
                r={7}
                fill={toColor}
                filter={`url(#db-glow-${uid})`}
                className="stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              <text
                x={x1 + 12}
                y={cy}
                dy="0.32em"
                style={{ fill: toColor }}
                fontSize={11}
                fontWeight={700}
              >
                {fmt(valCur)}
              </text>
            </g>
          );
        })}

        {(o.fromLabel || o.toLabel) && (
          <g transform={`translate(0,${ih + 16})`}>
            <circle cx={iw - 150} cy={0} r={5} className="fill-slate-400" />
            <text x={iw - 140} y={0} dy="0.32em" className="fill-slate-500" fontSize={9}>
              {o.fromLabel ?? "from"}
            </text>
            <circle cx={iw - 92} cy={0} r={5} fill={toColor} />
            <text x={iw - 82} y={0} dy="0.32em" className="fill-slate-500" fontSize={9}>
              {o.toLabel ?? "to"}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
