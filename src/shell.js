// shell.js — the folder chrome.
// Runs on every page (wired in via `head` in observablehq.config.js).
//
// Job: inject the nameplate + top tab strip into <body> (above the folder).
//
// Pruning the sidebar to only the active section is handled by CSS alone —
// Observable already renders sidebar groups as <section> and marks the
// current one with .observablehq-section-active, and already adds
// .observablehq-link-active to the current page's <li>. No JS needed for
// either; this file only handles the top tab bar, which Observable has no
// native equivalent for.

const SECTIONS = [
  { tab: "Home",      href: "/",                                    match: p => p === "/" || p === "/method" || p === "/record" },
  { tab: "Quant",     href: "/quantitative-finance/geometry-of-risk", match: p => p.startsWith("/quantitative-finance") },
  { tab: "Analytics", href: "/data-analytics/semester-at-sea",        match: p => p.startsWith("/data-analytics") },
  { tab: "Research",  href: "/writing/visa-valuation",                match: p => p.startsWith("/writing") },
  { tab: "Contact",   href: "/contact/",                              match: p => p.startsWith("/contact") }
];

const path = location.pathname.replace(/index$/, "").replace(/\.html$/, "");
const active = SECTIONS.find(s => s.match(path)) || SECTIONS[0];

// ---- 1. nameplate + tabs -----------------------------------------------
const plate = document.createElement("div");
plate.className = "plate";
plate.innerHTML =
  '<a class="name" href="/">YOUNESS<b>_</b>YACHRUTI</a>' +
  '<div class="meta">Quant Finance · Systematic Trading · Risk</div>';

const tabs = document.createElement("nav");
tabs.className = "tabs";
tabs.setAttribute("aria-label", "Folders");
tabs.innerHTML = SECTIONS.map(s =>
  `<a href="${s.href}" class="${s === active ? "on" : ""}"${s === active ? ' aria-current="page"' : ""}>${s.tab}</a>`
).join("");

document.body.prepend(tabs);
document.body.prepend(plate);
