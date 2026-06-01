"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";
import { scaleSqrt } from "d3-scale";
import { max } from "d3-array";
import { CHINA_STORAGE, ChinaStockDatum } from "../data/storage2026";
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";

interface Node extends ChinaStockDatum {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
  r: number;
}

const COLORS: Record<string, [string, string]> = {
  江波龙: ["#a855f7", "#d8b4fe"],
  佰维存储: ["#eab308", "#fde047"],
  兆易创新: ["#ec4899", "#f9a8d4"],
};

export default function ChinaProfitBubble({ width, active }: ChartProps) {
  const w = Math.max(300, Math.min(width, 680));
  const h = Math.round(w * 0.62);
  const p = useAnimatedProgress(active, 1600);
  const [, setTick] = useState(0);
  const [hover, setHover] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<ReturnType<typeof forceSimulation> | null>(null);
  const dragName = useRef<string | null>(null);

  const rScale = useMemo(
    () =>
      scaleSqrt()
        .domain([0, max(CHINA_STORAGE, (d) => d.growthPct)!])
        .range([0, Math.min(w, h) * 0.27]),
    [w, h]
  );

  const nodes = useMemo<Node[]>(
    () =>
      CHINA_STORAGE.map((d, i) => ({
        ...d,
        r: rScale(d.growthPct),
        x: w / 2 + Math.cos((i / CHINA_STORAGE.length) * 2 * Math.PI) * 50,
        y: h / 2 + Math.sin((i / CHINA_STORAGE.length) * 2 * Math.PI) * 50,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [w, h]
  );

  useEffect(() => {
    if (!active) return;
    const sim = forceSimulation(nodes as any)
      .force("center", forceCenter(w / 2, h / 2))
      .force("x", forceX(w / 2).strength(0.08))
      .force("y", forceY(h / 2).strength(0.08))
      .force(
        "collide",
        forceCollide<any>()
          .radius((d: any) => d.r + 4)
          .strength(0.9)
      )
      .on("tick", () => setTick((t) => t + 1));
    simRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [active, w, h, nodes]);

  const toLocal = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * w,
      y: ((e.clientY - rect.top) / rect.height) * h,
    };
  };

  const onDown = (e: React.PointerEvent, n: Node) => {
    dragName.current = n.name;
    simRef.current?.alphaTarget(0.3).restart();
    const { x, y } = toLocal(e);
    n.fx = x;
    n.fy = y;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragName.current) return;
    const n = nodes.find((nn) => nn.name === dragName.current);
    if (!n) return;
    const { x, y } = toLocal(e);
    n.fx = x;
    n.fy = y;
  };
  const onUp = () => {
    if (!dragName.current) return;
    const n = nodes.find((nn) => nn.name === dragName.current);
    if (n) {
      n.fx = null;
      n.fy = null;
    }
    simRef.current?.alphaTarget(0);
    dragName.current = null;
  };

  return (
    <div
      className="relative"
      style={{ opacity: active ? 1 : 0, transition: "opacity .6s" }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="China A-share storage stocks, Q1 2026 net-profit growth bubbles"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        style={{ touchAction: "none" }}
      >
        <defs>
          {Object.entries(COLORS).map(([k, [c0, c1]]) => (
            <radialGradient
              key={k}
              id={`cb-${k}`}
              cx="0.35"
              cy="0.32"
              r="0.8"
            >
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c0} />
            </radialGradient>
          ))}
          <filter id="cb-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map((n) => {
          const rr = n.r * (0.3 + 0.7 * p);
          return (
            <g
              key={n.name}
              transform={`translate(${n.x},${n.y})`}
              style={{ cursor: "grab" }}
              onPointerDown={(e) => onDown(e, n)}
              onPointerEnter={() => setHover(n)}
              onPointerLeave={() => setHover((cur) => (cur === n ? null : cur))}
            >
              <circle
                r={rr}
                fill={`url(#cb-${n.name})`}
                filter="url(#cb-glow)"
                opacity={0.92}
              />
              <text
                textAnchor="middle"
                dy="-0.1em"
                className="fill-white"
                fontWeight={800}
                fontSize={Math.max(12, rr * 0.34)}
                style={{ pointerEvents: "none" }}
              >
                +{Math.round(n.growthPct * p).toLocaleString()}%
              </text>
              <text
                textAnchor="middle"
                dy="1.4em"
                className="fill-white/80"
                fontSize={Math.max(9, rr * 0.17)}
                style={{ pointerEvents: "none" }}
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-lg bg-slate-900/90 px-3 py-2 text-center text-xs text-white shadow-lg">
          <div className="font-semibold">
            {hover.name} · {hover.pinyin}
          </div>
          <div>
            Q1 2026 net profit ¥{hover.netProfit.toFixed(2)}亿 · YoY +
            {hover.growthPct.toLocaleString()}%
          </div>
        </div>
      )}

      <p className="mt-2 text-center text-xs text-slate-400">
        Drag the bubbles · size ∝ YoY net-profit growth
      </p>
    </div>
  );
}
