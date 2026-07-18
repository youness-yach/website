---
title: Leveraged-ETF Regime Strategy
head: '<meta name="description" content="A systematic regime-detection strategy for leveraged ETFs — four configurations on one shared engine, one backtest methodology, directly comparable. Run any of them fresh."><script type="module" src="/shell.js"></script>'
toc: false
---

```js
const riskbalance = FileAttachment("./data/riskbalance.json").json();
const conservative = FileAttachment("./data/conservative.json").json();
const alpha1 = FileAttachment("./data/alpha1.json").json();
const alpha2 = FileAttachment("./data/alpha2.json").json();
```

<div class="stamp">Quant · Systematic strategy</div>

# Leveraged-ETF regime strategy

<div class="deck">Four configurations, one engine, one backtest methodology — directly comparable, each one re-runnable on demand.</div>

A systematic strategy that shifts exposure across leveraged ETFs based on a hidden-Markov regime
signal: leveraged products are punishing in choppy, mean-reverting markets and generous in trending
ones, so most of the edge lives in **knowing which regime you're standing in**, not in the entry rule.
Every configuration below shares the same regime detector, the same weekly-Friday rebalance, and the
same performance methodology — the only thing that differs is each config's own risk-sizing and
gating logic, so the numbers are directly comparable rather than four separate stories.

<div class="facts">
  <div><dt>Backtest window</dt><dd>2021 – today</dd></div>
  <div><dt>Rebalance</dt><dd>Weekly, Friday close</dd></div>
  <div><dt>Universe</dt><dd>Leveraged &amp; sector ETFs</dd></div>
  <div><dt>Best Sharpe</dt><dd class="g">Alpha 2</dd></div>
</div>

<div class="note">
<b>Backtest, not live</b>
Every figure on this page is a backtest result. None of these configurations are trading real capital.
The code and market data behind them are private — this page and the four backtest pages it links to
show computed performance only.
</div>

## Backtests

Pick one to see how it's built and its full result — including a button to re-run it fresh, right now,
against today's data.

```js
const cards = [
  {href: "./riskbalance", tag: "Early · Widest universe", label: "RiskBalance", sub: "No structural gating — every ticker competes on raw momentum score.", data: riskbalance},
  {href: "./conservative", tag: "Early · Rate-hedged", label: "Conservative", sub: "Adds a leveraged rate hedge and a stickier regime read.", data: conservative},
  {href: "./alpha1", tag: "Current · Per-group risk engine", label: "Alpha 1", sub: "Each instrument group manages its own risk budget independently.", data: alpha1},
  {href: "./alpha2", tag: "Current · + trend context", label: "Alpha 2", sub: "Adds a 200-day trend filter so brief pullbacks don't get mistaken for reversals.", data: alpha2},
];

display(html`<div class="bt-grid">${cards.map(c => html`
  <a class="bt-card" href="${c.href}">
    <div class="bt-tag">${c.tag}</div>
    <h3>${c.label}</h3>
    <div class="bt-sub">${c.sub}</div>
    <div class="bt-preview">
      <div><dt>CAGR</dt><dd>${(c.data.metrics.cagr * 100).toFixed(1)}%</dd></div>
      <div><dt>Sharpe</dt><dd>${c.data.metrics.sharpe_ratio.toFixed(2)}</dd></div>
      <div><dt>Max DD</dt><dd>${(c.data.metrics.max_drawdown * 100).toFixed(1)}%</dd></div>
    </div>
    <div class="bt-cta">View &amp; run backtest →</div>
  </a>`)}
</div>`)
```

## Side by side

```js
function fmtPct(v) { return v === null || v === undefined ? "—" : `${(v * 100).toFixed(1)}%`; }
function fmtNum(v, d = 2) { return v === null || v === undefined ? "—" : v.toFixed(d); }

const rows = [
  {label: "CAGR", get: d => d.metrics.cagr, fmt: fmtPct, best: "max"},
  {label: "Max Drawdown", get: d => d.metrics.max_drawdown, fmt: fmtPct, best: "min-abs"},
  {label: "Sharpe Ratio", get: d => d.metrics.sharpe_ratio, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Sortino Ratio", get: d => d.metrics.sortino_ratio, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Alpha (annualized)", get: d => d.benchmark.alpha_annualized, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Win Rate", get: d => d.trade_statistics.win_rate, fmt: fmtPct, best: "max"},
  {label: "Profit Factor", get: d => d.trade_statistics.profit_factor, fmt: v => fmtNum(v, 2), best: "max"},
  {label: "Total Trades", get: d => d.trade_statistics.total_closed_trades, fmt: v => v, best: null},
];

const configs = [
  {label: "RiskBalance", data: riskbalance},
  {label: "Conservative", data: conservative},
  {label: "Alpha 1", data: alpha1, curr: true},
  {label: "Alpha 2", data: alpha2, curr: true},
];

function bestIndex(row) {
  if (!row.best) return -1;
  const vals = configs.map(c => row.get(c.data));
  if (row.best === "max") return vals.indexOf(Math.max(...vals));
  if (row.best === "min-abs") return vals.indexOf(vals.reduce((a, b) => Math.abs(a) < Math.abs(b) ? a : b));
  return -1;
}

display(html`<div class="bt-table-wrap"><table class="bt-table">
  <thead><tr><th>Metric</th>${configs.map(c => html`<th class="${c.curr ? "curr" : ""}">${c.label}</th>`)}</tr></thead>
  <tbody>
    ${rows.map(row => {
      const bi = bestIndex(row);
      return html`<tr><td>${row.label}</td>${configs.map((c, i) => html`<td class="${i === bi ? "best" : ""}">${row.fmt(row.get(c.data))}</td>`)}</tr>`;
    })}
  </tbody>
</table></div>`)
```

<div class="stack">Highlighted cells mark the best result for that metric across all four configurations.</div>

## How they differ

The project runs in two generations, not a straight improvement chain — RiskBalance and Conservative
were two parallel experiments testing different questions, and Alpha 1 is the real architectural break
from both of them.

- **RiskBalance** — the widest tradable universe, no structural pre-filter on any position. The
  question it answers: does casting a wide net generate better risk-adjusted return than a narrow one?
  Under a single global risk budget, mostly not — but it holds up better than a narrower, more gated
  book once everything is compared on the same footing.
- **Conservative** — RiskBalance's universe plus a leveraged rate hedge, and a deliberately stickier
  regime read (slower to change its mind about which state the market is in). Trades some
  responsiveness for a smoother ride.
- **Alpha 1** — the actual breakthrough. RiskBalance and Conservative both size the *entire* book off
  one global risk number, which means a single group can't be at full deployment while another sits at
  zero — they're fighting over the same budget. Alpha 1 replaces that with a per-group risk engine:
  aggressive leverage, sector leverage, commodities, and defensive income each get their own
  independently-sized budget, driven by the regime signal and a hidden-Markov confidence read.
- **Alpha 2** — Alpha 1 plus one addition: a 200-day trend filter. When the market is in a confirmed
  uptrend, a brief pullback no longer gets misread as a regime reversal and doesn't zero out the
  highest-conviction positions for no reason.

<div class="stack">Python · <span>hmmlearn</span> · pandas · vectorised backtesting · re-run on demand via GitHub Actions</div>
