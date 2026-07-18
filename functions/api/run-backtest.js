// Cloudflare Pages Function — POST /api/run-backtest
//
// Triggers the "run-backtest.yml" GitHub Actions workflow on the website
// repo for a given config. Holds the GitHub dispatch token server-side
// (env.GITHUB_DISPATCH_TOKEN, set via `wrangler pages secret put`) — never
// exposed to the browser. A visitor-facing trigger can't safely embed a
// token with repo write access, so this function is the only thing that
// actually holds it.
//
// Cooldown: uses the Workers Cache API as a zero-setup rate limiter — one
// trigger per config per COOLDOWN_SECONDS, regardless of visitor. This is
// deliberately simple (no KV namespace to provision) since traffic here is
// expected to be low; the per-visitor "already ran" gate is handled
// client-side (localStorage) alongside this.

const VALID_CONFIGS = new Set(["riskbalance", "conservative", "alpha1", "alpha2"]);
const COOLDOWN_SECONDS = 600; // 10 minutes between triggers of the same config
const REPO = "youness-yach/website";
const WORKFLOW_FILE = "run-backtest.yml";

function cacheKeyFor(config) {
  return new Request(`https://internal.cooldown/run-backtest/${config}`);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  const config = body && body.config;
  if (!VALID_CONFIGS.has(config)) {
    return json({ ok: false, error: "unknown_config" }, 400);
  }

  const cache = caches.default;
  const key = cacheKeyFor(config);
  const cached = await cache.match(key);
  if (cached) {
    return json({
      ok: false,
      error: "cooldown",
      message: "This backtest was already triggered recently — check back in a few minutes.",
    }, 429);
  }

  const token = env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    return json({ ok: false, error: "not_configured" }, 500);
  }

  const dispatchRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "leveraged-etf-strategy-site",
      },
      body: JSON.stringify({ ref: "main", inputs: { config } }),
    }
  );

  if (!dispatchRes.ok) {
    const detail = await dispatchRes.text().catch(() => "");
    return json({ ok: false, error: "dispatch_failed", detail }, 502);
  }

  // Mark this config as cooling down. Store a trivial response with a
  // matching Cache-Control so cache.match() above naturally expires it.
  const marker = new Response("1", {
    headers: { "Cache-Control": `max-age=${COOLDOWN_SECONDS}` },
  });
  await cache.put(key, marker);

  return json({ ok: true, config, triggered_at: new Date().toISOString() });
}

export async function onRequestGet() {
  return json({ ok: false, error: "use_post" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
