---
title: Regime-conditional leveraged-ETF strategy
---

<header class="proj-head">
<a class="back" href="/work">← All projects</a>
<p class="eyebrow">Professional work · Summr Capital Management · 2026</p>
<h1>Regime-conditional leveraged-ETF strategy</h1>
<p class="lead">Leveraged ETFs compound gains in calm trends and bleed value in choppy markets. This rules-based, weekly strategy holds leveraged exposure only when its regime read favours it, and rotates to commodities or short-term Treasuries otherwise.</p>
<div class="notice"><b>Hypothetical performance.</b> All figures come from a backtested simulation (3 January 2022 to 29 May 2026, 223 weekly observations, $2.5M notional). The strategy had not traded client or firm capital at the time. Hypothetical results are built with hindsight and do not indicate future returns. This page is not an offer or investment advice. The strategy's rules, parameters, signals, instruments and code are proprietary to Summr Capital Management and are not shown.</div>
<div class="skills">
<span class="k">Methods</span><span class="chips"><span class="chip m">Gaussian HMM regime detection</span><span class="chip m">Composite regime classification</span><span class="chip m">Per-group risk budgeting</span><span class="chip m">Walk-forward validation</span><span class="chip m">Deflated Sharpe Ratio</span><span class="chip m">Return diagnostics (Ljung–Box)</span></span>
<span class="k">Tools</span><span class="chips"><span class="chip">Python</span><span class="chip">pandas</span><span class="chip">hmmlearn</span></span>
<span class="k">Domain</span><span class="v">Systematic trading · leveraged ETFs · tactical asset allocation</span>
</div>
<div class="tiles">
<div class="tile"><div class="n">14.6%</div><div class="l">compound annual growth rate</div></div>
<div class="tile"><div class="n">−10.7%</div><div class="l">maximum drawdown, including the 2022 bear market</div></div>
<div class="tile"><div class="n">1.01</div><div class="l">Sharpe ratio, risk-free adjusted, before selection-bias correction</div></div>
<div class="tile"><div class="n">0.97</div><div class="l">walk-forward efficiency (out-of-sample Sharpe 0.98 against 1.01)</div></div>
</div>
</header>

<div class="proj-body">
<nav class="toc" aria-label="On this page">
<p class="eyebrow">On this page</p>
<a href="#the-idea">The idea</a>
<a href="#how-its-built">How it's built</a>
<a href="#results">Results</a>
<a href="#validation">Validation</a>
<a href="#limitations">Limitations</a>
</nav>
<div class="article">

## The idea

A 3× fund that resets daily loses about 3% a year to volatility drag when the index is flat at 10% volatility, and about 45% at 45% volatility. The usual answers are binary: hold these funds and absorb the drag, or avoid them. Both treat a regime-dependent property as a constant. If the regime can be read before the week starts, leverage can be held selectively.

## How it's built

A six-stage, fully rules-based pipeline runs once a week, with no discretionary override at any stage:

1. **Regime model.** A three-state Gaussian hidden Markov model reads the market state.
2. **Regime classifier.** A composite of market signals confirms or overrides it.
3. **Signal scoring.** Each instrument is scored within the regime.
4. **Risk budgeting.** Each instrument group gets its own risk budget.
5. **Portfolio construction.** Weights come from the scores and budgets.
6. **Risk governor.** Drawdown and exposure limits have the final say.

Thresholds, signals, instrument selection and sizing rules are proprietary and deliberately left out.

## Results

<figure>
<img src="../assets/fig/summr/drawdown.png" alt="Maximum drawdown: strategy −10.7% against about −25% for the S&amp;P 500, −35% for the Nasdaq-100 and −82% for a 3x Nasdaq-100 fund" loading="lazy">
<figcaption><b>Figure 1.</b> The strategy's full-period maximum drawdown against each benchmark's 2022 peak-to-trough decline. Benchmarks from public ETF data; comparison windows are approximate.</figcaption>
</figure>

This is not a higher-return strategy. Its 14.6% compound return is in line with holding the Nasdaq-100, at about one-third of its drawdown, and ahead of a 3× Nasdaq-100 fund's roughly 10.9% at about one-eighth of its drawdown.

## Validation

- **Walk-forward:** an out-of-sample Sharpe of 0.98 against 1.01 in-sample, so almost all of the edge held on unseen data.
- **Selection bias:** 35 configurations were tested, so the Sharpe ratio was deflated (Bailey and López de Prado, 2014). The Deflated Sharpe Ratio ranges from 0.97 to 0.45 depending on how widely the 35 results varied, a figure still to be measured.
- **Serial correlation:** a Ljung–Box p-value of 0.595 shows no autocorrelation inflating the Sharpe ratio.

## Limitations

- The out-of-sample window fell in a favourable regime.
- Benchmarks are compared on end-of-period aggregates, not week by week.
- Transaction costs, slippage and capacity still need confirmation before live trading.

<div class="role"><b>My role:</b> I designed and backtested the strategy in Python at Summr Capital Management. The code and full research paper are not public.</div>

<div class="pager"><a href="/projects/semester-at-sea">← Semester at Sea</a><a href="/quantitative-finance/geometry-of-risk/">Next: The Geometry of Risk →</a></div>

</div>
</div>
