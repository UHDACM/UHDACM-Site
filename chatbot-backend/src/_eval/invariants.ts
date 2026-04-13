import { AssertResult, parseProviderOutput } from "./providerOutput";

/**
 * Deterministic checks applied to every golden via defaultTest.
 *
 * These are free (no judge call) and cover the failure modes an LLM judge is
 * unreliable at: exact-string leakage and link grounding. The rubrics in
 * goldens.json handle everything that needs actual reading.
 */

// Same signature the manual battery in langchain/test-queryAgent.ts watches for:
// JSON, "collection:" prefixes, or the SOURCES header bleeding into the answer.
const RAW_LEAK = /("content"\s*:|page-\w+:|SOURCES \(reference)/i;

const RAW_URL = /https?:\/\//i;

export function noRawToolOutput(raw: unknown): AssertResult {
  const output = parseProviderOutput(raw);
  const hit = RAW_LEAK.exec(output.response);
  return hit
    ? {
        pass: false,
        score: 0,
        reason: `raw tool output leaked into response: ${JSON.stringify(hit[0])}`,
      }
    : { pass: true, score: 1, reason: "no raw tool output in response" };
}

export function noRawUrlInResponse(raw: unknown): AssertResult {
  // Nearly every golden rubric says "No raw links inline"; links belong in
  // relevant_actions. A regex enforces this far more reliably than a judge.
  const output = parseProviderOutput(raw);
  const hit = RAW_URL.exec(output.response);
  return hit
    ? {
        pass: false,
        score: 0,
        reason: `raw URL in response text (links belong in relevant_actions): ${JSON.stringify(
          output.response.slice(Math.max(0, hit.index - 20), hit.index + 60),
        )}`,
      }
    : { pass: true, score: 1, reason: "no raw URL in response text" };
}

export function actionsAreGrounded(raw: unknown): AssertResult {
  const output = parseProviderOutput(raw);
  const actions = output.relevant_actions ?? [];
  if (actions.length === 0) {
    return { pass: true, score: 1, reason: "no actions to ground" };
  }
  if (output.trace.toolCallCount === 0) {
    // No search happened, so there is no source to ground against. The golden's
    // own actions_min rubric decides whether a link was appropriate here.
    return {
      pass: true,
      score: 1,
      reason: "no search performed; grounding not applicable",
    };
  }

  const sources = output.trace.toolCalls.map((c) => c.output).join("\n");
  const invented = actions.filter((a) => !sources.includes(a.href));
  return invented.length
    ? {
        pass: false,
        score: 0,
        reason: `fabricated link(s) not present in any search result: ${invented
          .map((a) => a.href)
          .join(", ")}`,
      }
    : {
        pass: true,
        score: 1,
        reason: `all ${actions.length} action link(s) grounded in sources`,
      };
}

export function respectsSchemaLimits(raw: unknown): AssertResult {
  // Mirrors the .max(3) on both arrays in QueryResponseSchema (langchain.ts).
  const output = parseProviderOutput(raw);
  const problems: string[] = [];
  if ((output.relevant_actions ?? []).length > 3) {
    problems.push(`${output.relevant_actions.length} relevant_actions (max 3)`);
  }
  if ((output.quick_replies ?? []).length > 3) {
    problems.push(`${output.quick_replies.length} quick_replies (max 3)`);
  }
  return problems.length
    ? { pass: false, score: 0, reason: problems.join("; ") }
    : { pass: true, score: 1, reason: "within schema limits" };
}
