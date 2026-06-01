"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { ChartProps } from "./lib/types";

const Loading = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
  </div>
);

export interface ChartEntry {
  title?: string;
  caption?: string;
  source?: string;
  Component: ComponentType<ChartProps>;
}

// Generic, data-driven chart types. All data/config comes from the
// markdown ```viz block — these are just the rendering engines.
export const CHARTS: Record<string, ChartEntry> = {
  "radial-bars": {
    Component: dynamic(() => import("./charts/RadialBars"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "area-trend": {
    Component: dynamic(() => import("./charts/AreaTrend"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "donut-toggle": {
    Component: dynamic(() => import("./charts/DonutToggle"), {
      ssr: false,
      loading: Loading,
    }),
  },
  dumbbell: {
    Component: dynamic(() => import("./charts/Dumbbell"), {
      ssr: false,
      loading: Loading,
    }),
  },
  bubbles: {
    Component: dynamic(() => import("./charts/ForceBubbles"), {
      ssr: false,
      loading: Loading,
    }),
  },
};

export type ChartId = keyof typeof CHARTS;
