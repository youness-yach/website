// projects.js · the single list of every project on the site.
// The Work menu in the header and the /work page both read from here.
// To add a project: add its page under src/projects/, add an entry below
// (and to `pages` in observablehq.config.js). The home page's "Selected work"
// cards are chosen separately, so they don't change as this list grows.

export const topics = [
  {
    name: "Quantitative finance",
    projects: [
      {title: "The Geometry of Risk", href: "/quantitative-finance/geometry-of-risk/", kind: "Independent research · SSRN paper",
       summary: "A four-layer framework that flags systemic stress across 9 global asset classes."},
      {title: "Regime-conditional leveraged-ETF strategy", href: "/projects/summr-strategy", kind: "Professional work · Summr Capital",
       summary: "A weekly strategy that holds leveraged exposure only when a regime read favours it."}
    ]
  },
  {
    name: "Machine learning",
    projects: [
      {title: "Urban heat islands from satellite data", href: "/projects/urban-heat-islands", kind: "Team project · I led the modelling",
       summary: "Heat-island classification in two cities, transferred to an unlabelled third."},
      {title: "CPI inflation forecasting", href: "/projects/cpi-forecasting", kind: "Baruch Pre-MFE coursework",
       summary: "Monthly US CPI from 28 macro features, and what removing look-ahead leakage does."}
    ]
  },
  {
    name: "Data and BI",
    projects: [
      {title: "Marriott labour analytics and audit", href: "/projects/labor-analytics", kind: "Hult MSc coursework",
       summary: "A Power BI suite for labour cost and compliance, then a Python audit of every measure."},
      {title: "Semester at Sea revenue in SQL", href: "/projects/semester-at-sea", kind: "Team coursework · SQL",
       summary: "A MySQL model that reconciles fiscal-year and academic-year revenue."}
    ]
  }
];
