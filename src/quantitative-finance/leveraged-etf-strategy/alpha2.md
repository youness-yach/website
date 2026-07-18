---
title: Alpha 2 — Leveraged-ETF Regime Strategy
head: '<meta name="description" content="Alpha 2: the Alpha 1 per-group risk engine plus a 200-day trend filter, the current best-performing configuration."><script type="module" src="/shell.js"></script>'
toc: false
---

```js
import {runBacktestWidget} from "./run-widget.js";
const d = FileAttachment("./data/alpha2.json").json();
```

<div class="stamp">Quant · Leveraged-ETF regime strategy · Current best</div>

# Alpha 2

<div class="deck">Alpha 1's per-group engine, plus a trend filter so a pullback in a bull market isn't read as a reversal.</div>

<a class="btn" href="./">← Back to all four backtests</a>

## How it's built

Alpha 2 trades the exact same 9-ticker, 4-group universe as [Alpha 1](./alpha1), on the same per-group
risk engine. The one addition: a 200-day trend filter.

Without it, Alpha 1's regime detector has no sense of where the market sits on a long-run trend — a
genuine reversal and a brief, healthy pullback inside an ongoing rally can look identical to a
short-window signal, and both get treated the same way (aggressive leverage cut to zero). Alpha 2 adds
context: when SPY is trading above its 200-day average, a regime read that would otherwise flip to
risk-off gets floored to neutral instead — unless the underlying score is bad enough to signal a real
crash, not just a dip. The same trend check also loosens the choppiness gate and the per-ticker momentum
gate slightly, but only while that longer-run uptrend actually holds.

It's a small, conditional addition on top of Alpha 1's architecture, not a new engine — and it's the
current best-performing configuration on every metric that matters. See the
[comparison table](./) for the full picture.

```js
display(runBacktestWidget("alpha2", "Alpha 2"))
```

```js
const m = d.metrics, b = d.benchmark, t = d.trade_statistics;
display(html`<div class="facts">
  <div><dt>CAGR</dt><dd class="g">${(m.cagr*100).toFixed(2)}%</dd></div>
  <div><dt>Max Drawdown</dt><dd>${(m.max_drawdown*100).toFixed(2)}%</dd></div>
  <div><dt>Sharpe / Sortino</dt><dd>${m.sharpe_ratio.toFixed(3)} / ${m.sortino_ratio.toFixed(3)}</dd></div>
  <div><dt>Alpha (ann.)</dt><dd class="g">${b.alpha_annualized.toFixed(3)}</dd></div>
  <div><dt>Win Rate</dt><dd>${(t.win_rate*100).toFixed(1)}%</dd></div>
  <div><dt>Profit Factor</dt><dd>${t.profit_factor.toFixed(2)}×</dd></div>
  <div><dt>Trades</dt><dd>${t.total_closed_trades}</dd></div>
  <div><dt>Period</dt><dd>${d.period.start} → ${d.period.end}</dd></div>
</div>`)
```

```js
const years = Object.keys(d.annual_returns).sort();
const barData = years.flatMap(y => [
  {year: y, series: "Alpha 2", value: d.annual_returns[y].strategy * 100},
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
  color: {domain: ["Alpha 2", "SPY"], range: ["#3FE38C", "#7B8783"], legend: true},
  marks: [
    Plot.ruleY([0], {stroke: "#1C2323"}),
    Plot.barY(barData, {x: "series", y: "value", fx: "year", fill: "series", tip: true}),
  ],
})
```

</div>

<div class="explainer">

### Reading this result

<p>Same weekly-Friday-rebalance harness and Sharpe methodology as the other three — directly comparable
across the board. The trend filter's effect shows up most in years with a sharp intra-trend pullback:
compare this chart's shape against [Alpha 1's](./alpha1) year by year.</p>

</div>

<div class="stack">Data: Yahoo Finance · <span>Weekly rebalance</span> · hmmlearn-style Gaussian HMM · Generated ${new Date(d.generated_at).toUTCString()}</div>
