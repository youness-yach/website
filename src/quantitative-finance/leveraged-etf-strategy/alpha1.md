---
title: Alpha 1 — Leveraged-ETF Regime Strategy
head: '<meta name="description" content="Alpha 1: the per-group risk engine that replaced a single global risk budget with four independently-sized instrument groups."><script type="module" src="/shell.js"></script>'
toc: false
---

```js
import {runBacktestWidget} from "./run-widget.js";
const d = FileAttachment("./data/alpha1.json").json();
```

<div class="stamp">Quant · Leveraged-ETF regime strategy</div>

# Alpha 1

<div class="deck">The architectural break: a per-group risk engine replaces the single global risk budget.</div>

<a class="btn" href="./">← Back to all four backtests</a>

## How it's built

Alpha 1 trades a pruned, 9-ticker universe split into four instrument groups: **aggressive leverage**
(TQQQ, SOXL, SPXL, TECL), **sector leverage** (ERX, XLF), **commodity** (GLD, DBC), and **defensive
income** (SHY). That grouping is the whole point of this configuration.

RiskBalance and Conservative both size their entire book off one global risk number — which means the
commodity sleeve and the aggressive-leverage sleeve are structurally fighting over the same budget. In a
stress regime, commodities *should* be near full deployment (a hedge) at the same moment aggressive
leverage should be near zero — but a single global budget can't hold both positions at once. Alpha 1
fixes that by giving each group its own budget: `regime base × the group's own momentum read × HMM
confidence × a volatility scalar`, computed independently. Commodity can sit at 100% budget in a
risk-off regime while aggressive leverage sits at 0%, simultaneously, correctly.

The regime-detection HMM here is tuned tighter than either RiskBalance or Conservative — the fastest of
the three configurations to stop believing a stale regime read once the market has actually turned. See
the [comparison table](./) for the size of the jump this made.

```js
display(runBacktestWidget("alpha1", "Alpha 1"))
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
  ...d.equity_curve.map(p => ({date: parseDate(p.date), series: "Alpha 1", value: (p.equity / startEquity) * 100})),
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
  color: {domain: ["Alpha 1", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
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
  {year: y, series: "Alpha 1", value: d.annual_returns[y].strategy * 100},
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
  color: {domain: ["Alpha 1", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.barY(barData, {x: "series", y: "value", fx: "year", fill: "series", tip: true}),
  ],
})
```

</div>

<div class="explainer">

### Reading this result

<p>Same weekly-Friday-rebalance harness and Sharpe methodology as RiskBalance and Conservative — the
jump you see here versus those two is a real architectural effect, not a change in how the numbers are
computed. Alpha 2 adds one more filter on top of this same per-group engine — see how it compares on
the [Alpha 2 page](./alpha2).</p>

</div>

<div class="stack">Data: Yahoo Finance · <span>Weekly rebalance</span> · hmmlearn-style Gaussian HMM · Generated ${new Date(d.generated_at).toUTCString()}</div>
