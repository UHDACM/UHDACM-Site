import { AssertResult, parseProviderOutput } from "./providerOutput";
import { GradingSpec, loadGoldens } from "./types";

/**
 * Turns goldens.json into promptfoo test cases.
 *
 * Each golden's grading specs are mapped to assertions that aim at a specific
 * slice of the provider's output via per-assertion `transform`:
 *
 *   lookup.tool_query   -> the query the model passed to the search tool
 *   lookup.tool_output  -> what the search tool handed back
 *   response.answer.*   -> the user-facing answer, actions, and quick replies
 *
 * On top of those, every case inherits the deterministic invariants in
 * promptfooconfig.yaml's defaultTest — those cost nothing and catch the things a
 * judge is unreliable at (raw output leaking, invented links).
 */

const TOOL_QUERIES = "output.trace.toolCalls.map(c => c.query).join('\\n')";
const TOOL_OUTPUTS = "output.trace.toolCalls.map(c => c.output).join('\\n---\\n')";

// EVAL_FAST drops every judge assertion, leaving only the checks that make no
// LLM call at all (containsAll, lookupUsage, and the invariants in
// promptfooconfig.yaml). Runs in seconds and spends no judge quota, which
// matters because the judge is capped per day — see readme.md.
//
// It grades strictly less than a full run: use it while iterating, never as a
// sign-off.
const FAST = process.env.EVAL_FAST === "true";

// A judge assertion pointed at one slice of the output.
function judge(spec: GradingSpec, transform: string, metric: string) {
  return {
    type: "llm-rubric" as const,
    value: spec.rubric,
    transform,
    metric,
  };
}

// Deterministic substring check over the tool queries. Named-miss reporting
// matters here — "tool query missing: Tanvir" is actionable, "false" is not.
function containsAll(spec: GradingSpec, metric: string) {
  const needles = spec.contains ?? [];
  return {
    type: "javascript" as const,
    metric,
    value: (raw: unknown): AssertResult => {
      const output = parseProviderOutput(raw);
      const queries = output.trace.toolCalls.map((c) => c.query).join(" ");
      if (!queries.trim()) {
        return { pass: false, score: 0, reason: "no search tool call was made" };
      }
      const haystack = queries.toLowerCase();
      const missing = needles.filter((n) => !haystack.includes(n.toLowerCase()));
      return missing.length
        ? {
            pass: false,
            score: 0,
            reason: `tool query missing ${missing.join(", ")} — got ${JSON.stringify(queries)}`,
          }
        : { pass: true, score: 1, reason: `tool query contains ${needles.join(", ")}` };
    },
  };
}

function lookupUsage(shouldUseLookup: boolean) {
  return {
    type: "javascript" as const,
    metric: "lookup-decision",
    value: (raw: unknown): AssertResult => {
      const output = parseProviderOutput(raw);
      const n = output.trace.toolCallCount;
      if (shouldUseLookup) {
        return n > 0
          ? { pass: true, score: 1, reason: `searched (${n} call(s))` }
          : { pass: false, score: 0, reason: "expected a search, none was made" };
      }
      return n === 0
        ? { pass: true, score: 1, reason: "correctly answered without searching" }
        : {
            pass: false,
            score: 0,
            reason: `expected no search, but made ${n}: ${output.trace.toolCalls
              .map((c) => JSON.stringify(c.query))
              .join(", ")}`,
          };
    },
  };
}

function assertionsFor(golden: ReturnType<typeof loadGoldens>[number]) {
  const asserts: object[] = [lookupUsage(golden.should_use_lookup)];

  const toolQuery = golden.lookup?.tool_query;
  if (toolQuery) {
    asserts.push(
      toolQuery.grading === "contain"
        ? containsAll(toolQuery, "tool-query")
        : judge(toolQuery, TOOL_QUERIES, "tool-query"),
    );
  }

  const toolOutput = golden.lookup?.tool_output;
  if (toolOutput) {
    // Always a judge in practice; a "contain" spec here would be checking the
    // corpus, not the agent, so it is mapped the same way for consistency.
    asserts.push(
      toolOutput.grading === "contain"
        ? containsAll(toolOutput, "tool-output")
        : judge(toolOutput, TOOL_OUTPUTS, "tool-output"),
    );
  }

  const answer = golden.response.answer;
  if (answer.main_text) {
    asserts.push(judge(answer.main_text, "output.response", "answer-text"));
  }
  if (answer.actions_min) {
    asserts.push(
      judge(answer.actions_min, "JSON.stringify(output.relevant_actions)", "actions"),
    );
  }
  if (answer.quick_replies) {
    asserts.push(
      judge(answer.quick_replies, "JSON.stringify(output.quick_replies)", "quick-replies"),
    );
  }

  // Filtered at the end rather than skipped at each push, so the two modes
  // cannot drift apart as rubrics are added.
  return FAST
    ? asserts.filter((a) => (a as { type?: string }).type !== "llm-rubric")
    : asserts;
}

module.exports = async function generateTests() {
  return loadGoldens().map((golden) => ({
    description: `${golden.id} [${golden.goal}/${golden.state}]`,
    vars: {
      goldenId: golden.id,
      query: golden.input.query,
      history: golden.input.history,
    },
    metadata: {
      goldenId: golden.id,
      goal: golden.goal,
      state: golden.state,
    },
    assert: assertionsFor(golden),
  }));
};
