// See https://observablehq.com/framework/config for documentation.
//
// Sidebar architecture matches your original tab/folder design:
// Home (single page) + four sections, each a real sidebar group with real
// sub-pages (was: Quant/Analytics/Research/Contact tabs + rail of docs).
const navigationPages = [
  {
    name: "Quant",
    open: true,
    pages: [
      {name: "The Geometry of Risk", path: "/quantitative-finance/geometry-of-risk"},
      {name: "Leveraged-ETF Regime Strategy", path: "/quantitative-finance/leveraged-etf-strategy"},
      {name: "Discretionary FX Record", path: "/quantitative-finance/discretionary-fx"}
    ]
  },
  {
    name: "Analytics",
    open: true,
    pages: [
      {name: "Semester at Sea Pipeline", path: "/data-analytics/semester-at-sea"},
      {name: "LLM Workflow Automation", path: "/data-analytics/llm-automation"},
      {name: "FX Ops & Compliance", path: "/data-analytics/fx-ops-compliance"}
    ]
  },
  {
    name: "Research",
    open: true,
    pages: [
      {name: "Visa (NYSE:V) Valuation", path: "/writing/visa-valuation"},
      {name: "Notes & Work in Progress", path: "/writing/notes-wip"}
    ]
  },
  {
    name: "Contact",
    open: true,
    pages: [
      {name: "Get in touch", path: "/contact/"}
    ]
  }
];

export default {
  title: "Youness Yachruti",

  pages: navigationPages,

  root: "src",

  // Full custom theme (dark, terminal/trading-desk aesthetic) — no base
  // theme import, style.css is fully self-contained.
  style: "style.css",
  head: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&display=swap" rel="stylesheet">',
  header: `<div class="plate"><div class="name">YOUNESS<b>_</b>YACHRUTI</div><div class="meta">Quant Finance · Systematic Trading · Risk</div></div>`,
  footer: `<span class="mono">© ${new Date().getFullYear()} Youness Yachruti</span>`,
  sidebar: true,
  toc: false,
  pager: false,
  search: true,
  linkify: true,
  typographer: false,
  preserveExtension: false,
  preserveIndex: false,
};
