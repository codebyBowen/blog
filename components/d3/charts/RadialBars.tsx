"use client";

import { useId, useMemo } from "react";
import { scaleBand, scaleRadial, scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { arc as d3arc } from "d3-shape";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { gradient, colorAt } from "../lib/palette";

interface Datum {
  label: string;
  value: number;
  color?: string;
}
interface Options {
  data?: Datum[];
  unit?: string;
  valuePrefix?: string;
  center?: { title?: string; subtitle?: string };
  max?: number;
  sort?: boolean;
}

export default function RadialBars({ width, active, options = {} }: ChartProps) {
  const o = options as Options;
  const unit = o.unit ?? "";
  const prefix = o.valuePrefix ?? "";
  const raw = Array.isArray(o.data) ? o.data : [];
  const uid = useId().replace(/:/g, "");
  const p = useAnimatedProgress(active, 1400);

  const data = useMemo(
    () => (o.sort === false ? raw : [...raw].sort((a, b) => b.value - a.value)),
    [raw, o.sort]
  );

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        No <code className="mx-1">data</code> in the viz block.
      </div>
    );
  }

  const size = Math.max(280, Math.min(width, 560));
  const innerR = size * 0.15;
  const outerR = size * 0.4;
  const maxV = o.max ?? max(data, (d) => d.value)!;

  const x = scaleBand<string>()
    .domain(data.map((_, i) => String(i)))
    .range([0, 2 * Math.PI])
    .padding(0.32);
  const y = scaleRadial().domain([0, maxV]).range([innerR, outerR]);
  const arcGen = d3arc();
  const rings = scaleLinear()
    .domain([0, maxV])
    .ticks(5)
    .filter((v) => v > 0 && v <= maxV);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: size, margin: "0 auto", display: "block" }}
      role="img"
      aria-label="radial bar chart"
    >
      <defs>
        {data.map((d, i) => {
          const [c0, c1] = gradient(colorAt(i, d.color));
          return (
            <linearGradient
              key={i}
              id={`rb-${uid}-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={c0} />
              <stop offset="100%" stopColor={c1} />
            </linearGradient>
          );
        })}
        <filter id={`rb-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${size / 2},${size / 2})`}>
        {rings.map((r) => (
          <circle
            key={r}
            r={y(r)}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeDasharray="2 4"
          />
        ))}
        {rings.map((r) => (
          <text
            key={`t${r}`}
            y={-y(r)}
            dy="-2"
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500"
            fontSize={9}
          >
            {r}
            {unit}
          </text>
        ))}

        {data.map((d, i) => {
          const a0 = x(String(i))!;
          const a1 = a0 + x.bandwidth();
          const rOuter = innerR + (y(d.value) - innerR) * p;
          const dPath = arcGen({
            startAngle: a0,
            endAngle: a1,
            innerRadius: innerR,
            outerRadius: rOuter,
            padAngle: 0.02,
          })!;
          const mid = (a0 + a1) / 2;
          const lr = rOuter + 16;
          const lx = Math.sin(mid) * lr;
          const ly = -Math.cos(mid) * lr;
          const anchor = Math.sin(mid) >= -0.05 ? "start" : "end";
          return (
            <g key={i}>
              <path
                d={dPath}
                fill={`url(#rb-${uid}-${i})`}
                filter={`url(#rb-glow-${uid})`}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-slate-700 dark:fill-slate-200"
                fontSize={Math.max(10, size * 0.022)}
                fontWeight={600}
              >
                {d.label}{" "}
                <tspan className="fill-slate-400 dark:fill-slate-500">
                  {prefix}
                  {Math.round(d.value * p)}
                  {unit}
                </tspan>
              </text>
            </g>
          );
        })}

        {o.center?.title && (
          <text
            textAnchor="middle"
            className="fill-slate-900 dark:fill-white"
            fontSize={Math.max(11, size * 0.026)}
            fontWeight={700}
            dy={-3}
          >
            {o.center.title}
          </text>
        )}
        {o.center?.subtitle && (
          <text
            textAnchor="middle"
            className="fill-slate-400"
            fontSize={Math.max(8, size * 0.018)}
            dy={Math.max(10, size * 0.03)}
          >
            {o.center.subtitle}
          </text>
        )}
      </g>
    </svg>
  );
}
