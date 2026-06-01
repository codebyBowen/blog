"use client";

import { useId } from "react";
import { scalePoint, scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { area as d3area, line as d3line, curveMonotoneX } from "d3-shape";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { colorAt } from "../lib/palette";

interface Series {
  key: string;
  label: string;
  color?: string;
}
type Row = Record<string, string | number>;
interface Options {
  data?: Row[];
  x?: string;
  series?: Series[];
  yTickCount?: number;
}

export default function AreaTrend({ width, active, options = {} }: ChartProps) {
  const o = options as Options;
  const rows = Array.isArray(o.data) ? o.data : [];
  const xKey = o.x ?? "x";
  const series = (o.series ?? []).map((s, i) => ({
    ...s,
    color: colorAt(i, s.color),
  }));
  const uid = useId().replace(/:/g, "");
  const p = useAnimatedProgress(active, 1500);

  if (!rows.length || !series.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Provide <code className="mx-1">data</code>,{" "}
        <code className="mx-1">series</code> and <code className="mx-1">x</code>.
      </div>
    );
  }

  const w = Math.max(300, Math.min(width, 720));
  const h = Math.round(w * 0.56);
  const m = { top: 28, right: 56, bottom: 36, left: 40 };
  const iw = w - m.left - m.right;
  const ih = h - m.top - m.bottom;

  const x = scalePoint<string>()
    .domain(rows.map((d) => String(d[xKey])))
    .range([0, iw]);
  const yMax =
    max(rows, (d) => max(series, (s) => Number(d[s.key])) ?? 0)! * 1.12;
  const y = scaleLinear().domain([0, yMax]).range([ih, 0]).nice();
  const ticks = y.ticks(o.yTickCount ?? 4);

  const mkArea = (key: string) =>
    d3area<Row>()
      .x((d) => x(String(d[xKey]))!)
      .y0(ih)
      .y1((d) => y(Number(d[key])))
      .curve(curveMonotoneX)(rows)!;
  const mkLine = (key: string) =>
    d3line<Row>()
      .x((d) => x(String(d[xKey]))!)
      .y((d) => y(Number(d[key])))
      .curve(curveMonotoneX)(rows)!;

  const last = rows[rows.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="area trend chart"
    >
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`at-${uid}-${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
        <filter id={`at-glow-${uid}`}>
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`at-clip-${uid}`}>
          <rect x="-2" y={-6} width={iw * p + 2} height={ih + 12} />
        </clipPath>
      </defs>

      <g transform={`translate(${m.left},${m.top})`}>
        {ticks.map((t) => (
          <g key={t} transform={`translate(0,${y(t)})`}>
            <line
              x1={0}
              x2={iw}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeDasharray="2 4"
            />
            <text
              x={-8}
              dy="0.32em"
              textAnchor="end"
              className="fill-slate-400"
              fontSize={10}
            >
              {t}
            </text>
          </g>
        ))}

        <g clipPath={`url(#at-clip-${uid})`}>
          {series.map((s, i) => (
            <path key={i} d={mkArea(s.key)} fill={`url(#at-${uid}-${i})`} />
          ))}
          {series.map((s, i) => (
            <path
              key={i}
              d={mkLine(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              filter={`url(#at-glow-${uid})`}
            />
          ))}
        </g>

        {/* end-of-line value + dot per series */}
        {series.map((s, i) => {
          const reveal = Math.max(0, Math.min(1, (p - 0.6) * 3));
          return (
            <g key={i} opacity={reveal}>
              <circle
                cx={x(String(last[xKey]))}
                cy={y(Number(last[s.key]))}
                r={4}
                fill={s.color}
                className="stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              <text
                x={x(String(last[xKey]))! + 8}
                y={y(Number(last[s.key]))}
                dy="0.32em"
                className="fill-slate-700 dark:fill-slate-200"
                fontSize={11}
                fontWeight={700}
              >
                {last[s.key]}
              </text>
            </g>
          );
        })}

        {rows.map((d, i) => (
          <text
            key={i}
            x={x(String(d[xKey]))}
            y={ih + 20}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400"
            fontSize={10}
          >
            {d[xKey]}
          </text>
        ))}

        <g transform="translate(0,-12)">
          {series.map((s, i) => (
            <g key={i} transform={`translate(${i * 130},0)`}>
              <circle cx={6} cy={0} r={4} fill={s.color} />
              <text
                x={16}
                y={0}
                dy="0.32em"
                className="fill-slate-600 dark:fill-slate-300"
                fontSize={10}
              >
                {s.label}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
