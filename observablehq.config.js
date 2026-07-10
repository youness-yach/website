// See https://observablehq.com/framework/config for documentation.
//
// Sidebar architecture: two career tracks + a writing section, each an empty
// container (its own index page) until project pages are dropped in.
// See src/projects/_template.md for the pattern to copy when adding one.
const navigationPages = [
  {
    name: "Quantitative Finance",
    open: true,
    pages: [
      {name: "Overview", path: "/quantitative-finance/"}
      // Future: {name: "Geometry of Risk", path: "/quantitative-finance/geometry-of-risk"},
    ]
  },
  {
    name: "Data & Analytics",
    open: true,
    pages: [
      {name: "Overview", path: "/data-analytics/"}
      // Future: {name: "Semester at Sea", path: "/data-analytics/semester-at-sea"},
      // Future: {name: "Urban Heat Islands", path: "/data-analytics/uhi"},
    ]
  },
  {
    name: "Writing / Research",
    open: true,
    pages: [
      {name: "Overview", path: "/writing/"}
      // Future: {name: "Visa Inc. — Equity Research", path: "/writing/visa-equity-research"},
    ]
  }
];

export default {
  // The app's title; used in the sidebar and webpage titles.
  title: "Youness Yachruti",

  pages: navigationPages,

  // The path to the source root.
  root: "src",

  // Restrained, editorial look. Framework's default theme handles light/dark
  // automatically based on the visitor's system preference.
  theme: "default",
  head: '<link rel="stylesheet" href="/assets/site.css">',
  header: "",
  footer: `© ${new Date().getFullYear()} Youness Yachruti`,
  sidebar: true,
  toc: false,
  pager: false,
  search: false,
  linkify: true,
  typographer: false,
  preserveExtension: false,
  preserveIndex: false,
};
