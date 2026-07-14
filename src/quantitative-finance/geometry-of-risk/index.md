---
title: The Geometry of Risk
toc: false
---

```js
const dash = FileAttachment("./data/risk-dashboard.json").json();
```

<div class="stamp">Quant · Flagship research</div>

# The Geometry of Risk

<div class="deck">Reading systemic stress before it prints</div>

Correlation is a comfortable number right up until the moment it isn't. This project builds a
**four-layer framework** for detecting systemic stress in the structure of a market,
rather than in its returns.

## The four layers

- **Network topology** — represent the market as a graph and watch it tighten. Stress shows up as the network collapsing toward a single cluster.
- **Granger causality** — trace who moves whom. In calm markets the causal graph is sparse; under stress it densifies and reverses direction.
- **Tail-risk quantification** — measure the fat end directly instead of trusting a variance number to describe it.
- **Hidden-Markov regime detection** — infer the unobserved state the market is actually in, and date the transitions.

Each layer is a weak signal on its own. Stacked, they identify the moments when a portfolio's
diversification is quietly evaporating — which is precisely when the risk report still looks fine.

<div class="stack">Python · <span>network topology</span> · Granger causality · tail risk · HMM</div>
<a class="btn solid" href="https://github.com/youness-yach/geometry-of-risk" target="_blank" rel="noopener">View the repository</a>

## Live risk dashboard

Below is a running instance of the framework's core layer — updated daily on real market
data, not a static snapshot. It's built to demonstrate the tool working, not to reproduce
the peer-reviewed manuscript results (see the note under "How to read this" for the
distinction).

```js
const current = dash.current;
const arClass = current.absorption_ratio >= 0.5 ? "a" : "g";
const regimeClass = `regime-${current.regime}`;

display(html`<div class="snapshot facts">
  <div><dt>Absorption Ratio</dt><dd class="${arClass}">${current.absorption_ratio.toFixed(3)}</dd></div>
  <div><dt>Accelerator (z-score)</dt><dd>${current.accelerator_zscore === null ? "—" : current.accelerator_zscore.toFixed(2)}</dd></div>
  <div><dt>Regime</dt><dd><span class="regime-badge ${regimeClass}">${current.regime}</span></dd></div>
  <div><dt>As of</dt><dd>${current.as_of}</dd></div>
</div>`);
```

```js
const parseDate = d3.utcParse("%Y-%m-%d");

const arSeries = dash.absorption_ratio
  .filter((d) => d.value !== null)
  .map((d) => ({date: parseDate(d.date), value: d.value}));

const regimeByDate = new Map(dash.regime.map((d) => [d.date, d.state]));
const regimeColor = {Calm: "#3FE38C", Transitional: "#F0A83C", Stress: "#E5484D"};

const regimeBands = dash.absorption_ratio
  .filter((d) => d.value !== null && regimeByDate.has(d.date))
  .map((d) => ({date: parseDate(d.date), state: regimeByDate.get(d.date)}));
```

<div class="dash-chart">
<h4>Rolling Absorption Ratio · 60-day window, regime-shaded</h4>

```js
Plot.plot({
  width: 900,
  height: 260,
  marginLeft: 40,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {type: "utc", label: null},
  y: {domain: [0, 1], label: "Absorption Ratio", grid: true},
  marks: [
    Plot.rectY(regimeBands, {x: "date", interval: "day", y2: 1, y1: 0, fill: (d) => regimeColor[d.state], fillOpacity: 0.45}),
    Plot.ruleY([0.5], {stroke: "#39423F", strokeDasharray: "3,3"}),
    Plot.lineY(arSeries, {x: "date", y: "value", stroke: "#3FE38C", strokeWidth: 1.4}),
  ],
})
```

</div>
<div class="dash-legend">
  <span><span class="sw" style="background:#3FE38C33"></span>Calm</span>
  <span><span class="sw" style="background:#F0A83C33"></span>Transitional</span>
  <span><span class="sw" style="background:#E5484D33"></span>Stress</span>
  <span>Dashed line: 0.50 systemic-stress threshold (Kritzman et al., 2011)</span>
