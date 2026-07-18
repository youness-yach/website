---
title: Conservative — Leveraged-ETF Regime Strategy
head: '<meta name="description" content="Conservative: RiskBalance plus a leveraged rate hedge and a stickier hidden-Markov regime read, trading responsiveness for a smoother ride."><script type="module" src="/shell.js"></script>'
toc: false
---

```js
import {runBacktestWidget} from "./run-widget.js";
const d = FileAttachment("./data/conservative.json").json();
```

<div class="stamp">Quant · Leveraged-ETF regime strategy</div>

# Conservative

<div class="deck">RiskBalance's universe plus a rate hedge, and a deliberately slower-to-change regime read.</div>

<a class="btn" href="./">← Back to all four backtests</a>

## How it's built

Conservative trades RiskBalance's same 14 names plus one more: TMF, a 3×-leveraged long-duration
Treasury ETF that only earns a meaningful score when rates are falling — an opportunistic hedge rather
than a permanent holding. Scoring, gating (none), and portfolio construction are otherwise identical to
RiskBalance: same global risk budget policy, same volatility-scaled position sizing, same top-8 selection.

The one deliberate difference is the regime-detection HMM itself. RiskBalance's HMM is capped so it
can't get too confident about staying in one state — Conservative removes that cap. Its hidden-Markov
model is allowed to be "sticky": once it's read Bear with enough confidence, it stays there longer,
which means Conservative reacts to genuine regime changes more slowly than RiskBalance does, in exchange
for not whipsawing on short-lived noise.

The question this config answers: does trading a wider net for a slower, more conviction-weighted read
of the market actually pay off? See the [comparison table](./) for how it stacks up against the other
three.

```js
display(runBacktestWidget("conservative", "Conservative"))
```

```js
const m = d.metrics, b = d.benchmark, t = d.trade_statistics;
display(html`<div class="facts">
  <div><dt>CAGR</dt><dd class="g">${(m.cagr*100).toFixed(2)}%</dd></div>
  <div><dt>Total Return</dt><dd class="g">${(m.total_return*100).toFixed(1)}%</dd></div>
  <div><dt>Max Drawdown</dt><dd>${(m.max_drawdown*100).toFixed(2)}%</dd></div>
  <div><dt>Sharpe / Sortino</dt><dd>${m.sharpe_ratio.toFixed(3)} / ${m.sortino_ratio.toFixed(3)}</dd></div>
  <div><dt>Prob. Sharpe (PSR)</dt><dd>${(m.probabilistic_sharpe_ratio*100).toFixed(1)}%</dd></div>
  <div><dt>Alpha (ann.)</dt><dd class="g">${b.alpha_annualized.toFixed(3)}</dd></div>
  <div><dt>Win Rate</dt><dd>${(t.win_rate*100).toFixed(1)}%</dd></div>
  <div><dt>Profit Factor</dt><dd>${t.profit_factor.toFixed(2)}×</dd></div>
  <div><dt>R:R Ratio</dt><dd>${t.profit_loss_ratio.toFixed(2)}</dd></div>
  <div><dt>Trades</dt><dd>${t.total_closed_trades}</dd></div>
  <div><dt>Period</dt><dd>${d.period.start} → ${d.period.end}</dd></div>
</div>`)
```

```js
const parseDate = d3.utcParse("%Y-%m-%d");
const startEquity = d.equity_curve[0].equity;
const growthData = [
  ...d.equity_curve.map(p => ({date: parseDate(p.date), series: "Conservative", value: (p.equity / startEquity) * 100})),
  ...d.benchmark_equity_curve.map(p => ({date: parseDate(p.date), series: "SPY", value: (p.equity / startEquity) * 100})),
];
const ddData = d.drawdown_curve.map(p => ({date: parseDate(p.date), value: p.drawdown * 100}));
```

<div class="dash-chart">
<h4>Growth of 100 vs SPY (backtest)</h4>

```js
Plot.plot({
  width: 900,
  height: 260,
  marginLeft: 40,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {type: "utc", label: null},
  y: {label: "Growth of 100", grid: true},
  color: {domain: ["Conservative", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
  marks: [
    Plot.ruleY([100], {stroke: "#1C2323", strokeDasharray: "3,3"}),
    Plot.lineY(growthData, {x: "date", y: "value", stroke: "series", strokeWidth: 1.4, tip: true}),
  ],
})
```

</div>
<div class="dash-legend">
  <span>Indexed to 100 at the start of the backtest — shape and relative growth, not dollar amounts.</span>
</div>

<div class="dash-chart">
<h4>Drawdown (backtest)</h4>

```js
Plot.plot({
  width: 900,
  height: 160,
  marginLeft: 40,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {type: "utc", label: null},
  y: {label: "Drawdown (%)", grid: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.areaY(ddData, {x: "date", y1: 0, y2: "value", fill: "#E5484D", fillOpacity: 0.35}),
    Plot.lineY(ddData, {x: "date", y: "value", stroke: "#E5484D", strokeWidth: 1}),
  ],
})
```

</div>

```js
const years = Object.keys(d.annual_returns).sort();
const barData = years.flatMap(y => [
  {year: y, series: "Conservative", value: d.annual_returns[y].strategy * 100},
  {year: y, series: "SPY", value: d.annual_returns[y].spy * 100},
]);
```

<div class="dash-chart">
<h4>Annual return vs SPY (backtest)</h4>

```js
Plot.plot({
  width: 900,
  height: 260,
  marginLeft: 40,
  style: {background: "transparent", color: "#7B8783", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px"},
  x: {label: null, ticks: [], axis: null},
  y: {label: "Return (%)", grid: true},
  color: {domain: ["Conservative", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.barY(barData, {x: "series", y: "value", fx: "year", fill: "series", tip: true}),
  ],
})
```

</div>

<div class="explainer">

### Reading this result

<p>Same weekly-Friday-rebalance harness and Sharpe methodology as the other three configurations —
directly comparable, not a standalone number. The uncapped HMM here is the main behavioral difference
from RiskBalance: watch how their annual returns diverge in sharp, short reversals versus sustained
trends.</p>

</div>

<div class="stack">Data: Yahoo Finance · <span>Weekly rebalance</span> · hmmlearn-style Gaussian HMM · Generated ${new Date(d.generated_at).toUTCString()}</div>
