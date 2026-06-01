"use client";

import { useMemo, useState } from "react";
import { pie as d3pie, arc as d3arc } from "d3-shape";
import { HBM_SHARE } from "../data/storage2026";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { lerp } from "../lib/format";

type Mode = "hbm3e" | "hbm4";
const ORDER = ["SK hynix", "Samsung", "Micron"] as const;
const COLORS: Record<string, [string, string]> = {
  "SK hynix": ["#f97316", "#fdba74"],
  Samsung: ["#3b82f6", "#93c5fd"],
  Micron: ["#10b981", "#6ee7b7"],
};
const TITLES: Record<Mode, [string, string]> = {
  hbm3e: ["HBM3E", "Q2 2026 share"],
  hbm4: ["HBM4", "Rubin allocation"],
};

function valuesFor(mode: Mode) {
  const src = HBM_SHARE[mode];
  return ORDER.map((name) => src.find((d) => d.name === name)?.value ?? 0);
}

export default function HbmShareDonut({ width, active }: ChartProps) {
  const size = Math.max(280, Math.min(width, 460));
  const R = size * 0.4;
  const r = size * 0.24;
  const [mode, setMode] = useState<Mode>("hbm3e");
  const p = useAnimatedProgress(active, 1100, mode);

  const target = useMemo(() => valuesFor(mode), [mode]);
  const prev = useMemo(
    () => valuesFor(mode === "hbm3e" ? "hbm4" : "hbm3e"),
    [mode]
  );
  const vals = target.map((t, i) => lerp(prev[i], t, p));

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

  const [bigLabel, subLabel] = TITLES[mode];

  return (
    <div
      className="flex flex-col items-center transition-opacity duration-700"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="mb-4 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-sm">
        {(["hbm3e", "hbm4"] as Mode[]).map((mItem) => (
          <button
            key={mItem}
            onClick={() => setMode(mItem)}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              mode === mItem
                ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {mItem === "hbm3e" ? "HBM3E · today" : "HBM4 · Rubin"}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size, display: "block" }}
        role="img"
        aria-label="HBM market share, current generation versus HBM4 allocation"
      >
        <defs>
          {ORDER.map((name) => {
            const [c0, c1] = COLORS[name];
            return (
              <linearGradient
                key={name}
                id={`hbm-${name.replace(/\s/g, "")}`}
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
          <filter id="hbm-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${size / 2},${size / 2})`}>
          {arcs.map((s, i) => {
            const name = ORDER[i];
            const [cx, cy] = labelArc.centroid(s);
            const v = Math.round(vals[i]);
            return (
              <g key={name}>
                <path
                  d={arcGen(s)!}
                  fill={`url(#hbm-${name.replace(/\s/g, "")})`}
                  filter="url(#hbm-glow)"
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

          <text
            textAnchor="middle"
            className="fill-slate-900 dark:fill-white"
            fontSize={Math.max(18, size * 0.06)}
            fontWeight={800}
            dy={-2}
          >
            {bigLabel}
          </text>
          <text
            textAnchor="middle"
            className="fill-slate-400"
            fontSize={Math.max(9, size * 0.024)}
            dy={Math.max(14, size * 0.045)}
          >
            {subLabel}
          </text>
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
        {ORDER.map((name, i) => (
          <span
            key={name}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS[name][0] }}
            />
            {name} · {Math.round(vals[i])}%
          </span>
        ))}
      </div>
    </div>
  );
}
