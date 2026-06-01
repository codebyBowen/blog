"use client";

import { useId } from "react";
import { scalePoint, scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { area as d3area, line as d3line, curveMonotoneX } from "d3-shape";
import { PRICE_INDEX, PricePoint } from "../data/storage2026";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";

export default function PriceIndexArea({ width, active }: ChartProps) {
  const w = Math.max(300, Math.min(width, 720));
  const h = Math.round(w * 0.56);
  const m = { top: 28, right: 24, bottom: 36, left: 40 };
  const iw = w - m.left - m.right;
  const ih = h - m.top - m.bottom;
  const p = useAnimatedProgress(active, 1500);
  const uid = useId().replace(/:/g, "");

  const x = scalePoint<string>()
    .domain(PRICE_INDEX.map((d) => d.quarter))
    .range([0, iw]);
  const yMax = max(PRICE_INDEX, (d) => Math.max(d.dram, d.nand))! * 1.12;
  const y = scaleLinear().domain([0, yMax]).range([ih, 0]).nice();
  const ticks = y.ticks(4);

  const mkArea = (key: "dram" | "nand") =>
    d3area<PricePoint>()
      .x((d) => x(d.quarter)!)
      .y0(ih)
      .y1((d) => y(d[key]))
      .curve(curveMonotoneX)(PRICE_INDEX)!;
  const mkLine = (key: "dram" | "nand") =>
    d3line<PricePoint>()
      .x((d) => x(d.quarter)!)
      .y((d) => y(d[key]))
      .curve(curveMonotoneX)(PRICE_INDEX)!;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="DRAM and NAND contract-price index through 2026"
    >
      <defs>
        <linearGradient id={`dram-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`nand-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`clip-${uid}`}>
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

        <g clipPath={`url(#clip-${uid})`}>
          <path d={mkArea("dram")} fill={`url(#dram-${uid})`} />
          <path d={mkArea("nand")} fill={`url(#nand-${uid})`} />
          <path
            d={mkLine("nand")}
            fill="none"
            stroke="#f97316"
            strokeWidth={2.5}
            filter={`url(#glow-${uid})`}
          />
          <path
            d={mkLine("dram")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
            filter={`url(#glow-${uid})`}
          />
        </g>

        {PRICE_INDEX.map((d, i) => {
          const reveal = Math.max(
            0,
            Math.min(1, (p - i / PRICE_INDEX.length) * 3)
          );
          return (
            <g key={i} opacity={reveal}>
              <circle
                cx={x(d.quarter)}
                cy={y(d.dram)}
                r={4}
                fill="#3b82f6"
                className="stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              <circle
                cx={x(d.quarter)}
                cy={y(d.nand)}
                r={4}
                fill="#f97316"
                className="stroke-white dark:stroke-slate-900"
                strokeWidth={2}
              />
              {i > 0 && (
                <text
                  x={x(d.quarter)}
                  y={y(d.dram) - 10}
                  textAnchor="middle"
                  className="fill-blue-600 dark:fill-blue-400"
                  fontSize={10}
                  fontWeight={700}
                >
                  {d.dram}
                </text>
              )}
              {i > 0 && (
                <text
                  x={x(d.quarter)}
                  y={y(d.nand) + 16}
                  textAnchor="middle"
                  className="fill-orange-600 dark:fill-orange-400"
                  fontSize={10}
                  fontWeight={700}
                >
                  {d.nand}
                </text>
              )}
            </g>
          );
        })}

        {PRICE_INDEX.map((d, i) => (
          <text
            key={i}
            x={x(d.quarter)}
            y={ih + 20}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400"
            fontSize={10}
          >
            {d.quarter}
          </text>
        ))}

        <g transform="translate(0,-12)">
          <circle cx={6} cy={0} r={4} fill="#3b82f6" />
          <text
            x={16}
            y={0}
            dy="0.32em"
            className="fill-slate-600 dark:fill-slate-300"
            fontSize={10}
          >
            DRAM contract
          </text>
          <circle cx={120} cy={0} r={4} fill="#f97316" />
          <text
            x={130}
            y={0}
            dy="0.32em"
            className="fill-slate-600 dark:fill-slate-300"
            fontSize={10}
          >
            NAND contract
          </text>
        </g>
      </g>
    </svg>
  );
}
