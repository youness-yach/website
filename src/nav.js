// nav.js · marks the current page in the site header (aria-current).
const path = location.pathname.replace(/\/index$/, "/").replace(/\.html$/, "");
for (const a of document.querySelectorAll(".site-nav nav a")) {
  const href = a.getAttribute("href");
  if (href === "/research" && path.startsWith("/research")) a.setAttribute("aria-current", "page");
  if (href === "/about" && path.startsWith("/about")) a.setAttribute("aria-current", "page");
  if (href === "/#work" && (path.startsWith("/projects") || path.startsWith("/quantitative-finance"))) a.setAttribute("aria-current", "page");
}
