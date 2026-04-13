import { spawnSync } from "child_process";
import * as path from "path";
import { env_vars } from "../tools/env/envVars";

/**
 * Launches promptfoo with the environment it needs.
 *
 * Exists for two reasons:
 *  - The judge (google:gemini-2.5-pro) reads GOOGLE_API_KEY, but this project
 *    stores a rotating comma-separated list in GOOGLE_API_KEYS. Deriving the key
 *    here avoids duplicating a secret in .env just to satisfy promptfoo.
 *  - EVAL_MODE must be on for queryAgentTraced to run at all. Forcing it here
 *    means the flag stays false in .env, so there is no way to accidentally
 *    leave tracing enabled on a normal `npm run dev`.
 *
 * Any extra CLI args are passed straight through:
 *   npm run eval -- --filter-description leadership_present_fatima
 */

const configPath = path.join(__dirname, "promptfooconfig.yaml");

const args = ["eval", "-c", configPath, ...process.argv.slice(2)];

// promptfoo loads .ts config files (provider.ts, tests.ts, invariants.ts) with
// `await import()`. It registers tsx/cjs first, but that only patches require —
// the ESM loader still rejects a .ts extension. Registering tsx's ESM hook in
// the child fixes it. tsx ships as a promptfoo dependency, so nothing extra is
// installed. This also resolves the @shared/* tsconfig path alias that
// provider.ts pulls in transitively via query.ts -> langchain.ts.
const nodeOptions = [process.env.NODE_OPTIONS, "--import tsx"]
  .filter(Boolean)
  .join(" ");

const result = spawnSync("npx", ["promptfoo", ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
    EVAL_MODE: "true",
    GOOGLE_API_KEY: env_vars.AI_APIKEYS[0],

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
});

process.exit(result.status ?? 1);
