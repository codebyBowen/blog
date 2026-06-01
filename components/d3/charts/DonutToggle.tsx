"use client";

import { useId, useState } from "react";
import { pie as d3pie, arc as d3arc } from "d3-shape";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { gradient, colorAt } from "../lib/palette";
import { lerp } from "../lib/format";

interface Slice {
  name: string;
  value: number;
  color?: string;
}
interface Mode {
  id?: string;
  label: string;
  center?: { title?: string; subtitle?: string };
  data: Slice[];
}
interface Options {
  modes?: Mode[];
}

export default function DonutToggle({ width, active, options = {} }: ChartProps) {
  const [idx, setIdx] = useState(0);
  const [from, setFrom] = useState<number[]>([]);
  const uid = useId().replace(/:/g, "");
  const p = useAnimatedProgress(active, 1100, idx);

  const o = options as Options;
  const modes = Array.isArray(o.modes) ? o.modes : [];

  if (!modes.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Provide <code className="mx-1">modes</code> with data.
      </div>
    );
  }

  const names: string[] = [];
  modes.forEach((mm) =>
    mm.data?.forEach((s) => {
      if (!names.includes(s.name)) names.push(s.name);
    })
  );
  const valuesOf = (mi: number) =>
    names.map((n) => modes[mi]?.data.find((s) => s.name === n)?.value ?? 0);
  const colorOf = (n: string, i: number) => {
    for (const mm of modes) {
      const f = mm.data.find((s) => s.name === n);
      if (f?.color) return f.color;
    }
    return colorAt(i);
  };

  const select = (i: number) => {
    setFrom(valuesOf(idx));
    setIdx(i);
  };

  const to = valuesOf(idx);
  const vals = to.map((t, k) => lerp(from[k] ?? 0, t, p));
  const mode = modes[idx];

  const size = Math.max(280, Math.min(width, 460));
  const R = size * 0.4;
  const r = size * 0.24;
  const arcGen = d3arc<any>()
    .innerRadius(r)
    .outerRadius(R)
    .cornerRadius(5)
    .padAngle(0.018);
  const labelArc = d3arc<any>()
    .innerRadius((R + r) / 2)
    .outerRadius((R + r) / 2);
  const arcs = d3pie<number>()
    .sort(null)
    .value((v) => v)(vals);

  return (
    <div
      className="flex flex-col items-center transition-opacity duration-700"
      style={{ opacity: active ? 1 : 0 }}
    >
      {modes.length > 1 && (
        <div className="mb-4 inline-flex rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
          {modes.map((mm, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                idx === i
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {mm.label}
            </button>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size, display: "block" }}
        role="img"
        aria-label="donut share chart"
      >
        <defs>
          {names.map((n, i) => {
            const [c0, c1] = gradient(colorOf(n, i));
            return (
              <linearGradient key={i} id={`dt-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={c0} />
                <stop offset="100%" stopColor={c1} />
              </linearGradient>
            );
          })}
          <filter id={`dt-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${size / 2},${size / 2})`}>
          {arcs.map((s, i) => {
            const [cx, cy] = labelArc.centroid(s);
            const v = Math.round(vals[i]);
            return (
              <g key={i}>
                <path
                  d={arcGen(s)!}
                  fill={`url(#dt-${uid}-${i})`}
                  filter={`url(#dt-glow-${uid})`}
                />
                {v >= 6 && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white"
                    fontSize={Math.max(11, size * 0.032)}
                    fontWeight={700}
                  >
                    {v}%
                  </text>
                )}
              </g>
            );
          })}

          {mode.center?.title && (
            <text
              textAnchor="middle"
              className="fill-slate-900 dark:fill-white"
              fontSize={Math.max(18, size * 0.06)}
              fontWeight={800}
              dy={-2}
            >
              {mode.center.title}
            </text>
          )}
          {mode.center?.subtitle && (
            <text
              textAnchor="middle"
              className="fill-slate-400"
              fontSize={Math.max(9, size * 0.024)}
              dy={Math.max(14, size * 0.045)}
            >
              {mode.center.subtitle}
            </text>
          )}
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
        {names.map((n, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: colorOf(n, i) }}
            />
            {n} · {Math.round(vals[i])}%
          </span>
        ))}
      </div>
    </div>
  );
}
