# youness-yachruti.pages.dev

Personal portfolio of Youness Yachruti, built with
[Observable Framework](https://observablehq.com/framework/) and deployed to
Cloudflare Pages. Written for recruiters and industry professionals: the home
page shows qualifications at a glance, and every project leads with the skills
it applied and one verified result.

## Pages

| URL | Source | What it shows |
|---|---|---|
| `/` | `src/index.md` | Tearsheet, 6 selected project cards, skills-by-project matrix, research |
| `/work` | `src/work.md` | All projects grouped by topic |
| `/quantitative-finance/geometry-of-risk/` | `src/quantitative-finance/geometry-of-risk/index.md` | Research project, SSRN paper, live risk dashboard |
| `/projects/urban-heat-islands` | `src/projects/urban-heat-islands.md` | Geospatial machine learning |
| `/projects/labor-analytics` | `src/projects/labor-analytics.md` | Power BI suite and measure audit |
| `/projects/cpi-forecasting` | `src/projects/cpi-forecasting.md` | Time-series ML and leakage |
| `/projects/semester-at-sea` | `src/projects/semester-at-sea.md` | SQL data model and revenue analysis |
| `/projects/summr-strategy` | `src/projects/summr-strategy.md` | Summary of professional work (hypothetical results, no proprietary detail) |
| `/research` | `src/research.md` | Paper and published writing |
| `/about` | `src/about.md` | Experience, education, leadership |

The header's **Work** menu and the `/work` page both read one list,
`src/projects.js`. To add a project, create its page, add an entry there and
add it to `pages` in `observablehq.config.js`. The home page's selected cards
are edited separately in `src/index.md`, so they stay fixed as the list grows.

Every number on the site comes from the linked repository, the SSRN paper or a
published note.

## Design

`src/style.css` is the whole design system (`theme: []` disables Observable's
default styles): a light "research tearsheet" look with Source Serif 4
headings, Source Sans 3 body text, IBM Plex Mono figures and a single navy
accent. Fonts are self-hosted in `static/fonts/` and declared in the `head` of
`observablehq.config.js`.

## Build and preview

```bash
npm install
# the live dashboard's data file is generated, not committed:
python ../geometry-of-risk/scripts/compute_risk_dashboard.py \
  src/quantitative-finance/geometry-of-risk/data/risk-dashboard.json
npm run build          # observable build + scripts/postbuild.mjs
npx wrangler pages deploy dist --project-name=youness-yachruti --branch=redesign   # private preview
```

`scripts/postbuild.mjs` copies `static/` (fonts, `_redirects`, the link-preview
image) into `dist/` and re-enables pinch-zoom. `static/_redirects` sends the
previous site's URLs to their new pages.

## Daily rebuild

`.github/workflows/daily-rebuild.yml` recomputes the Geometry of Risk dashboard
from the `geometry-of-risk` repo, rebuilds and deploys. It needs the
`CLOUDFLARE_API_TOKEN` secret.

---
Youness Yachruti · [LinkedIn](https://www.linkedin.com/in/youness-yachruti/)
