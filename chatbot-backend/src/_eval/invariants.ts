import { AssertResult, parseProviderOutput } from "./providerOutput";

/**
 * Deterministic checks applied to every golden via defaultTest.
 *
 * These are free (no judge call) and cover the failure modes an LLM judge is
 * unreliable at: exact-string leakage, link grounding, and markdown syntax the
 * chat bubble cannot render. The rubrics in goldens.json handle everything that
 * needs actual reading — including whether the formatting suits the answer,
 * which is a judgement call these cannot make.
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

// Markdown the chat bubble cannot render, and why each one is a user-visible
// defect. The renderer is react-markdown with NO remark-gfm and no rehype
// plugins (site/app/_features/chatbot/chatbot-markdown-renderer.tsx), so the
// GFM entries here are never parsed at all — they reach the user as the literal
// characters the model typed. The rest parse fine but land unstyled in a bubble
// roughly 250px wide.
const UNSUPPORTED_MARKDOWN: { name: string; re: RegExp }[] = [
  // h1-h3 are styled, but at 1.1-1.3rem they dominate a two-sentence answer.
  { name: "heading (too heavy for the bubble)", re: /^[ \t]*#{1,6}[ \t]+\S/m },
  // .md styles ul but not ol, so a numbered list renders with no indent.
  { name: "numbered list (ol is unstyled)", re: /^[ \t]*\d+[.)][ \t]+\S/m },
  // Everything below is GFM: not parsed, shown verbatim.
  { name: "table (GFM, not parsed)", re: /^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*\|/m },
  { name: "task list (GFM, not parsed)", re: /^[ \t]*[-*+][ \t]+\[[ xX]\]/m },
  { name: "strikethrough (GFM, not parsed)", re: /~~[^~]+~~/ },
  // Overflows the bubble horizontally; nothing in an answer needs one.
  { name: "code block", re: /```|^[ \t]*~~~/m },
  // Complements noRawUrlInResponse, which only sees https?:// — a relative
  // [Events](/events) slips past it. Links belong in relevant_actions, and
  // globals.css strips underline+color from every <a>, so an inline one is
  // indistinguishable from body text anyway.
  { name: "inline markdown link", re: /\[[^\]\n]*\]\([^)\n]*\)/ },
];

export function rendersInSupportedMarkdown(raw: unknown): AssertResult {
  const output = parseProviderOutput(raw);
  const found: string[] = [];
  for (const { name, re } of UNSUPPORTED_MARKDOWN) {
    const hit = re.exec(output.response);
    // Quote the match: "numbered list (ol is unstyled): \"1. Join...\"" is
    // actionable in a report, the bare rule name is not.
    if (hit) found.push(`${name}: ${JSON.stringify(hit[0].trim().slice(0, 40))}`);
  }
  return found.length
    ? {
        pass: false,
        score: 0,
        reason: `response uses markdown the chat bubble cannot render — ${found.join("; ")}`,
      }
    : { pass: true, score: 1, reason: "only renderable markdown used" };
}

// Generous on purpose. The longest answer across the full baseline run is ~330
// chars, so this fires only on a genuine wall of text and cannot drift — which
// is the property that makes the free layer worth trusting (see readme.md).
const MAX_RESPONSE_CHARS = 900;

export function answerFitsBubble(raw: unknown): AssertResult {
  const output = parseProviderOutput(raw);
  const n = output.response.length;
  return n > MAX_RESPONSE_CHARS
    ? {
        pass: false,
        score: 0,
        reason: `response is ${n} chars (max ${MAX_RESPONSE_CHARS}) — too long for the chat bubble`,
      }
    : { pass: true, score: 1, reason: `response is ${n} chars` };
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
