---
title: The Geometry of Risk
toc: false
---

<span class="stamp">Quant · Flagship research</span>

# The Geometry of Risk

<span class="deck">Reading systemic stress before it prints</span>

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
