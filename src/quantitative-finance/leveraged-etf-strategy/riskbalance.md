---
title: RiskBalance — Leveraged-ETF Regime Strategy
head: '<meta name="description" content="RiskBalance: the widest-universe configuration of the leveraged-ETF regime strategy, no structural gating, sized off a single global risk budget."><script type="module" src="/shell.js"></script>'
toc: false
---

```js
import {runBacktestWidget} from "./run-widget.js";
const d = FileAttachment("./data/riskbalance.json").json();
```

<div class="stamp">Quant · Leveraged-ETF regime strategy</div>

# RiskBalance

<div class="deck">The widest tradable universe, no structural gate — every ticker competes on raw score.</div>

<a class="btn" href="./">← Back to all four backtests</a>

## How it's built

RiskBalance trades 14 names: the four 3×-leveraged equity ETFs (TQQQ, SOXL, SPXL, TECL), two 2×
energy/commodity names (ERX, UCO), four unleveraged diversifiers (IWM, EFA, XLV, XLF), gold and a broad
commodity basket (GLD, DBC), a rate hedge (IEF), and a small volatility-insurance sleeve (VIXY). Every
one of them is scored every week by the same signal formula — trend, volume-weighted momentum, relative
strength versus SPY/QQQ, a volatility penalty — and the top 8 by score get sized into the book.

There's no regime-based pre-filter deciding which tickers are even eligible: the market has to talk the
signal engine out of a position through the score itself, not through a hard block. Sizing runs off one
global risk budget — a single number, chosen from 10 discrete risk postures by a rules-based policy
reading drawdown, regime, and volatility stress — applied across the whole book and volatility-scaled
per position. The regime-detection HMM here is tuned "adaptive": its self-transition probability is
capped, so it doesn't get stuck reading Bear for weeks after the market has already turned.

This is the question RiskBalance answers: does the widest possible net, with no gating at all, generate
a better risk-adjusted return than a narrower, filtered book? Compared side by side with Conservative
and the current Alpha configurations, the answer is instructive — see the
[comparison table](./).

```js
display(runBacktestWidget("riskbalance", "RiskBalance"))
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
  ...d.equity_curve.map(p => ({date: parseDate(p.date), series: "RiskBalance", value: (p.equity / startEquity) * 100})),
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
  color: {domain: ["RiskBalance", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
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
  {year: y, series: "RiskBalance", value: d.annual_returns[y].strategy * 100},
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
  color: {domain: ["RiskBalance", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.barY(barData, {x: "series", y: "value", fx: "year", fill: "series", tip: true}),
  ],
})
```

</div>

<div class="explainer">

### Reading this result

<p>A weekly-Friday-rebalance backtest on daily bars, fees and slippage modelled at execution, run
through the same harness and Sharpe methodology as every other configuration on this site — so this
number is directly comparable to Conservative, Alpha 1, and Alpha 2, not just to itself.</p>

</div>

<div class="stack">Data: Yahoo Finance · <span>Weekly rebalance</span> · hmmlearn-style Gaussian HMM · Generated ${new Date(d.generated_at).toUTCString()}</div>
