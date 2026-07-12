// observablehq.config.js
// Youness Yachruti — portfolio
//
// CRITICAL: theme is [] (empty array), NOT "air"/"near-midnight".
// An empty theme means Observable ships NO default stylesheet, so style.css
// is the single source of truth for every pixel. If you set a named theme here,
// it will override the folder design and the site will look generic again.

export default {
  title: "Youness Yachruti",

  theme: [],                 // <-- no default theme. Do not change.
  style: "style.css",        // <-- our complete design system

  // The tab strip + left rail are rendered by shell.js, which reads this page map.
  // Observable's own header is disabled; the nameplate and tabs are injected into <body>.
  header: "",
  footer: `© ${new Date().getFullYear()} Youness Yachruti`,

  sidebar: true,             // we RESTYLE the native sidebar into the folder rail
  toc: false,
  pager: false,
  search: false,

  // Section names here become the top tabs. Order matters.
  pages: [
    {
      name: "Home",
      pages: [
        { name: "Profile",     path: "/" },
        { name: "How I work",  path: "/method" },
        { name: "Background",  path: "/record" }
      ]
    },
    {
      name: "Quant",
      pages: [
        { name: "The Geometry of Risk",        path: "/quantitative-finance/geometry-of-risk" },
        { name: "Leveraged-ETF Regime Strategy", path: "/quantitative-finance/leveraged-etf-strategy" },
        { name: "Discretionary FX Record",     path: "/quantitative-finance/discretionary-fx" }
      ]
    },
    {
      name: "Analytics",
      pages: [
        { name: "Semester at Sea Pipeline",  path: "/data-analytics/semester-at-sea" },
        { name: "LLM Workflow Automation",   path: "/data-analytics/llm-automation" },
        { name: "FX Ops & Compliance",       path: "/data-analytics/fx-ops-compliance" }
      ]
    },
    {
      name: "Research",
      pages: [
        { name: "Visa (NYSE:V) Valuation",   path: "/writing/visa-valuation" },
        { name: "Notes & Work in Progress",  path: "/writing/notes-wip" }
      ]
    },
    {
      name: "Contact",
      pages: [
        { name: "Get in touch", path: "/contact/" }
      ]
    }
  ],

  // shell.js builds the nameplate + folder tabs and prunes the sidebar to the
  // active section only. It must load on every page.
  head: '<script type="module" src="/shell.js"></script>',

  cleanUrls: true
};
