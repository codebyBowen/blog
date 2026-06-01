"use client";

import { useEffect, useRef, useState } from "react";
import { CHARTS } from "./registry";

export default function D3Figure({
  chartId,
  title,
  caption,
  source,
  options,
}: {
  chartId: string;
  title?: string;
  caption?: string;
  source?: string;
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
        Unknown chart: <code>{String(chartId)}</code>. Available:{" "}
        {Object.keys(CHARTS).join(", ")}.
      </div>
    );
  }

  const { Component } = entry;
  const finalTitle = title ?? entry.title;
  const finalCaption = caption ?? entry.caption;
  const finalSource = source ?? entry.source;

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-sm dark:border-white/10 dark:from-slate-900 dark:to-slate-950">
      {finalTitle && (
        <figcaption className="text-base font-semibold text-slate-900 dark:text-white">
          {finalTitle}
        </figcaption>
      )}
      {finalCaption && (
        <p className="mt-0.5 mb-4 text-sm text-slate-500 dark:text-slate-400">
          {finalCaption}
        </p>
      )}
      <div ref={ref} className="w-full">
        {width > 0 && (
          <Component width={width} active={active} options={options} />
        )}
      </div>
      {finalSource && (
        <p className="mt-3 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          {finalSource}
        </p>
      )}
    </figure>
  );
}
