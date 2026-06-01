-- Generated from content/storage-supercycle-2026.md
-- Paste into Supabase → SQL Editor → Run.
insert into public.articles (title, content, markdown_content, tag, visibility)
values ($t$The 2026 Memory Super-Cycle: Anatomy of the Storage Sector's Historic Anomaly$t$,
        $c$A data-driven anatomy of the 2026 memory/storage (存储板块) super-cycle — prices, HBM, revenue per bit, and China's A-share explosion — rendered with interactive D3.$c$,
        $md$For most of the last decade, memory was the semiconductor industry's most boring corner — a deflationary commodity that bled value every year. In 2026 it became the single most important story in the market. A combination of an AI-driven demand shock, deliberate supply discipline, and the gravitational pull of high-bandwidth memory (HBM) turned DRAM and NAND into the scarcest, most profitable products in technology. This is a data-driven anatomy of that anomaly — the "存储板块异动" — built from the numbers reported through May–June 2026.

## The scoreboard nobody saw coming

The clearest way to feel the shock is to look at what equity investors did to memory stocks. These are not the gentle re-ratings of a normal up-cycle; they are vertical moves that pushed three companies past a **$1 trillion** market capitalization each — a combined ~$3 trillion oligopoly that now sits at the center of the AI supply chain.

```viz
{
  "chart": "radial-bars",
  "title": "The 2026 scoreboard",
  "caption": "Year-to-date share-price returns across the global memory complex.",
  "source": "Sources: U.S. News, IBTimes, Intellectia, OFweek (May 2026).",
  "valuePrefix": "+",
  "unit": "%",
  "center": { "title": "YTD 2026", "subtitle": "share price" },
  "data": [
    { "label": "SanDisk", "value": 493, "color": "#f43f5e" },
    { "label": "SK hynix", "value": 259, "color": "#f97316" },
    { "label": "Biwin", "value": 180, "color": "#eab308" },
    { "label": "Micron", "value": 168, "color": "#10b981" },
    { "label": "Samsung", "value": 160, "color": "#3b82f6" }
  ]
}
```

SanDisk, the pure-play NAND spin-out, was the standout with a year-to-date gain near **+493%**. SK hynix — the HBM technology leader — returned roughly **+259%** YTD (and more than +1,000% over a trailing year). Micron added about **+168%**, Samsung **+160%**, and on China's A-share market, Biwin (佰维存储) climbed **+180%**. Sources: [U.S. News](https://money.usnews.com/investing/articles/5-best-ai-memory-stocks-to-buy-for-2026), [IBTimes](https://www.ibtimes.com.au/samsung-sk-hynix-ai-memory-chip-boom-2026-1869727), [OFweek](https://semi.ofweek.com/2026-05/ART-202537-12003-30687472.html).

## What actually moved: the price super-cycle

Stocks re-rated because the underlying economics inverted. After years of falling prices, contract prices for both DRAM and NAND went near-vertical. TrendForce guidance put **conventional DRAM contract prices up ~57% in Q1 2026 and a further ~60% in Q2**, with NAND flash rising ~35% then ~72% over the same two quarters. Samsung flagged that its blended memory ASP jumped roughly **146%** versus the 2025 average, and Morgan Stanley modeled full-year 2026 increases of about **+62% for DRAM and +75% for NAND**.

```viz
{
  "chart": "area-trend",
  "title": "The price super-cycle",
  "caption": "DRAM and NAND contract-price index, rebased to Q4 2025 = 100.",
  "source": "Source: TrendForce 1Q26/2Q26 contract guidance & Morgan Stanley.",
  "x": "quarter",
  "series": [
    { "key": "dram", "label": "DRAM contract", "color": "#3b82f6" },
    { "key": "nand", "label": "NAND contract", "color": "#f97316" }
  ],
  "data": [
    { "quarter": "Q4 2025", "dram": 100, "nand": 100 },
    { "quarter": "Q1 2026", "dram": 157, "nand": 135 },
    { "quarter": "Q2 2026", "dram": 251, "nand": 232 }
  ]
}
```

The mechanism is unusually clean. The three majors reallocated wafer capacity toward HBM and high-margin server DRAM, starving the "legacy" market just as demand was inflecting. The result was a textbook squeeze: supply held flat-to-down on commodity parts while demand surged, and price did all the adjusting. Sources: [TrendForce](https://www.trendforce.com/news/2026/05/18/news-memory-supercycle-drives-1q26-price-surge-samsung-flags-146-asp-jump-sk-hynix-sees-mid-60-dram-gains/), [Astute Group](https://www.astutegroup.com/news/memory-shortages/dram-and-nand-prices-jump-as-samsung-sk-hynix-and-micron-tighten-supply/).

## The AI engine: HBM and the Rubin allocation

Underneath the price move is one product: **high-bandwidth memory**. HBM now consumes an estimated **~23% of total DRAM wafer output** in 2026 — up from ~19% in 2025 and effectively zero before the AI boom. Servers have gone from roughly 30% of memory demand to **60–70%**. HBM is reportedly sold out through year-end, with analysts describing a shortage that persists into 2028, and it commands **3–4x** the price of standard DRAM.

So the question "who owns HBM?" is really "who owns the AI memory profit pool?" Today, on the shipping HBM3E generation, SK hynix holds about **62%**, with Micron (~21%) having overtaken Samsung (~17%). But the 2026 battle is pivoting to **HBM4** and its allocation on NVIDIA's next-gen **Rubin** platform. Toggle the chart to compare:

```viz
{
  "chart": "donut-toggle",
  "title": "Who owns HBM",
  "caption": "Today's HBM3E split versus the next-gen HBM4 allocation on NVIDIA's Rubin.",
  "source": "Sources: Astute Group / Presenc AI (HBM3E Q2 2026); TrendForce (HBM4 Rubin).",
  "modes": [
    {
      "label": "HBM3E · today",
      "center": { "title": "HBM3E", "subtitle": "Q2 2026 share" },
      "data": [
        { "name": "SK hynix", "value": 62, "color": "#f97316" },
        { "name": "Samsung", "value": 17, "color": "#3b82f6" },
        { "name": "Micron", "value": 21, "color": "#10b981" }
      ]
    },
    {
      "label": "HBM4 · Rubin",
      "center": { "title": "HBM4", "subtitle": "Rubin allocation" },
      "data": [
        { "name": "SK hynix", "value": 55, "color": "#f97316" },
        { "name": "Samsung", "value": 25, "color": "#3b82f6" },
        { "name": "Micron", "value": 20, "color": "#10b981" }
      ]
    }
  ]
}
```

Samsung is the wildcard: it is positioned to be first to mass-ship HBM4 after Lunar New Year, and any share it claws back on Rubin re-rates the entire competitive picture. Sources: [Astute Group / Presenc AI](https://www.astutegroup.com/news/general/sk-hynix-holds-62-of-hbm-micron-overtakes-samsung-2026-battle-pivots-to-hbm4/), [TrendForce HBM4 note](https://www.trendforce.com/news/2026/02/09/news-samsung-hbm4-reportedly-to-ship-first-after-lunar-new-year-initial-share-projected-at-mid-20/).

## Every bit is worth more

The cleanest single metric for the super-cycle is **revenue per bit**: how much money the same physical quantity of memory now earns. Across the majors it is re-rating violently. Morgan Stanley's estimates have Samsung's traditional-DRAM revenue per bit rising ~116% to ~$0.79, SK hynix up ~78% to ~$0.70, and Micron up ~54% to ~$1.06.

```viz
{
  "chart": "dumbbell",
  "title": "Every bit is worth more",
  "caption": "Traditional-DRAM revenue per bit, 2025 → 2026 (USD per Gb).",
  "source": "Source: Morgan Stanley via TradingKey; 2025 base back-calculated from reported YoY change.",
  "format": "usd",
  "fromLabel": "2025",
  "toLabel": "2026",
  "data": [
    { "label": "Micron", "from": 0.69, "to": 1.06, "changePct": 54 },
    { "label": "SK hynix", "from": 0.39, "to": 0.70, "changePct": 78 },
    { "label": "Samsung", "from": 0.37, "to": 0.79, "changePct": 116 }
  ]
}
```

You can see the flow-through in the financials. **Micron's fiscal Q2 2026 revenue came in at $23.86 billion against a $20.07 billion consensus, with adjusted EPS of $12.20 versus $9.31 expected** — the kind of beat that only happens when pricing and volume move together. Source: [TradingKey](https://www.tradingkey.com/analysis/stocks/us-stocks/261690749-memory-stock-samsung-sk-hynix-hbm-tradingkey).

## The China dimension — 存储板块异动

The most violent moves on a percentage basis were on China's A-share market, where the "storage sector" (存储板块) became a thematic engine. Domestic module makers benefited twice over: from the global price ramp passing through to their products, and from a domestic-substitution tailwind. Earnings didn't just grow — they exploded off a low base.

```viz
{
  "chart": "bubbles",
  "title": "China's storage complex goes vertical",
  "caption": "Q1 2026 year-over-year net-profit growth for A-share names. Drag the bubbles.",
  "source": "Sources: STCN, JRJ, TFcaijing — Q1 2026 reported net profit & YoY growth.",
  "valuePrefix": "+",
  "unit": "%",
  "data": [
    { "label": "江波龙", "value": 2644, "sub": "Longsys · ¥3.86亿", "color": "#a855f7" },
    { "label": "佰维存储", "value": 1568, "sub": "Biwin · ¥2.90亿", "color": "#eab308" },
    { "label": "兆易创新", "value": 523, "sub": "GigaDevice · ¥14.61亿", "color": "#ec4899" }
  ]
}
```

In Q1 2026, **Longsys (江波龙) reported net profit up ~2,644% year-over-year, Biwin (佰维存储) ~+1,568%, and GigaDevice (兆易创新) ~+523%**, while Demingli (德明利) and others repeatedly hit limit-up. Biwin alone ran ~+180% year-to-date and filed for a Hong Kong listing on the back of it. Hover or drag the bubbles to inspect each name. Sources: [STCN](https://www.stcn.com/article/detail/3896940.html), [JRJ](https://m.jrj.com.cn/madapter/stock/2026/03/04103756174703.shtml).

## Cycle or bubble?

Both things can be true. The bull case is structural: AI infrastructure spending is still climbing, HBM is genuinely sold out, and the oligopoly has shown real supply discipline. The bear case is that memory has *always* been cyclical — a Harvard expert quoted by [Fortune](https://fortune.com/2026/05/11/ai-memory-chips-semiconductor-stock-boom-price-hikes-dram-shortage-hbm/) put it bluntly: "this too will pass." New capacity, an eventual HBM4 supply ramp, and aggressive Chinese DRAM/NAND expansion are the classic ingredients of the next down-leg.

What separates this cycle from prior ones is the *mix*: a structurally growing, price-insensitive HBM core wrapped around the old commodity business. That core is what bulls argue makes 2026 different.

## What to watch into the back half of 2026

- **HBM4 yields and the Rubin allocation** — the single biggest swing factor for who captures the AI memory pool.
- **Samsung's HBM4 ramp** — any share recovery re-rates the competitive map.
- **Commodity contract prices** — whether Q3/Q4 guidance holds the +50–60% QoQ trajectory or rolls over.
- **China supply** — domestic DRAM/NAND expansion is the most credible source of a price reversal.
- **Inventory at hyperscalers** — the first sign that demand is being pulled forward rather than sustained.

---

*Methodology: every figure is anchored to reporting from May–June 2026 (TrendForce, Morgan Stanley via TradingKey, U.S. News, IBTimes, STCN, JRJ, Fortune, OFweek). Where a chart needs a derived value — for example a 2025 revenue-per-bit base back-calculated from a reported year-over-year change, or a price index rebased to Q4 2025 = 100 from sequential QoQ guidance — the derivation is noted in the figure's caption. Every chart above is authored entirely in Markdown (a `viz` code-block carrying its own data) and rendered with D3.*
$md$,
        'Finance',
        'public');
