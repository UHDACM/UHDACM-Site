import { spawn } from "child_process";
import * as path from "path";
import { env_vars } from "../tools/env/envVars";

/**
 * Launches promptfoo with the environment it needs.
 *
 * Exists for three reasons:
 *  - The judge reads GOOGLE_API_KEY, but this project stores a rotating
 *    comma-separated list in GOOGLE_API_KEYS. Picking the key here avoids
 *    duplicating a secret in .env just to satisfy promptfoo.
 *  - EVAL_MODE must be on for queryAgentTraced to run at all. Forcing it here
 *    means the flag stays false in .env, so there is no way to accidentally
 *    leave tracing enabled on a normal `npm run dev`.
 *  - The judge has a hard per-day request cap. A run that starts (or lands)
 *    past it produces a wall of fake assertion failures, so both the preflight
 *    below and the mid-run watch abort loudly instead. See `quota` in readme.md.
 *
 * Any extra CLI args are passed straight through:
 *   npm run eval -- --filter-pattern leadership_present_fatima
 */

const configPath = path.join(__dirname, "promptfooconfig.yaml");

// Flash-tier by default. The pro-tier models share a 250 requests/day/project
// cap, and one full suite is ~91 judge calls — under three runs a day before
// grading silently collapses into timeouts. Deliberately NOT gemini-2.5-flash:
// that is the model under test, and the judge must not grade its own output
// class. gemini-flash-latest is a different generation, so the separation
// holds. `npm run eval:pro` overrides this for a final sign-off run.
const DEFAULT_JUDGE = "google:gemini-flash-latest";

const passthrough = process.argv.slice(2);

// Respect an explicit --grader; otherwise pin our default so the judge in use
// is always the one the preflight below actually validated.
const graderIdx = passthrough.indexOf("--grader");
const judgeSpec =
  graderIdx !== -1 ? passthrough[graderIdx + 1] ?? DEFAULT_JUDGE : DEFAULT_JUDGE;
const judgeArgs = graderIdx !== -1 ? [] : ["--grader", DEFAULT_JUDGE];

// promptfoo provider ids are "<vendor>:<model>"; the REST call wants the model.
const judgeModel = judgeSpec.replace(/^google:/, "");

const QUOTA_MARKERS = [
  "RESOURCE_EXHAUSTED",
  "exceeded your current quota",
  "GenerateRequestsPerDayPerProjectPerModel",
];

function formatReset(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? `~${h}h ${m}m` : `~${m}m`;
}

interface KeyProbe {
  key: string;
  ok: boolean;
  status?: string;
  detail?: string;
  resetSeconds?: number;
}

/**
 * One minimal generateContent call per key. Cheap, and it answers the only
 * question that matters before spending an hour: can this judge grade anything?
 */
async function probeKey(key: string): Promise<KeyProbe> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${judgeModel}:generateContent?key=${key}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] }),
      signal: AbortSignal.timeout(45_000),
    });

    if (res.ok) return { key, ok: true };

    const body = (await res.json().catch(() => ({}))) as any;
    const err = body?.error ?? {};
    const retry = (err.details ?? []).find((d: any) =>
      String(d["@type"]).endsWith("RetryInfo"),
    );
    const resetSeconds = retry
      ? parseInt(String(retry.retryDelay).replace("s", ""), 10)
      : undefined;

    return {
      key,
      ok: false,
      status: err.status ?? `HTTP ${res.status}`,
      detail: String(err.message ?? "").slice(0, 160),
      resetSeconds,
    };
  } catch (e) {
    return { key, ok: false, status: "NETWORK", detail: (e as Error).message };
  }
}

/**
 * Returns the first key whose judge quota is not exhausted.
 *
 * The cap is per project per model, so extra keys only add headroom when they
 * belong to different projects — keys on one project share a single pool.
 */
