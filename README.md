# Personal website — youness-yachruti.pages.dev

Built with [Observable Framework](https://observablehq.com/framework/). Home
page only for now — structured so project pages can be added one at a time as
repos get cleaned up.

Live: https://youness-yachruti.pages.dev

## Structure

```
src/
└── index.md      Home page (About, What I work on, Stack, Featured work, Contact)
observablehq.config.js   Site config (title, theme, nav — currently no sidebar/pages nav)
```

## How to run locally

```bash
npm install
npm run dev
```

Opens a local preview server (prints the URL to the terminal) with live
reload as you edit files in `src/`.

## How to add a project page

1. Create `src/projects/<project-slug>.md`.
2. Uncomment and extend the `pages` array in `observablehq.config.js`:
   ```js
   pages: [
     {
       name: "Projects",
       pages: [
         {name: "Geometry of Risk", path: "/projects/geometry-of-risk"},
       ]
     }
   ]
   ```
   This turns the sidebar back on automatically once `pages` is non-empty —
   set `sidebar: true` in the config if you want it visible.
3. Update the matching card in `src/index.md`'s "Featured work" section to
   link to `/projects/<project-slug>` instead of (or in addition to) the
   external GitHub link.
4. Build and redeploy (see below).

## How to redeploy

This deploys to Cloudflare Pages manually (no CI yet — deliberate, to keep
the pipeline simple until there's more than one page).

```bash
npm run build
CLOUDFLARE_API_TOKEN=your_token npx wrangler pages deploy dist --project-name=youness-yachruti
```

Get a token at https://dash.cloudflare.com/profile/api-tokens (Cloudflare
Pages — Edit permission is enough). Don't commit it — pass it inline as
shown above, or export it in your shell for the session.

## Notes

- No résumé download, no phone number — contact is email/LinkedIn/GitHub only.
- Every number on this site is sourced from a verified project or résumé —
  see the linked repos for methodology. Nothing here is invented.
- Custom domain: not yet configured — currently served from the free
  `*.pages.dev` subdomain.

---
Youness Yachruti · [LinkedIn](https://www.linkedin.com/in/youness-yachruti/)
