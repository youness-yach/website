// observablehq.config.js · Youness Yachruti · portfolio
//
// theme: [] disables Observable's default stylesheet, so src/style.css owns the
// whole design. The site header is plain HTML below; src/nav.js marks the
// current page in it. There is no sidebar and no Observable table of contents:
// project pages carry their own "On this page" list.

export default {
  root: "src",
  title: "Youness Yachruti",
  theme: [],
  style: "style.css",
  globalStylesheets: [],
  sidebar: false,
  toc: false,
  pager: false,
  search: false,
  preserveIndex: false,
  preserveExtension: false,

  header: `<div class="site-nav">
  <a class="brand" href="/">Youness Yachruti</a>
  <nav aria-label="Main">
    <a href="/#work">Work</a>
    <a href="/research" class="hide-xs">Research</a>
    <a href="/about" class="hide-sm">About</a>
    <a href="mailto:yyachruti@gmail.com" class="btn-nav">Contact</a>
  </nav>
</div>`,

  footer: `<a href="/about">About</a> · <a href="/research">Research</a> · <a href="mailto:yyachruti@gmail.com">yyachruti@gmail.com</a> · <a href="https://www.linkedin.com/in/youness-yachruti/">LinkedIn</a> · <a href="https://github.com/youness-yach">GitHub</a><br>© ${new Date().getFullYear()} Youness Yachruti`,

  head: `<meta name="description" content="Youness Yachruti: quantitative researcher and data scientist. Systematic trading and risk models in Python, published research, and reproducible data projects.">
<meta property="og:site_name" content="Youness Yachruti">
<meta property="og:type" content="website">
<meta property="og:image" content="https://youness-yachruti.pages.dev/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='4' fill='%231F4E79'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='17' font-weight='600' text-anchor='middle' fill='white'%3EYY%3C/text%3E%3C/svg%3E">
<style>
@font-face{font-family:"Source Serif 4";font-weight:500;font-style:normal;font-display:swap;src:url("/fonts/source-serif-4-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Source Serif 4";font-weight:600;font-style:normal;font-display:swap;src:url("/fonts/source-serif-4-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Source Sans 3";font-weight:400;font-style:normal;font-display:swap;src:url("/fonts/source-sans-3-latin-400-normal.woff2") format("woff2")}
@font-face{font-family:"Source Sans 3";font-weight:400;font-style:italic;font-display:swap;src:url("/fonts/source-sans-3-latin-400-italic.woff2") format("woff2")}
@font-face{font-family:"Source Sans 3";font-weight:600;font-style:normal;font-display:swap;src:url("/fonts/source-sans-3-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:400;font-style:normal;font-display:swap;src:url("/fonts/IBMPlexMono-Regular.woff2") format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:500;font-style:normal;font-display:swap;src:url("/fonts/IBMPlexMono-Medium.woff2") format("woff2")}
</style>
<script type="module" src="/nav.js"></script>`,

  pages: [
    {name: "Home", path: "/"},
    {name: "The Geometry of Risk", path: "/quantitative-finance/geometry-of-risk/"},
    {name: "Urban heat islands", path: "/projects/urban-heat-islands"},
    {name: "Marriott labour analytics", path: "/projects/labor-analytics"},
    {name: "CPI forecasting", path: "/projects/cpi-forecasting"},
    {name: "Semester at Sea", path: "/projects/semester-at-sea"},
    {name: "Summr strategy", path: "/projects/summr-strategy"},
    {name: "Research", path: "/research"},
    {name: "About", path: "/about"}
  ]
};
