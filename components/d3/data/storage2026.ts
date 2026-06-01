// Real, sourced data for the 2026 memory/storage ("存储板块") supercycle article.
// Every figure below is anchored to reporting from May–June 2026. Where a chart
// needs a derived value (e.g. a 2025 base back-calculated from a reported YoY %),
// the derivation is noted inline so the visualization stays honest.

export type Region = "US" | "KR" | "CN";

export const REGION_LABEL: Record<Region, string> = {
  US: "United States",
  KR: "South Korea",
  CN: "China A-share",
};

// ---------------------------------------------------------------------------
// 1) 2026 year-to-date share-price returns (the "scoreboard")
//    Sources: SanDisk +493% & Micron +154–168% YTD (US News / Intellectia,
//    mid-May 2026); SK hynix +259% YTD (IBTimes); Samsung +160% YTD (IBTimes);
//    Biwin/佰维存储 +180% YTD (OFweek, May 2026).
// ---------------------------------------------------------------------------
export interface ReturnDatum {
  ticker: string;
  name: string;
  region: Region;
  ytd: number; // percent
}

export const YTD_RETURNS: ReturnDatum[] = [
  { ticker: "SNDK", name: "SanDisk", region: "US", ytd: 493 },
  { ticker: "000660.KS", name: "SK hynix", region: "KR", ytd: 259 },
  { ticker: "佰维存储", name: "Biwin", region: "CN", ytd: 180 },
  { ticker: "MU", name: "Micron", region: "US", ytd: 168 },
  { ticker: "005930.KS", name: "Samsung", region: "KR", ytd: 160 },
];

// ---------------------------------------------------------------------------
// 2) Contract-price index, rebased to 100 at Q4 2025.
//    Built from real sequential (QoQ) contract guidance:
//    DRAM +57% (Q1'26) then +60% (Q2'26); NAND +35% (Q1'26) then +72% (Q2'26).
//    Sources: TrendForce 1Q26 / 2Q26 guidance, Morgan Stanley 2026 outlook.
// ---------------------------------------------------------------------------
export interface PricePoint {
  quarter: string;
  dram: number;
  nand: number;
}

export const PRICE_INDEX: PricePoint[] = [
  { quarter: "Q4 2025", dram: 100, nand: 100 },
  { quarter: "Q1 2026", dram: 157, nand: 135 },
  { quarter: "Q2 2026", dram: 251, nand: 232 },
];

// ---------------------------------------------------------------------------
// 3) HBM market share — current generation (HBM3E, Q2 2026) vs the next-gen
//    HBM4 allocation on NVIDIA's Rubin platform.
//    Sources: Astute Group / Presenc AI (SK hynix 62 / Micron 21 / Samsung 17),
//    TrendForce (HBM4 Rubin allocation SK hynix ~55 / Samsung ~25 / Micron ~20).
// ---------------------------------------------------------------------------
export interface ShareDatum {
  name: string;
  value: number;
}

export const HBM_SHARE: Record<"hbm3e" | "hbm4", ShareDatum[]> = {
  hbm3e: [
    { name: "SK hynix", value: 62 },
    { name: "Micron", value: 21 },
    { name: "Samsung", value: 17 },
  ],
  hbm4: [
    { name: "SK hynix", value: 55 },
    { name: "Samsung", value: 25 },
    { name: "Micron", value: 20 },
  ],
};

// ---------------------------------------------------------------------------
// 4) Revenue per bit, traditional DRAM (USD/Gb), 2025 -> 2026.
//    2026 values & YoY % are reported; 2025 base is back-calculated and rounded.
//    Samsung $0.79 (+116% -> 2025 ~0.37); SK hynix $0.70 (+78% -> ~0.39);
//    Micron $1.06 (+54% -> ~0.69). Source: Morgan Stanley via TradingKey.
// ---------------------------------------------------------------------------
export interface RevPerBitDatum {
  name: string;
  y2025: number;
  y2026: number;
  changePct: number;
}

export const REVENUE_PER_BIT: RevPerBitDatum[] = [
  { name: "Micron", y2025: 0.69, y2026: 1.06, changePct: 54 },
  { name: "SK hynix", y2025: 0.39, y2026: 0.7, changePct: 78 },
  { name: "Samsung", y2025: 0.37, y2026: 0.79, changePct: 116 },
];

// ---------------------------------------------------------------------------
// 5) China A-share storage complex — Q1 2026 YoY net-profit growth.
//    Sources: STCN / JRJ / TFcaijing (Mar–May 2026 earnings).
//    netProfit is Q1 2026 net profit in 亿元 (hundred-million RMB).
// ---------------------------------------------------------------------------
export interface ChinaStockDatum {
  name: string;
  pinyin: string;
  growthPct: number; // Q1 2026 YoY net-profit growth
  netProfit: number; // 亿元 RMB
}

export const CHINA_STORAGE: ChinaStockDatum[] = [
  { name: "江波龙", pinyin: "Longsys", growthPct: 2644, netProfit: 3.86 },
  { name: "佰维存储", pinyin: "Biwin", growthPct: 1568, netProfit: 2.9 },
  { name: "兆易创新", pinyin: "GigaDevice", growthPct: 523, netProfit: 14.61 },
];

// ---------------------------------------------------------------------------
// Shared palette — works on light & dark backgrounds.
// ---------------------------------------------------------------------------
export const COMPANY_COLOR: Record<string, [string, string]> = {
  // name -> [from, to] gradient stops
  SanDisk: ["#f43f5e", "#fb7185"],
  "SK hynix": ["#f97316", "#fdba74"],
  Micron: ["#10b981", "#6ee7b7"],
  Samsung: ["#3b82f6", "#93c5fd"],
  Biwin: ["#eab308", "#fde047"],
  Longsys: ["#a855f7", "#d8b4fe"],
  GigaDevice: ["#ec4899", "#f9a8d4"],
};

export const REGION_COLOR: Record<Region, [string, string]> = {
  US: ["#10b981", "#6ee7b7"],
  KR: ["#3b82f6", "#93c5fd"],
  CN: ["#f43f5e", "#fb7185"],
};

export const SOURCES = {
  returns:
    "Sources: U.S. News, IBTimes, Intellectia, OFweek (May 2026), YTD share-price returns.",
  price:
    "Source: TrendForce 1Q26/2Q26 contract guidance & Morgan Stanley; index rebased to Q4 2025 = 100.",
  hbm: "Sources: Astute Group / Presenc AI (HBM3E Q2 2026) and TrendForce (HBM4 Rubin allocation).",
  revbit:
    "Source: Morgan Stanley via TradingKey; 2025 base back-calculated from reported 2026 YoY change.",
  china:
    "Sources: STCN, JRJ, TFcaijing — Q1 2026 reported net profit & YoY growth.",
};
