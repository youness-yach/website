---
title: Leveraged-ETF Regime Strategy
toc: false
---

<span class="stamp">Quant · Systematic strategy</span>

# Leveraged-ETF regime strategy

<span class="deck">Summr Capital Management · in development</span>

A systematic strategy that shifts exposure across leveraged ETFs based on a hidden-Markov
regime signal. The premise: leveraged products are punishing in choppy, mean-reverting regimes
and generous in trending ones — so the entire edge lives in **knowing which regime you're
standing in**, not in the entry rule.

<div class="facts">
  <div><dt>Max drawdown</dt><dd class="g">&lt; 10%</dd></div>
  <div><dt>Annualised</dt><dd class="g">10%+</dd></div>
  <div><dt>Sharpe</dt><dd class="a">0.3</dd></div>
  <div><dt>Status</dt><dd>Forward optimisation</dd></div>
</div>

<div class="note">
<b>Labelled honestly</b>
These are <strong>backtest</strong> figures, not live results. The strategy is in forward
optimisation targeting 1.0+ Sharpe and ~15% CAGR before any capital is committed. A 0.3 Sharpe
is not a deployable strategy and I'm not going to pretend otherwise.
</div>

<div class="stack">Python · <span>hmmlearn</span> · pandas · vectorised backtesting</div>