</div>

```js
const accelSeries = dash.accelerator
  .filter((d) => d.value !== null)
  .map((d) => ({date: parseDate(d.date), value: d.value}));
```

<div class="dash-chart">
<h4>Accelerator · standardised 15-day change in Absorption Ratio (z-score)</h4>

```js
Plot.plot({
  width: 900,
  height: 180,
  marginLeft: 40,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {type: "utc", label: null},
  y: {label: "z-score", grid: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.ruleY([2, -2], {stroke: "#39423F", strokeDasharray: "3,3"}),
    Plot.areaY(accelSeries, {x: "date", y: "value", fill: (d) => (d.value >= 0 ? "#E5484D" : "#3FE38C"), fillOpacity: 0.35}),
    Plot.lineY(accelSeries, {x: "date", y: "value", stroke: "#C7D0CC", strokeWidth: 1}),
  ],
})
```

</div>
<div class="dash-legend">
  <span>Above +2σ: risk building fast</span>
  <span>Below −2σ: risk easing fast</span>
</div>

```js
const assets = dash.correlation_matrix.assets;
const corrCells = [];
dash.correlation_matrix.values.forEach((row, i) => {
  row.forEach((v, j) => corrCells.push({x: assets[j], y: assets[i], value: v}));
});
```

<div class="dash-chart">
<h4>Current correlation matrix · trailing 60 trading days</h4>

```js
Plot.plot({
  width: 900,
  height: 460,
  marginLeft: 110,
  marginBottom: 100,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {domain: assets, label: null, tickRotate: -40},
  y: {domain: assets, label: null},
  color: {type: "linear", scheme: "PiYG", domain: [-1, 1], legend: true, label: "correlation"},
  marks: [
    Plot.cell(corrCells, {x: "x", y: "y", fill: "value"}),
    Plot.text(corrCells, {x: "x", y: "y", text: (d) => d.value.toFixed(2), fill: "#070909", fontSize: 9}),
  ],
})
```

</div>

<div class="explainer">

### How to read this

<h4>Absorption Ratio</h4>
<p>The share of total variance across the nine-asset universe explained by the first
principal component, on a rolling 60-day window. High values mean the market is moving as
one correlated block — diversification is thin even if it doesn't show up in any single
correlation number. The 0.50 line follows Kritzman et al. (2011).</p>

<h4>Accelerator</h4>
<p>The standardised rate of change of the Absorption Ratio — is systemic risk building, and
how fast? A reading above +2σ means risk is rising quickly even if the AR level itself
isn't at an extreme yet; this is what a level-only reading of the Absorption Ratio misses.</p>

<h4>Regime</h4>
<p>A 3-state Gaussian Hidden Markov Model classifies each day as Calm, Transitional, or
Stress based on the joint behaviour of the dominant market factor, the Absorption Ratio, and
the accelerator. States are relabelled each run by mean Absorption Ratio, so the labels stay
meaningful even though the model is refit daily (see the note below).</p>

<h4>This dashboard vs. the manuscript</h4>
<p>The peer-reviewed analysis in the repository uses a single HMM fit and validates it
out-of-sample against 14 years of history — that's the methodology backing the paper's
results. This live page refits the HMM fresh on every update instead, on whatever data is
available that day. That's a deliberate choice: this page exists to show the framework
running as a tool, not to reproduce the manuscript. Numbers here may not exactly match the
paper's reported figures, and will vary run to run near regime boundaries.</p>

</div>

<div class="stack">Data: Yahoo Finance, 9 global assets · <span>Refit daily</span> · scikit-learn PCA · hmmlearn Gaussian HMM</div>
<a class="btn" href="https://github.com/youness-yach/geometry-of-risk" target="_blank" rel="noopener">Full methodology &amp; manuscript status →</a>

<p class="stack" style="margin-top:8px">Updates daily at 22:00 UTC, after US market close. Generated: ${new Date(dash.generated_at).toUTCString()}</p>
