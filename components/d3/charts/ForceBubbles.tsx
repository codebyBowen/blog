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
import { ChartProps } from "../lib/types";
import { useAnimatedProgress } from "../lib/hooks";
import { gradient, colorAt } from "../lib/palette";

interface Datum {
  label: string;
  value: number;
  color?: string;
  sub?: string;
}
interface Options {
  data?: Datum[];
  valuePrefix?: string;
  unit?: string;
}
interface Node extends Datum {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
  r: number;
}

export default function ForceBubbles({ width, active, options = {} }: ChartProps) {
  const o = options as Options;
  const items = Array.isArray(o.data) ? o.data : [];
  const prefix = o.valuePrefix ?? "";
  const unit = o.unit ?? "";
  const p = useAnimatedProgress(active, 1600);
  const [, setTick] = useState(0);
  const [hover, setHover] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<ReturnType<typeof forceSimulation> | null>(null);
  const dragName = useRef<string | null>(null);

  const w = Math.max(300, Math.min(width, 680));
  const h = Math.round(w * 0.62);

  const nodes = useMemo<Node[]>(() => {
    if (!items.length) return [];
    const rScale = scaleSqrt()
      .domain([0, max(items, (d) => d.value)!])
      .range([0, Math.min(w, h) * 0.27]);
    return items.map((d, i) => ({
      ...d,
      r: rScale(d.value),
      x: w / 2 + Math.cos((i / items.length) * 2 * Math.PI) * 50,
      y: h / 2 + Math.sin((i / items.length) * 2 * Math.PI) * 50,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, items.length]);

  useEffect(() => {
    if (!active || !nodes.length) return;
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
    dragName.current = n.label;
    simRef.current?.alphaTarget(0.3).restart();
    const { x, y } = toLocal(e);
    n.fx = x;
    n.fy = y;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragName.current) return;
    const n = nodes.find((nn) => nn.label === dragName.current);
    if (!n) return;
    const { x, y } = toLocal(e);
    n.fx = x;
    n.fy = y;
  };
  const onUp = () => {
    if (!dragName.current) return;
    const n = nodes.find((nn) => nn.label === dragName.current);
    if (n) {
      n.fx = null;
      n.fy = null;
    }
    simRef.current?.alphaTarget(0);
    dragName.current = null;
  };

  if (!items.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Provide <code className="mx-1">data</code> with label/value.
      </div>
    );
  }

  return (
    <div className="relative" style={{ opacity: active ? 1 : 0, transition: "opacity .6s" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="packed bubble chart"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        style={{ touchAction: "none" }}
      >
        <defs>
          {nodes.map((n, i) => {
            const [c0, c1] = gradient(colorAt(i, n.color));
            return (
              <radialGradient key={i} id={`fb-${i}`} cx="0.35" cy="0.32" r="0.8">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c0} />
              </radialGradient>
            );
          })}
          <filter id="fb-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map((n, i) => {
          const rr = n.r * (0.3 + 0.7 * p);
          return (
            <g
              key={i}
              transform={`translate(${n.x},${n.y})`}
              style={{ cursor: "grab" }}
              onPointerDown={(e) => onDown(e, n)}
              onPointerEnter={() => setHover(n)}
              onPointerLeave={() => setHover((cur) => (cur === n ? null : cur))}
            >
              <circle r={rr} fill={`url(#fb-${i})`} filter="url(#fb-glow)" opacity={0.92} />
              <text
                textAnchor="middle"
                dy="-0.1em"
                className="fill-white"
                fontWeight={800}
                fontSize={Math.max(12, rr * 0.34)}
                style={{ pointerEvents: "none" }}
              >
                {prefix}
                {Math.round(n.value * p).toLocaleString()}
                {unit}
              </text>
              <text
                textAnchor="middle"
                dy="1.4em"
                className="fill-white/80"
                fontSize={Math.max(9, rr * 0.17)}
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-lg bg-slate-900/90 px-3 py-2 text-center text-xs text-white shadow-lg">
          <div className="font-semibold">{hover.label}</div>
          <div>
            {hover.sub ? `${hover.sub} · ` : ""}
            {prefix}
            {hover.value.toLocaleString()}
            {unit}
          </div>
        </div>
      )}
    </div>
  );
}
