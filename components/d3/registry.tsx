"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { ChartProps } from "./lib/types";
import { SOURCES } from "./data/storage2026";

const Loading = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
  </div>
);

export interface ChartEntry {
  title: string;
  caption: string;
  source: string;
  Component: ComponentType<ChartProps>;
}

export const CHARTS: Record<string, ChartEntry> = {
  "ytd-returns": {
    title: "The 2026 scoreboard",
    caption:
      "Year-to-date share-price returns across the global memory complex.",
    source: SOURCES.returns,
    Component: dynamic(() => import("./charts/RadialReturns"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "price-index": {
    title: "The price super-cycle",
    caption:
      "DRAM and NAND contract-price index — the steepest memory ramp on record.",
    source: SOURCES.price,
    Component: dynamic(() => import("./charts/PriceIndexArea"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "hbm-share": {
    title: "Who owns HBM",
    caption:
      "Toggle between today's HBM3E split and the next-gen HBM4 allocation on NVIDIA's Rubin.",
    source: SOURCES.hbm,
    Component: dynamic(() => import("./charts/HbmShareDonut"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "rev-per-bit": {
    title: "Every bit is worth more",
    caption: "Traditional-DRAM revenue per bit, 2025 → 2026 (USD per Gb).",
    source: SOURCES.revbit,
    Component: dynamic(() => import("./charts/RevenuePerBitDumbbell"), {
      ssr: false,
      loading: Loading,
    }),
  },
  "china-profit": {
    title: "China's storage complex goes vertical",
    caption: "Q1 2026 year-over-year net-profit growth for A-share names.",
    source: SOURCES.china,
    Component: dynamic(() => import("./charts/ChinaProfitBubble"), {
      ssr: false,
      loading: Loading,
    }),
  },
};

export type ChartId = keyof typeof CHARTS;
