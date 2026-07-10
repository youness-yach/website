# Personal website — youness-yachruti.pages.dev

Built with [Observable Framework](https://observablehq.com/framework/).
Sidebar-plus-content layout, structured around two career tracks and a
writing section. Home page is fully built; the sections are real, empty
routes ready for project pages to be dropped in one at a time as repos are
cleaned up.

Live: https://youness-yachruti.pages.dev

## Structure

```
src/
├── index.md                    Home page (header, About, Education, Core
│                                expertise, Languages, Featured projects,
│                                Outside the desk)
├── quantitative-finance/
│   └── index.md                Section index — empty card grid for now
├── data-analytics/
│   └── index.md                Section index — empty card grid for now
├── writing/
│   └── index.md                Section index — empty card grid for now
├── projects/
│   └── _template.md            Copy this to start a new project page
└── assets/
    ├── site.css                 Shared styles (header/banner, cards, badges)
    └── images/
        ├── banner.png            Header banner (3168×792, 4:1)
        └── portrait.jpg          Header portrait (circular-cropped via CSS)
observablehq.config.js          Site config: sidebar nav, theme, head/footer
```

## How to run locally

```bash
npm install
npm run dev
```

Opens a local preview server (prints the URL to the terminal) with live
reload as you edit files in `src/`.

## How to add a project page

1. Copy `src/projects/_template.md` into the right section folder and rename
   it to the project's slug, e.g. `src/quantitative-finance/geometry-of-risk.md`.
   Fill in the sections (Overview, Key results, Approach, Stack, Links) —
   delete the HTML comment block at the top before publishing.
2. In `observablehq.config.js`, uncomment/add the entry in that section's
   `pages` array, e.g.:
   ```js
   {
     name: "Quantitative Finance",
     open: true,
     pages: [
       {name: "Overview", path: "/quantitative-finance/"},
       {name: "Geometry of Risk", path: "/quantitative-finance/geometry-of-risk"},
     ]
   }
   ```
3. Add a card for it in that section's `index.md` (inside the empty
   `<div class="cards">...</div>`), and — if it's one of the top projects —
   add the same card to `src/index.md`'s "Featured projects" grid. Copy the
   markup of an existing card if one exists, or use:
   ```html
   <div class="card">
   <h3>Project Name</h3>
   <p>One-sentence description.</p>
   <a class="card-link" href="/quantitative-finance/geometry-of-risk">View project →</a>
   </div>
   ```
4. Build and redeploy (see below).

## How to redeploy

This deploys to Cloudflare Pages manually (no CI yet — deliberate, to keep
the pipeline simple while the site is still mostly scaffolding).

```bash
npm run build
CLOUDFLARE_API_TOKEN=your_token npx wrangler pages deploy dist --project-name=youness-yachruti
```

Get a token at https://dash.cloudflare.com/profile/api-tokens (Cloudflare
Pages — Edit permission is enough). Don't commit it — pass it inline as
shown above, or export it in your shell for the session only.

## Notes

- No résumé download, no phone number — contact is email/LinkedIn/GitHub
  badges only, on the home page header.
- The header portrait/banner are the only images on the site by design — no
  photo strip or gallery.
- The "About me" section on the home page currently has placeholder copy —
  search for the `PLACEHOLDER` comment in `src/index.md` and replace it.
- Every number on this site is sourced from a verified project or résumé —
  see the linked repos for methodology. Nothing here is invented.
- Custom domain: not yet configured — currently served from the free
  `*.pages.dev` subdomain.

---
Youness Yachruti · [LinkedIn](https://www.linkedin.com/in/youness-yachruti/)
