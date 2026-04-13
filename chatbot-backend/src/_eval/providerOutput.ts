import { AgentTrace } from "../langchain/langchain";

/**
 * What provider.ts returns as `output`, and how to read it safely.
 *
 * promptfoo serializes an object `output` to a JSON string somewhere between
 * the provider and the assertions, so an assertion that assumes an object gets
 * a string instead. That failure is silent and dangerous: `output.response` on
 * a string is `undefined`, and a check like `/leak/.exec(undefined)` then
 * "passes" without ever looking at the answer.
 *
 * defaultTest.options.transform in promptfooconfig.yaml parses it back before
 * assertions run. parseProviderOutput is the belt-and-braces second layer, so a
 * change in promptfoo's serialization can never turn an assertion into a
 * vacuous pass.
 */
export interface ProviderOutput {
  response: string;
  relevant_actions: { label: string; href: string }[];
  quick_replies: { label: string; value: string }[];
  trace: AgentTrace;
}

export type AssertResult = { pass: boolean; score: number; reason: string };

export function parseProviderOutput(output: unknown): ProviderOutput {
  const parsed = typeof output === "string" ? JSON.parse(output) : output;

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`provider output was not an object: ${typeof output}`);
  }
  const candidate = parsed as Partial<ProviderOutput>;
  if (typeof candidate.response !== "string" || !candidate.trace) {
    // Fail loud rather than let an assertion silently grade nothing.
    throw new Error(
      `provider output missing response/trace — got keys: ${Object.keys(candidate).join(", ")}`,
    );
  }
  return candidate as ProviderOutput;
}
