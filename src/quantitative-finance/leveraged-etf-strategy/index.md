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

```js
display(html`<div class="facts">
  <div><dt>Backtest window</dt><dd>${alpha2.period.start} → ${alpha2.period.end}</dd></div>
  <div><dt>Rebalance</dt><dd>Weekly, Friday close</dd></div>
  <div><dt>Universe</dt><dd>Leveraged &amp; sector ETFs</dd></div>
  <div><dt>Best Sharpe</dt><dd class="g">Alpha 2</dd></div>
</div>`)
```

<div class="note">
<b>Backtest, not live</b>
Every figure on this page is a backtest result. None of these configurations are trading real capital.
The code and market data behind them are private — this page and the four backtest pages it links to
show computed performance only.
</div>

## The engine

All four configurations run on the same regime detector, the same weekly-Friday rebalance loop, and
the same fee/slippage model. What actually differs between them is layered on top of that shared
core — not a uniform five-layer stack, but two genuinely different approaches to risk sizing and
drawdown protection that this page's numbers let you compare directly.

<div class="layer-grid">
  <div class="layer-card">
    <div class="layer-label">Shared · Layer 01</div>
    <h3>Regime &amp; signal</h3>
    <ul>
      <li>Macro score reads SPY/QQQ/DIA trend, semiconductor leadership, EM stress, dollar strength, rate direction, credit spread, and choppiness into one of six regimes (RISK_ON, RISK_ON_EXTENDED, NEUTRAL, RISK_OFF, CRISIS, OVERSOLD_REBOUND)</li>
      <li>Per-ticker score: trend + volume-weighted momentum + intraday momentum + relative strength vs SPY/QQQ − a volatility penalty, then regime-adjusted</li>
      <li>3-state Gaussian HMM on rolling SPY returns feeds a confidence read into position sizing</li>
      <li>Alpha 2 adds one thing on top: when SPY is above its 200-day average, a would-be risk-off read floors to neutral instead — the only config with this context filter</li>
    </ul>
  </div>
  <div class="layer-card">
    <div class="layer-label">Differs · Layer 02</div>
    <h3>Risk sizing</h3>
    <ul>
      <li><b>RiskBalance &amp; Conservative</b> size the entire book off one global risk number — a single risk posture chosen from 10 discrete states, applied across every position at once</li>
      <li><b>Alpha 1 &amp; Alpha 2</b> replace that with a per-group engine: aggressive leverage, sector leverage, commodities, and defensive income each get their own independently-computed budget</li>
      <li>The practical difference: a global budget can't send commodities to full deployment while aggressive leverage sits at zero — they're fighting over the same number. A per-group budget can do exactly that</li>
    </ul>
  </div>
  <div class="layer-card">
    <div class="layer-label">Differs · Layer 03</div>
    <h3>Drawdown protection</h3>
    <ul>
      <li><b>RiskBalance &amp; Conservative</b> hard-block all trading past a drawdown threshold, then reanchor the peak-equity high-water mark once de-risked — without this they can lock into cash permanently, since a 100%-cash book never moves and drawdown-from-peak never shrinks</li>
      <li><b>Alpha 1 &amp; Alpha 2</b> never built this failure mode in the first place — a per-group budget can independently de-risk one group without forcing the whole book to zero, so there's nothing to get stuck in</li>
    </ul>
  </div>
</div>

## Backtests

Pick one to see how it's built and its full result — including a button to re-run it fresh, right now.

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

const table = [
  {label: "RiskBalance", data: riskbalance, universe: "14 tickers", arch: "Global budget", ctx: "None"},
  {label: "Conservative", data: conservative, universe: "15 tickers", arch: "Global budget", ctx: "None"},
  {label: "Alpha 1", data: alpha1, universe: "9 tickers", arch: "Per-group Nexis", ctx: "None", curr: true},
  {label: "Alpha 2", data: alpha2, universe: "9 tickers", arch: "Per-group Nexis", ctx: "200d EMA filter", curr: true},
];

