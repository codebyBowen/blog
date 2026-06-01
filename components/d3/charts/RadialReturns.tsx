"use client";

import { useMemo } from "react";
import { scaleBand, scaleRadial } from "d3-scale";
import { max } from "d3-array";
import { arc as d3arc } from "d3-shape";
import { YTD_RETURNS, COMPANY_COLOR } from "../data/storage2026";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { pct } from "../lib/format";

export default function RadialReturns({ width, active }: ChartProps) {
  const size = Math.max(280, Math.min(width, 560));
  const innerR = size * 0.15;
  const outerR = size * 0.40;
  const p = useAnimatedProgress(active, 1400);

  const data = useMemo(
    () => [...YTD_RETURNS].sort((a, b) => b.ytd - a.ytd),
    []
  );
  const maxV = max(data, (d) => d.ytd)!;

  const x = scaleBand<string>()
    .domain(data.map((d) => d.ticker))
    .range([0, 2 * Math.PI])
    .padding(0.32);
  const y = scaleRadial().domain([0, maxV]).range([innerR, outerR]);
  const arcGen = d3arc();
  const rings = [100, 200, 300, 400, 500].filter((v) => v <= maxV);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: size, margin: "0 auto", display: "block" }}
      role="img"
      aria-label="2026 year-to-date share-price returns, radial bar chart"
    >
      <defs>
        {data.map((d) => {
          const [c0, c1] = COMPANY_COLOR[d.name] ?? ["#64748b", "#94a3b8"];
          return (
            <linearGradient
              key={d.ticker}
              id={`grad-${d.ticker}`}
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
        <filter id="rr-glow" x="-50%" y="-50%" width="200%" height="200%">
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
            {r}%
          </text>
        ))}

        {data.map((d) => {
          const a0 = x(d.ticker)!;
          const a1 = a0 + x.bandwidth();
          const rOuter = innerR + (y(d.ytd) - innerR) * p;
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
            <g key={d.ticker}>
              <path
                d={dPath}
                fill={`url(#grad-${d.ticker})`}
                filter="url(#rr-glow)"
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
                {d.name}{" "}
                <tspan className="fill-slate-400 dark:fill-slate-500">
                  {pct(Math.round(d.ytd * p))}
                </tspan>
              </text>
            </g>
          );
        })}

        <text
          textAnchor="middle"
          className="fill-slate-900 dark:fill-white"
          fontSize={Math.max(11, size * 0.026)}
          fontWeight={700}
          dy={-3}
        >
          YTD 2026
        </text>
        <text
          textAnchor="middle"
          className="fill-slate-400"
          fontSize={Math.max(8, size * 0.018)}
          dy={Math.max(10, size * 0.03)}
        >
          share price
        </text>
      </g>
    </svg>
  );
}
