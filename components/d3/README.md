# Authoring D3 charts in Markdown

Charts are written **entirely in Markdown** — no code changes per article. Drop a
fenced ` ```viz ` block carrying a JSON config into any article body (the same
field used by `markdown_content` in Supabase). The renderer in
`app/article/[id]/ArticleContent.tsx` mounts the matching chart from `registry.tsx`.

Common fields on every block:

| field | meaning |
| --- | --- |
| `chart` | one of `radial-bars`, `area-trend`, `donut-toggle`, `dumbbell`, `bubbles` |
| `title` / `caption` / `source` | optional figure header, sub-line, and footnote |

Charts auto-assign colors from a palette; any datum may override with `color`.
They are responsive, animate on scroll-in, support dark mode, and honor
`prefers-reduced-motion`.

---

### `radial-bars` — polar bar chart

```viz
{
  "chart": "radial-bars",
  "valuePrefix": "+", "unit": "%",
  "center": { "title": "YTD 2026", "subtitle": "share price" },
  "data": [
    { "label": "SanDisk", "value": 493, "color": "#f43f5e" },
    { "label": "SK hynix", "value": 259 }
  ]
}
```
Options: `data[{label,value,color?}]`, `unit`, `valuePrefix`, `center{title,subtitle}`,
`max` (axis cap), `sort` (default true, descending).

### `area-trend` — multi-series gradient area + line

```viz
{
  "chart": "area-trend",
  "x": "quarter",
  "series": [{ "key": "dram", "label": "DRAM", "color": "#3b82f6" }],
  "data": [{ "quarter": "Q1", "dram": 100 }, { "quarter": "Q2", "dram": 157 }]
}
```
Options: `x` (row field for the x-axis), `series[{key,label,color?}]`,
`data` (rows keyed by `x` + each series key), `yTickCount`.

### `donut-toggle` — donut that morphs between datasets

```viz
{
  "chart": "donut-toggle",
  "modes": [
    { "label": "A", "center": { "title": "A" },
      "data": [{ "name": "X", "value": 60 }, { "name": "Y", "value": 40 }] },
    { "label": "B", "center": { "title": "B" },
      "data": [{ "name": "X", "value": 30 }, { "name": "Y", "value": 70 }] }
  ]
}
```
Options: `modes[{label,center?,data[{name,value,color?}]}]`. One mode = no toggle.

### `dumbbell` — before/after comparison

```viz
{
  "chart": "dumbbell", "format": "usd", "fromLabel": "2025", "toLabel": "2026",
  "data": [{ "label": "Micron", "from": 0.69, "to": 1.06, "changePct": 54 }]
}
```
Options: `data[{label,from,to,changePct?}]`, `format` (`usd`|`pct`|`plain`),
`fromLabel`, `toLabel`, `color` (the "to" dot).

### `bubbles` — draggable force-packed circles

```viz
{
  "chart": "bubbles", "valuePrefix": "+", "unit": "%",
  "data": [{ "label": "江波龙", "value": 2644, "sub": "Longsys", "color": "#a855f7" }]
}
```
Options: `data[{label,value,color?,sub?}]` (size ∝ value), `valuePrefix`, `unit`.
`sub` shows in the hover tooltip.
