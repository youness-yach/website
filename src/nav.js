// nav.js · the site header's behaviour.
// 1. Builds the Work menu (projects grouped by topic) from projects.js.
// 2. Opens and closes it: click or tap, Escape, or clicking outside.
// 3. Marks the current page in the header (aria-current).
import {topics} from "./projects.js";

const path = location.pathname.replace(/\/index$/, "/").replace(/\.html$/, "");
const button = document.querySelector(".work-toggle");
const menu = document.querySelector("#work-menu");

if (button && menu) {
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
  menu.innerHTML =
    `<div class="work-menu-grid">` +
    topics.map((t) => `<div class="work-menu-col"><p class="eyebrow">${esc(t.name)}</p>` +
      t.projects.map((p) => `<a href="${p.href}"${path === p.href.replace(/\/$/, "/") ? ' aria-current="page"' : ""}><span class="t">${esc(p.title)}</span><span class="k">${esc(p.kind)}</span></a>`).join("") +
      `</div>`).join("") +
    `</div><div class="work-menu-foot"><a href="/work">All projects by topic →</a><a href="/#work">Selected work on the home page</a></div>`;

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  };
  button.addEventListener("click", (e) => { e.stopPropagation(); setOpen(menu.hidden); });
  document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setOpen(false); button.focus(); } });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

  if (path.startsWith("/projects") || path.startsWith("/quantitative-finance") || path.startsWith("/work")) button.classList.add("current");
}

for (const a of document.querySelectorAll(".site-nav nav > a")) {
  const href = a.getAttribute("href");
  if ((href === "/research" || href === "/about") && path.startsWith(href)) a.setAttribute("aria-current", "page");
}
