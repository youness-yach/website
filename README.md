# Personal website — youness-yachruti.pages.dev

Built with [Observable Framework](https://observablehq.com/framework/).
"Trading desk" theme — dark, monospace, terminal-inspired — with a real
sidebar and one page per project (no client-side tab-switching, every
project has its own shareable URL).

Live: https://youness-yachruti.pages.dev

## Structure

```
src/
├── index.md                        Home — Profile / How I Work / Background
├── style.css                       Full custom theme (no base theme import)
├── quantitative-finance/
│   ├── geometry-of-risk.md
│   ├── leveraged-etf-strategy.md
│   └── discretionary-fx.md
├── data-analytics/
│   ├── semester-at-sea.md
│   ├── llm-automation.md
│   └── fx-ops-compliance.md
├── writing/
│   ├── visa-valuation.md
│   └── notes-wip.md
├── contact/
│   └── index.md
└── projects/
    └── _template.md                Copy this to start a new project page
observablehq.config.js              Sidebar nav (4 groups), theme, header/footer
```

## Design system (all defined in `src/style.css`)

Reusable components you can drop into any page's markdown as raw HTML:

| Class | What it's for |
|---|---|
| `<span class="stamp">Section · Category</span>` | Small amber eyebrow label above the H1 |
| `<span class="deck">Subtitle</span>` | Uppercase mono subhead under the H1 |
| `<div class="facts">...</div>` | Stat strip — see `leveraged-etf-strategy.md` |
| `<div class="note"><b>Label</b>Text</div>` | Amber callout box — use for backtest/live disclaimers |
| `<div class="stack">Tech · <span>Key</span></div>` | Tech-stack line, wrap standout items in `<span>` |
| `<a class="btn solid" href="...">` | Filled button (primary CTA) |
| `<a class="btn" href="...">` | Outline button (secondary) |
| `<div class="ledger">...</div>` | Timeline rows — see `index.md` "Background" |

## How to run locally

```bash
npm install
npm run dev
```

Opens a local preview server (prints the URL to the terminal) with live
reload as you edit files in `src/`.

## How to add a project page

1. Copy `src/projects/_template.md` into the right section folder and rename
   it to the project's slug, e.g. `src/quantitative-finance/new-project.md`.
   Fill in the sections — every metric labeled backtest/live, nothing
   invented — then delete the HTML comment block at the top.
2. In `observablehq.config.js`, add an entry to that section's `pages`
   array:
   ```js
   {name: "New Project", path: "/quantitative-finance/new-project"}
   ```
3. Build and redeploy (see below).

## How to redeploy

Manual deploy to Cloudflare Pages (no CI yet — deliberate, kept simple):

```bash
npm run build
CLOUDFLARE_API_TOKEN=your_token npx wrangler pages deploy dist --project-name=youness-yachruti
```

Get a token at https://dash.cloudflare.com/profile/api-tokens (Cloudflare
Pages — Edit permission is enough). Don't commit it — pass it inline as
shown above, or export it in your shell for the session only.

## Notes

- No résumé download, no phone number, no photos anywhere on the site —
  contact is email/LinkedIn/GitHub only (Contact page).
- Every number is sourced from a verified project, résumé, or explicit
  confirmation — see the linked repos for methodology. Nothing invented.
  The leveraged-ETF strategy page explicitly labels its 0.3 Sharpe as
  backtest, not live.
- Custom domain: not yet configured — currently served from the free
  `*.pages.dev` subdomain.

---
Youness Yachruti · [LinkedIn](https://www.linkedin.com/in/youness-yachruti/)
