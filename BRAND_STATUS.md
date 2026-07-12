# Brand/design status

## 2026-07-12 — Folder-shell architecture fix

Implemented the corrected architecture from the design spec: kept Observable
Framework's real multi-page routing, but properly ported the folder/tab
chrome instead of falling back to Observable's default sidebar-only look.

**Files replaced wholesale, as instructed:**
- `observablehq.config.js` — `theme: []` + `style: "style.css"`, 5-group
  page map (Home/Quant/Analytics/Research/Contact), `shell.js` wired via
  `head`.
- `src/style.css` — complete custom design system, no base theme.
- `src/shell.js` — new file, injects nameplate + top tab strip.
- `src/index.md` (now Profile only), `src/method.md` (new), `src/record.md`
  (new) — home's three documents split into three real pages.

**Bugs found and fixed during verification** (the provided files assumed a
Framework version/behavior that didn't match what's actually installed):

1. `shell.js` and `style.css` targeted `<details>`/`<summary>` for sidebar
   groups. The installed Framework version (1.13.4) renders groups as
   `<section>` instead, with `.observablehq-section-active` already applied
   to the current one. Fixed both files to target `section`, and simplified
   `shell.js` by dropping its rail-pruning logic entirely — Framework's own
   class + a CSS rule does that with zero JS.
2. `footer: '© ${new Date().getFullYear()} Youness Yachruti'` used single
   quotes around a template-literal expression, so it would have rendered
   the literal `${...}` text instead of the year. Switched to backticks.
3. The 8 existing project pages used `<span class="stamp">`/`<span
   class="deck">`; the new CSS/reference pages expect `<div>` for both
   (block-level layout — border-bottom, padding, margin don't behave the
   same on an inline `<span>`). Converted all 10 pages.

**Verified in the browser before deploying** (screenshots, not assumed):
- Top tab row renders on every page checked (Home, Quant, Contact); active
  tab is phosphor green, 4px taller, seam merges into the folder body.
- Left rail shows only the active section's documents — confirmed empty
  `[]` result from `querySelectorAll('details')` was the actual bug, fixed
  by switching to `section.observablehq-section-active`.
- Current document highlighted phosphor green with left border — this was
  already correct (Framework's `.observablehq-link-active`, untouched).
- `body { overflow-y: hidden }` confirmed via computed style — no page-level
  scroll on desktop.
- No `theme-*.css` link in `<head>` — confirmed via
  `document.querySelectorAll('link[rel="stylesheet"]')`, only the Google
  Fonts link and the compiled `style.css` import.
- Mobile: horizontal scrollable tabs, rail collapses to a horizontal strip,
  content readable.

**Live:** https://youness-yachruti.pages.dev
**Repo:** https://github.com/youness-yach/website (commit `2590e8e`)

No numbers, dates, employers, or performance figures were changed on any
page — this pass was structural/CSS only.