async function selectJudgeKey(): Promise<string> {
  const keys = env_vars.AI_APIKEYS;
  const probes: KeyProbe[] = [];

  for (const key of keys) {
    const probe = await probeKey(key);
    if (probe.ok) {
      if (probes.length) {
        console.error(
          `[eval] judge key ${probes.length + 1}/${keys.length} in use ` +
            `(${probes.length} exhausted).`,
        );
      }
      return key;
    }
    probes.push(probe);
  }

  const exhausted = probes.filter((p) => p.status === "RESOURCE_EXHAUSTED");
  const reset = probes.map((p) => p.resetSeconds).find(Boolean);

  console.error("\n" + "=".repeat(78));
  if (exhausted.length === probes.length && probes.length > 0) {
    console.error(`ABORTING: judge quota exhausted for ${judgeModel}.`);
    console.error(
      `  All ${probes.length} key(s) in GOOGLE_API_KEYS are over the ` +
        `per-day cap. Resets in ${formatReset(reset ?? NaN)}.`,
    );
    console.error(
      "\n  A full suite is ~91 judge calls. Options: wait for the reset, add a" +
        "\n  key from a different project, or run `npm run eval:fast` (no judge" +
        "\n  calls at all).",
    );
  } else {
    console.error(`ABORTING: judge ${judgeModel} is not usable.`);
    for (const p of probes) {
      console.error(`  ${p.status}: ${p.detail}`);
    }
  }
  console.error(
    "\n  Not aborting here would burn the per-test timeout on every case and" +
      "\n  report them as assertion failures rather than an infra problem.",
  );
  console.error("=".repeat(78) + "\n");
  process.exit(2);
}

async function main() {
  const judgeKey = await selectJudgeKey();

  const args = ["promptfoo", "eval", "-c", configPath, ...judgeArgs, ...passthrough];

  // promptfoo loads .ts config files (provider.ts, tests.ts, invariants.ts) with
  // `await import()`. It registers tsx/cjs first, but that only patches require —
  // the ESM loader still rejects a .ts extension. Registering tsx's ESM hook in
  // the child fixes it. tsx ships as a promptfoo dependency, so nothing extra is
  // installed. This also resolves the @shared/* tsconfig path alias that
  // provider.ts pulls in transitively via query.ts -> langchain.ts.
  const nodeOptions = [process.env.NODE_OPTIONS, "--import tsx"]
    .filter(Boolean)
    .join(" ");

  const child = spawn("npx", args, {
    env: {
      ...process.env,
      NODE_OPTIONS: nodeOptions,
      EVAL_MODE: "true",
      GOOGLE_API_KEY: judgeKey,

      // The corpus stores uhdacm.org URLs and rewriteFrontendUrls swaps them for
      // FRONTEND_ADDRESS, which is http://localhost:3000 in a dev .env. That made
      // the agent emit localhost links and the judge fail them as "not a real UHD
      // ACM page" — an artifact of local config, not agent behavior. Pinning the
      // real origin makes the rewrite a no-op and the scores machine-independent.
      FRONTEND_ADDRESS: "https://uhdacm.org",

      // The Gemini endpoint drops connections past ~2 in flight from here (a
      // 6-way parallel fetch to another host succeeds, so this is not a local
      // socket limit). promptfoo grades a test's assertions in parallel, so a
      // case with 5 rubrics would fire 5 judge calls at once and silently lose
      // some to "fetch failed" — which reads as an assertion failure, not an
      // infrastructure one. Serializing the judge is worth the wall-clock.
      PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY: "1",

      // Connections to the Gemini endpoint occasionally hang outright rather than
      // erroring. With concurrency pinned to 1 that stalls the whole run behind a
      // single socket — one observed run sat at 0% CPU for 34 minutes. A per-test
      // ceiling turns that into a reported failure instead of a hang.
      PROMPTFOO_EVAL_TIMEOUT_MS: "180000",
    },
    stdio: ["inherit", "pipe", "pipe"],
  });

  // Quota can also run out *mid-run* — the preflight only proves the first call
  // would have worked. Without this, the remaining cases each burn the per-test
  // timeout and land as failures, which is how a 22-case run took 66 minutes and
  // reported "Evaluation timed out" 22 times with the real cause invisible.
  let aborting = false;
  const watch = (chunk: Buffer, out: NodeJS.WriteStream) => {
    out.write(chunk);
    if (aborting) return;
    const text = chunk.toString();
    if (!QUOTA_MARKERS.some((m) => text.includes(m))) return;

    aborting = true;
    console.error("\n" + "=".repeat(78));
    console.error(`ABORTING: judge quota ran out mid-run (${judgeModel}).`);
    console.error(
      "  Results so far are incomplete. Remaining cases would each burn the" +
        "\n  180s per-test timeout and report as assertion failures.",
    );
    console.error("=".repeat(78) + "\n");
    child.kill("SIGTERM");
  };

  child.stdout.on("data", (c: Buffer) => watch(c, process.stdout));
  child.stderr.on("data", (c: Buffer) => watch(c, process.stderr));

  child.on("close", (code) => process.exit(aborting ? 2 : code ?? 1));
}

main().catch((e) => {
  console.error("FATAL:", (e as Error).message);
  process.exit(1);
});
