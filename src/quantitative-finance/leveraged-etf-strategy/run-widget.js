// Shared "Run this backtest" widget used on all four config pages.
//
// Clicking the button POSTs to /api/run-backtest (a Cloudflare Pages
// Function that holds the GitHub dispatch token server-side and triggers
// the run-backtest.yml workflow). That workflow re-runs the strategy
// against the market data already committed in the private repo and
// redeploys the site as a brand new static build — which means the
// freshly-computed JSON gets a new content-hashed URL. The page you're
// looking at can't hot-swap that data, so once the workflow finishes we
// just reload the page, and Observable's build picks up the new file
// automatically.
//
// One run per visitor per config, tracked via localStorage — soft and
// resettable by design, since this is a low-traffic personal site, not a
// hardened rate limiter (the server-side cooldown in the Function is the
// real backstop).

const REPO = "youness-yach/website";
const WORKFLOW_FILE = "run-backtest.yml";
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 5 * 60_000;

function storageKey(config) {
  return `bt-run-${config}`;
}

export function runBacktestWidget(config, label) {
  const root = document.createElement("div");
  root.className = "run-panel";

  const info = document.createElement("div");
  info.className = "run-info";
  info.innerHTML = `<b>Run ${label} fresh</b> — re-runs this exact backtest against the current data. Takes about a minute.`;

  const action = document.createElement("div");
  action.className = "run-action";

  const button = document.createElement("button");
  button.className = "btn solid";
  button.textContent = "Run this backtest";

  const status = document.createElement("div");
  status.className = "run-status";
  status.style.display = "none";

  action.appendChild(button);
  action.appendChild(status);
  root.appendChild(info);
  root.appendChild(action);

  const alreadyRan = localStorage.getItem(storageKey(config));
  if (alreadyRan) {
    setIdleUsed(button, status, alreadyRan);
  }

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Starting…";
    showStatus(status, "", "Sending request…");

    let res;
    try {
      res = await fetch("/api/run-backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
    } catch {
      button.disabled = false;
      button.textContent = "Run this backtest";
      showStatus(status, "err", "Couldn't reach the trigger — try again in a moment.");
      return;
    }

    let data = {};
    try {
      data = await res.json();
    } catch {
      // ignore — handled by ok check below
    }

    if (data.ok) {
      const now = Date.now();
      localStorage.setItem(storageKey(config), String(now));
      button.textContent = "Running…";
      showStatus(status, "run", "Backtest is running — please wait for results. This page will refresh automatically.");
      pollForCompletion(now, status);
    } else if (data.error === "cooldown") {
      localStorage.setItem(storageKey(config), String(Date.now()));
      button.disabled = true;
      button.textContent = "Already running";
      showStatus(status, "amber", data.message || "Someone already triggered this recently — check back in a few minutes.");
    } else {
      button.disabled = false;
      button.textContent = "Run this backtest";
      showStatus(status, "err", "Something went wrong triggering the run — try again.");
    }
  });

  return root;
}

function setIdleUsed(button, status, timestamp) {
  button.disabled = true;
  button.textContent = "Already run";
  const when = new Date(Number(timestamp));
  showStatus(status, "", `You triggered a run at ${when.toLocaleString()}. Refresh the page to see the latest result.`);
}

function showStatus(el, cls, message) {
  el.className = `run-status ${cls}`;
  el.style.display = "flex";
  const dotClass = cls === "run" ? "dot amber" : cls === "err" ? "" : "dot amber";
  el.innerHTML = cls === "run" || cls === "amber"
    ? `<i class="${dotClass}"></i><span>${message}</span>`
    : `<span>${message}</span>`;
}

async function pollForCompletion(triggeredAtMs, status) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  const triggeredAt = new Date(triggeredAtMs - 15_000); // small buffer for clock skew

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=5`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (res.ok) {
        const data = await res.json();
        const run = (data.workflow_runs || []).find(
          (r) => r.event === "workflow_dispatch" && new Date(r.created_at) >= triggeredAt
        );
        if (run && run.status === "completed") {
          showStatus(status, "ok", "Done — refreshing…");
          await sleep(6_000); // let the CDN catch up with the new deploy
          location.reload();
          return;
        }
      }
    } catch {
      // transient — keep polling
    }
  }

  showStatus(status, "amber", "Still finishing — refresh this page in a bit to see the result.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