const rows = [
  {label: "CAGR", get: c => c.data.metrics.cagr, fmt: fmtPct, best: "max"},
  {label: "Total Return", get: c => c.data.metrics.total_return, fmt: fmtPct, best: "max"},
  {label: "Max Drawdown", get: c => c.data.metrics.max_drawdown, fmt: fmtPct, best: "min-abs"},
  {label: "DD Recovery (days)", get: c => c.data.metrics.max_drawdown_duration_days, fmt: v => v, best: "min"},
  {label: "Sharpe Ratio", get: c => c.data.metrics.sharpe_ratio, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Sortino Ratio", get: c => c.data.metrics.sortino_ratio, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Calmar Ratio", get: c => c.data.metrics.calmar_ratio, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Prob. Sharpe (PSR)", get: c => c.data.metrics.probabilistic_sharpe_ratio, fmt: fmtPct, best: "max"},
  {label: "Alpha (annualized)", get: c => c.data.benchmark.alpha_annualized, fmt: v => fmtNum(v, 3), best: "max"},
  {label: "Beta", get: c => c.data.benchmark.beta, fmt: v => fmtNum(v, 2), best: null},
  {label: "Win Rate", get: c => c.data.trade_statistics.win_rate, fmt: fmtPct, best: "max"},
  {label: "Profit Factor", get: c => c.data.trade_statistics.profit_factor, fmt: v => fmtNum(v, 2), best: "max"},
  {label: "R:R Ratio", get: c => c.data.trade_statistics.profit_loss_ratio, fmt: v => fmtNum(v, 2), best: null},
  {label: "Total Trades", get: c => c.data.trade_statistics.total_closed_trades, fmt: v => v, best: null},
  {label: "Trade Universe", get: c => c.universe, fmt: v => v, best: null},
  {label: "Risk Architecture", get: c => c.arch, fmt: v => v, best: null},
  {label: "Bull-Trend Context", get: c => c.ctx, fmt: v => v, best: null},
  {label: "2023 Performance", get: c => c.data.annual_returns["2023"].strategy, fmt: fmtPct, best: "max"},
  {label: "2024 Performance", get: c => c.data.annual_returns["2024"].strategy, fmt: fmtPct, best: "max"},
  {label: "2025 Performance", get: c => c.data.annual_returns["2025"].strategy, fmt: fmtPct, best: "max"},
  {label: "2026 Performance*", get: c => c.data.annual_returns["2026"].strategy, fmt: fmtPct, best: "max"},
];

function bestIndex(row) {
  if (!row.best) return -1;
  const vals = table.map(row.get);
  if (row.best === "max") return vals.indexOf(Math.max(...vals));
  if (row.best === "min") return vals.indexOf(Math.min(...vals));
  if (row.best === "min-abs") return vals.indexOf(vals.reduce((a, b) => Math.abs(a) < Math.abs(b) ? a : b));
  return -1;
}

display(html`<div class="bt-table-wrap"><table class="bt-table">
  <thead><tr><th>Metric</th>${table.map(c => html`<th class="${c.curr ? "curr" : ""}">${c.label}</th>`)}</tr></thead>
  <tbody>
    ${rows.map(row => {
      const bi = bestIndex(row);
      return html`<tr><td>${row.label}</td>${table.map((c, i) => html`<td class="${i === bi ? "best" : ""}">${row.fmt(row.get(c))}</td>`)}</tr>`;
    })}
  </tbody>
</table></div>`)
```

<div class="stack">Highlighted cells mark the best result for that metric across all four configurations. * 2026 figure is partial-year, through this page's backtest window end date above.</div>

## The development arc

RiskBalance and Conservative are two parallel experiments on the same global-budget architecture, not
early steps in a straight improvement chain. Alpha 1 is the real architectural break from both of
them, and Alpha 2 is one further refinement on Alpha 1.

- **RiskBalance** — the widest tradable universe, no structural pre-filter on any position. The
  question it answers: does casting a wide net generate better risk-adjusted return than a narrower,
  more defensive one? Here, yes — RiskBalance edges out Conservative on CAGR, Sharpe, and Sortino
  despite having neither the rate hedge nor the sticky regime read.
- **Conservative** — RiskBalance's universe plus a leveraged rate hedge (TMF) and a deliberately
  stickier regime read (slower to change its mind about which state the market is in). The intent was
  a smoother ride; in this window it costs return without actually reducing max drawdown versus
  RiskBalance.

<div class="note">
<b>The architecture leap</b>
RiskBalance and Conservative both size the entire book off one global risk number — a single group
can't be at full deployment while another sits at zero, because they're fighting over the same budget.
Alpha 1 replaces that with a per-group engine: aggressive leverage, sector leverage, commodities, and
defensive income each get their own independently-sized budget. The clearest evidence it works isn't
the raw Sharpe ratio — RiskBalance's is respectable once its own drawdown-recovery bug is fixed — it's
everything downstream of risk quality: Alpha 1 recovers from a drawdown in about half the time (364
days vs. 637-644), wins on roughly 74% of trades instead of ~55%, and gets there with almost half as
many trades.
</div>

- **Alpha 1** — the per-group Nexis engine described above. Best Calmar ratio, shortest drawdown
  recovery, and highest win rate of any configuration at this point in the arc.
- **Alpha 2** — Alpha 1 plus one addition: a 200-day trend filter. When the market is in a confirmed
  uptrend, a brief pullback no longer gets misread as a regime reversal and doesn't zero out the
  highest-conviction positions for no reason. The result is a further, incremental improvement on
  every headline metric — CAGR, Sharpe, Calmar, and win rate all move up again, at the cost of a
  slightly deeper max drawdown than Alpha 1's.

<div class="explainer">

### A note on methodology

<p>These four numbers are directly comparable because they're computed the same way: same offline
weekly-rebalance harness, same Sharpe/Sortino/Calmar formulas, same fee and slippage model, same
2022-to-present window. That wasn't always true of this project's earlier public materials, which
mixed a QuantConnect daily-resolution backtester (for the earlier configurations) with this offline
weekly-resolution one (for Alpha 1/2) — a real methodology difference that inflated the apparent gap
between generations. Recomputing everything on one methodology also surfaced a real bug: an earlier
version of this page's RiskBalance/Conservative numbers reflected a permanent cash-lockout state that
the original strategy code had actually already fixed historically. Both are corrected here.</p>

</div>

<div class="note">
<b>Backtest disclaimer</b>
All figures on this page are backtest results computed on historical market data through the window
end date above, not live trading performance. None of these configurations are trading real capital.
Leveraged ETFs (3× daily rebalancing) carry real volatility drag in non-trending markets, which these
backtests capture through weekly rebalancing, transaction costs, and slippage modelling — not live
execution frictions, which can differ. Past simulated performance does not guarantee future results.
This page and the four backtest pages it links to are for informational purposes only.
</div>

<div class="stack">Python · <span>hmmlearn</span> · pandas · vectorised backtesting · re-run on demand via GitHub Actions</div>
