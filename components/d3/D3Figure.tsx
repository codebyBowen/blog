"use client";

import { useEffect, useRef, useState } from "react";
import { CHARTS } from "./registry";

export default function D3Figure({
  chartId,
  options,
}: {
  chartId: string;
  options?: Record<string, unknown>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const entry = CHARTS[chartId];
  if (!entry) {
    return (
      <div className="not-prose my-6 rounded-lg border border-dashed border-red-300 p-4 text-sm text-red-500">
        Unknown chart: <code>{String(chartId)}</code>
      </div>
    );
  }

  const { Component, title, caption, source } = entry;

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:from-slate-900 dark:to-slate-950">
      {title && (
        <figcaption className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </figcaption>
      )}
      {caption && (
        <p className="mt-0.5 mb-4 text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
      <div ref={ref} className="w-full">
        {width > 0 && (
          <Component width={width} active={active} options={options} />
        )}
      </div>
      {source && (
        <p className="mt-3 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          {source}
        </p>
      )}
    </figure>
  );
}
