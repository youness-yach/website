---
title: All projects
---

<header class="proj-head">
<p class="eyebrow">Work</p>
<h1>All projects</h1>
<p class="lead">Every project, grouped by topic. Each page opens with the skills it applied and one verified result.</p>
</header>

<div id="all-projects"></div>

```js
import {topics} from "./projects.js";
const root = document.querySelector("#all-projects");
root.replaceChildren(...topics.map((t) => html`<section class="topic">
  <h2>${t.name}</h2>
  <div class="plist">${t.projects.map((p) => html`<a href="${p.href}">
    <span><span class="t">${p.title}</span><span class="s">${p.summary}</span></span>
    <span class="k">${p.kind}</span>
  </a>`)}</div>
</section>`));
```
