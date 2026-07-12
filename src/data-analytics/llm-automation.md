---
title: LLM Workflow Automation
toc: false
---

<span class="stamp">Analytics · Applied AI</span>

# LLM workflow automation

<span class="deck">Phronesis Advisory · 2025</span>

Built LLM-powered automation for SME client workflows — the unsexy category of AI work where
the win is measured in **hours of manual data entry that stop happening**, not in
demos.

## The pattern

- Find the step where a human is retyping something a machine already knows
- Wrap it in a pipeline with validation, so the automation fails loudly rather than silently
- Hand it over in a form the client can maintain without me

The engineering lesson carried straight into trading infrastructure: a pipeline that fails
quietly is worse than no pipeline at all.

<div class="stack">Python · <span>LLM APIs</span> · workflow automation</div>
