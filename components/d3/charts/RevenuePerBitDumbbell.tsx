"use client";

import { useId } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { REVENUE_PER_BIT } from "../data/storage2026";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { usd2, pct, lerp } from "../lib/format";

export default function RevenuePerBitDumbbell({ width, active }: ChartProps) {
  const w = Math.max(300, Math.min(width, 680));
  const m = { top: 16, right: 70, bottom: 34, left: 88 };
  const rowH = 66;
  const ih = REVENUE_PER_BIT.length * rowH;
  const h = ih + m.top + m.bottom;
  const iw = w - m.left - m.right;
  const p = useAnimatedProgress(active, 1300);
  const uid = useId().replace(/:/g, "");

  const xMax = max(REVENUE_PER_BIT, (d) => d.y2026)! * 1.15;
  const x = scaleLinear().domain([0, xMax]).range([0, iw]);
  const y = scaleBand<string>()
    .domain(REVENUE_PER_BIT.map((d) => d.name))
    .range([0, ih])
    .padding(0.5);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="Traditional DRAM revenue per bit, 2025 versus 2026"
    >
      <defs>
        <linearGradient id={`bar-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id={`g-${uid}`}>
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
            <line
              y1={0}
              y2={ih}
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <text
              y={ih + 16}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize={9}
            >
              {usd2(t)}
            </text>
          </g>
        ))}

        {REVENUE_PER_BIT.map((d) => {
          const cy = y(d.name)! + y.bandwidth() / 2;
          const x0 = x(d.y2025);
          const valCur = lerp(d.y2025, d.y2026, p);
          const x1 = x(valCur);
          return (
            <g key={d.name}>
              <text
                x={-12}
                y={cy}
                dy="0.32em"
                textAnchor="end"
                className="fill-slate-700 dark:fill-slate-200"
                fontSize={12}
                fontWeight={600}
              >
                {d.name}
              </text>
              <text
                x={x0}
                y={cy - 16}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize={9}
              >
                {usd2(d.y2025)} → {pct(d.changePct)}
              </text>
              <line
                x1={x0}
                x2={x1}
                y1={cy}
                y2={cy}
                stroke={`url(#bar-${uid})`}
                strokeWidth={9}
                strokeLinecap="round"
              />
              <circle
                cx={x0}
                cy={cy}
                r={6}
                className="fill-slate-400 dark:fill-slate-500 stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              <circle
                cx={x1}
                cy={cy}
                r={7}
                fill="#10b981"
                filter={`url(#g-${uid})`}
                className="stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              <text
                x={x1 + 12}
                y={cy}
                dy="0.32em"
                className="fill-emerald-600 dark:fill-emerald-400"
                fontSize={11}
                fontWeight={700}
              >
                {usd2(valCur)}
              </text>
            </g>
          );
        })}

        <g transform={`translate(0,${ih + 16})`}>
          <circle cx={iw - 150} cy={0} r={5} className="fill-slate-400" />
          <text
            x={iw - 140}
            y={0}
            dy="0.32em"
            className="fill-slate-500"
            fontSize={9}
          >
            2025
          </text>
          <circle cx={iw - 92} cy={0} r={5} fill="#10b981" />
          <text
            x={iw - 82}
            y={0}
            dy="0.32em"
            className="fill-slate-500"
            fontSize={9}
          >
            2026
          </text>
        </g>
      </g>
    </svg>
  );
}
