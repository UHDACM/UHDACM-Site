import "dotenv/config";
import { env_vars } from "../tools/env/envVars";
import { LogMessage } from "../log/log";
import { z } from "zod";

const API_KEYS = env_vars.AI_APIKEYS;
let keyIndex = 0;

function normalizeKeyIndex() {
  if (!Number.isFinite(keyIndex) || keyIndex < 0) keyIndex = 0;
  if (API_KEYS.length > 0) keyIndex = keyIndex % API_KEYS.length;
}

function getCurrentKey(): string {
  normalizeKeyIndex();
  return API_KEYS[keyIndex];
}

function advanceKey(): string {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  return getCurrentKey();
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function shouldRotateKey(err: unknown): boolean {
  const msg = getErrorMessage(err).toLowerCase();

  const quotaLike =
    msg.includes("429") ||
    msg.includes("too many requests") ||
    msg.includes("rate limit") ||
    msg.includes("rate_limit") ||
    msg.includes("quota") ||
    msg.includes("resource has been exhausted") ||
    msg.includes("resource exhausted") ||
    msg.includes("exceeded quota") ||
    msg.includes("quota exceeded") ||
    msg.includes("expired");

  const transient =
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("fetch failed") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("enotfound") ||
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("500") ||
    msg.includes("temporarily unavailable");

  return quotaLike || transient;
}


import { createAgent, ReactAgent, tool, toolStrategy } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { queryCollection } from "../context/context";
import {
  CorpusFilter,
  EvalStore,
  ToolCallRecord,
  getEvalStore,
  runWithEvalStore,
} from "../tools/evalContext";

const ActionSchema = z.object({
  label: z.string().describe("Short, human-readable link label (2-4 words)."),
  href: z
    .string()
    .describe("A URL taken verbatim from a search result — never invented."),
});

const QuickReplySchema = z.object({
  label: z.string().describe("Button text, 2-3 words."),
  value: z.string().describe("The fully-phrased follow-up question to send."),
});

export const QueryResponseSchema = z.object({
  response: z
    .string()
    .describe(
      "The natural-language answer for the user. Must NOT contain raw search/tool output, JSON, \"collection:\" prefixes (e.g. \"page-home:\"), or raw URLs. Keep it short. Markdown, but ONLY **bold**, *italic*, and \"- \" bullet lists — no headings, numbered lists, tables, code blocks, or markdown links. Bold the key facts; three or more items MUST be a \"- \" bullet list, never a run-on sentence. If you can't answer or the question is off-topic, still offer a relevant UHD ACM next step in this text.",
    ),
  relevant_actions: z
    .array(ActionSchema)
    .max(3)
    .describe(
      "Up to 3 links useful to the answer. Every href must be copied verbatim from a search result — never construct or guess one. If the specific thing asked about was not found, link the most relevant broader page that appears in the results; if nothing relevant appears, leave empty.",
    ),
  quick_replies: z
    .array(QuickReplySchema)
    .max(3)
    .describe(
      "Up to 3 likely follow-up questions about UHD ACM. Make them follow from the current topic (event answer -> event follow-ups, joining answer -> membership follow-ups); use broad topics only for 'not found' or off-topic answers. Offer these on every answer.",
    ),
});

export type QueryResponseT = z.infer<typeof QueryResponseSchema>;

// UHD ACM assistant behavior. Lives as a SYSTEM prompt (pinned above tool
// output) so a weak model can't bury it under raw search results and start
// echoing them back. Static — per-request data (date, history, query) is put in
// the human message built by processQuery.
const systemPrompt = `You are a user-facing assistant for UHD ACM (University of Houston-Downtown, Association for Computing Machinery).

TOOL USE:
- Use the "search" tool ONLY for questions about UHD ACM: events, how to join / membership, people / leadership, the organization, or website content.
- For greetings, small talk, arithmetic, or anything unrelated to UHD ACM, answer directly and do NOT search.
- Search at most once unless the first result clearly lacks what you need.

ANSWERING:
- Never invent UHD ACM facts — rely only on search results for those. For general knowledge (math, greetings, etc.) answer normally, then in the SAME response steer back to UHD ACM — a brief nudge like "Is there anything about UHD ACM I can help you with?" is enough.
- Search results are REFERENCE MATERIAL. NEVER output them verbatim. Never put JSON, "collection:" prefixes (e.g. "page-home:"), or raw URLs into the response text — write a short, natural-language answer.
- If the query cannot be answered from the available information, say so plainly — then, in the SAME response text, offer a relevant next step: name a related UHD ACM topic you can help with, or ask if they'd like something adjacent. For an unknown person, offer the leadership team ("Would you like to see the UHD ACM leadership team?"); for an unknown term, offer what you do cover ("I can tell you about our events or how to join — want either?"). One short sentence is enough. Also back it with relevant_actions and quick_replies. A dead end with no next step is a bad answer.
- Before answering, check that the results actually contain the SPECIFIC thing asked about — not just something adjacent. Passing mentions do NOT count as an answer: a tagline like "fostering community through events", a stat like "12 events this year", a person's bio, or a bare link to a page is NOT a list of upcoming events, a benefits list, or a definition. If only such tangential mentions came back, treat the specific thing as not found: say so plainly ("I don't see any upcoming events listed right now", "I don't have a list of member benefits", "I don't have a description of what our events are") and offer a next step. Do not deflect to a related page as if it answered, and never stitch an answer together from tangential snippets.
- Do not mention tools or internal mechanisms. Keep responses short.
- Put the answer ONLY in the response field. Never list your quick_replies or action links inside the response text (e.g. do not write "Quick replies: ...").

FORMATTING (the answer is rendered as Markdown in a narrow chat bubble):
- Bold the things the user came for: people's names, roles, event titles, dates, deadlines. Use **bold**, never CAPS. When the answer is about a specific person, always bold that person's name (e.g. **Fatima Tanvir**).
- If the answer enumerates three or more things (events, ways to join, benefits), you MUST format them as a "- " bullet list, one short line each — never a comma-separated sentence or a single run-on line. Three or more items written as prose is wrong even when every fact is correct.
- Otherwise write 1-3 short sentences. Start a new paragraph rather than letting one grow long.
- ONLY these render: **bold**, *italic*, and "- " bullet lists. Do NOT use headings (#), numbered lists, tables, code blocks, or markdown links — they reach the user as literal characters or unstyled text.

OUTPUT FIELDS:
- response: the answer text, formatted per FORMATTING above. Natural language only — no raw tool output.
- relevant_actions: up to 3 links useful to the answer. Every href MUST be copied character-for-character from a search result. Never construct, complete, or guess a URL — if the page you would like to link to is not present in the results, emit no link for it. A plausible-looking invented URL (e.g. building "/leadership" from the site root) is a bug, not a helpful fallback. Within that limit: when you searched but could not find the specific thing asked about, link the most relevant broader page that IS present in the results. If nothing relevant is present, leave this empty. If a URL is included here, don't repeat it in the response text.
- quick_replies: up to 3 likely follow-up questions about UHD ACM. Make them follow from the CURRENT topic first: after an events answer offer event follow-ups (e.g. RSVP, or a specific event just listed); after a joining answer offer membership follow-ups; after a partnership answer offer sponsor/contact follow-ups. Only fall back to broad topics (what is ACM, how to join) for not-found or off-topic answers. Offer them on every answer — they need no search results, so there is nothing to ground and no reason to omit them.`;

// The vector DB was populated by vector-context-manager using its own frontend
// URL (e.g. https://test.uhdacm.org in the test env, https://uhdacm.org /
// https://www.uhdacm.org in prod), which may differ from the frontend actually
// serving this backend. Normalize any baked-in uhdacm.org origin to this
// backend's FRONTEND_ADDRESS, keeping the path intact.
const FRONTEND_ORIGIN = env_vars.FRONTEND_ADDRESS.replace(/\/+$/, "");

// Matches the origin only (scheme + optional www./test. + uhdacm.org). The
// negative lookahead (?![\w.-]) stops the match at a path/query/end boundary so
// a lookalike host such as uhdacm.org.evil.com is never rewritten.
const UHDACM_URL_RE = /https?:\/\/(?:www\.|test\.)?uhdacm\.org(?![\w.-])/gi;

function rewriteFrontendUrls(text: string): string {
  return text.replace(UHDACM_URL_RE, FRONTEND_ORIGIN);
}

// Shared so groundActions can tell a real search result apart from the
// structured-response tool message. Changing this in one place only would
// silently turn link grounding into a no-op.
const SEARCH_TOOL_NAME = "search";

function buildSearchTool() {
  return tool(
    async ({ query }) => {
      console.log("querying", query);
      // Present only under the eval harness (see tools/evalContext.ts). Carries
      // the corpus filter in, and collects the trace on the way out.
      const store = getEvalStore();
      const startedAt = Date.now();

      const QueryResponse = await queryCollection(query, store?.filter);

      const record = (output: string) => {
        if (!store) return output;
        store.toolCalls.push({
          name: "search",
          query,
          output,
          ms: Date.now() - startedAt,
          docIds: QueryResponse.map(([, , id]) => id),
          collections: QueryResponse.map(([, metadata]) => metadata.collection),
        });
        return output;
      };

      if (QueryResponse.length === 0) {
        return record("No matching UHD ACM sources were found.");
      }
      // Label the payload as reference material so the model summarizes it
      // instead of echoing it into the response.
      let contextStr =
        "SOURCES (reference only — summarize in your own words, do not output verbatim):\n";
      for (const [document, metadata] of QueryResponse) {
        const documentObject = produceDocumentObject(document, metadata);
        contextStr += `${metadata.collection}:${JSON.stringify(documentObject)}\n`;
      }
      // Swap any uhdacm.org origin (structured fields AND URLs embedded in the
      // document text) for the frontend that is actually serving this backend.
      // Recorded post-rewrite so the trace shows exactly what the model saw.
      return record(rewriteFrontendUrls(contextStr));
    },
    {
      name: SEARCH_TOOL_NAME,
      description:
        "Search for information about University of Houston-Downtown, Association for Computing Machinery (UHD ACM): events, membership, people, and site content. Do NOT use for greetings, math, or topics unrelated to UHD ACM.",
      schema: z.object({
        query: z.string().describe("Semantic search query input"),
      }),
    },
  );
}

// Build a fresh agent bound to a specific API key. Called at startup and again
// on key rotation — rebuilding is what actually swaps the key, since the model
// captures its key at construction time.
function buildAgent(apiKey: string): ReactAgent {
  const model = new ChatGoogleGenerativeAI({
    model: env_vars.AI_MODEL,
    apiKey,
    temperature: env_vars.AI_TEMPERATURE,
    maxOutputTokens: env_vars.AI_MAX_OUTPUT_TOKENS,
    thinkingConfig: { thinkingBudget: env_vars.AI_THINKING_BUDGET },
  });

  return createAgent({
    model,
    tools: [buildSearchTool()],
    systemPrompt,
    // Gemini's native structured output (providerStrategy) rejects the $schema /
    // additionalProperties keys zod emits, so use toolStrategy (function-calling
    // based) which Gemini tolerates. Correctness comes from systemPrompt + field
    // descriptions + labeled tool output, not the strategy.
    responseFormat: toolStrategy(QueryResponseSchema),
  });
}

let agent: ReactAgent = buildAgent(getCurrentKey());

// Everything the eval harness needs to grade a single agent invocation. Only
// ever built when EVAL_MODE is on — see queryAgentTraced.
export interface AgentTrace {
  toolCalls: ToolCallRecord[];
  toolCallCount: number;
  /** Total invoke attempts, including ones that failed and rotated the key. */
  attempts: number;
  keyRotations: number;
  latencyMs: number;
  model: string;
  /** Corpus filter that was in effect, echoed back for the report. */
  filter?: CorpusFilter;
  tokenUsage?: { prompt: number; completion: number; total: number };
  /** Messages from attempts that failed and were retried. */
  errors: string[];
  /** Raw LangGraph message state, for eyeballing in the promptfoo viewer. */
  messages: unknown[];
}

interface InvokeResult {
  result: QueryResponseT;
  messages: unknown[];
  attempts: number;
  keyRotations: number;
  latencyMs: number;
  errors: string[];
}

// Concatenated content of every SEARCH tool result in an agent run — the only
// legitimate source of hrefs.
//
// Must match on the tool name, not just role "tool". responseFormat uses
// toolStrategy, so the model's own structured answer comes back as a tool
// message too — including the very relevant_actions being checked. Counting it
// as a source makes any href trivially "grounded" and the check a no-op.
function toolOutputsFrom(messages: unknown[]): string {
  const parts: string[] = [];
  for (const m of messages) {
    const msg = m as {
      getType?: () => string;
      _getType?: () => string;
      name?: string;
      content?: unknown;
    };
    // LangChain exposes the role as getType() on newer versions and _getType()
    // on older ones; check both rather than pin to one.
    if ((msg.getType?.() ?? msg._getType?.()) !== "tool") continue;
    if (msg.name !== SEARCH_TOOL_NAME) continue;
    parts.push(
      typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
    );
  }
  return parts.join("\n");
}

/**
 * Drops any action link the model invented.
 *
 * The system prompt forbids constructing URLs, but the model still does it
 * occasionally — observed roughly 1 in 9 "not found" answers fabricating
 * https://uhdacm.org/leadership, a page that does not exist on the site. A user
 * following that link gets a 404, so instructions alone are not enough: the
 * eval's `actionsAreGrounded` invariant caught this, and production needs the
 * same guarantee rather than just a test for it.
 *
 * Applied inside invokeAgent so queryAgent and queryAgentTraced are covered by
 * one code path and cannot drift.
 */
function groundActions(
  result: QueryResponseT,
  messages: unknown[],
): QueryResponseT {
  const actions = result?.relevant_actions ?? [];
  if (!actions.length) return result;

  const sources = toolOutputsFrom(messages);
  // No search ran, so there is nothing to ground against. Leave the model's
  // answer alone rather than stripping every link on an unsearched question.
  if (!sources) return result;

  const grounded = actions.filter((a) => sources.includes(a.href));
  if (grounded.length === actions.length) return result;

  const dropped = actions
    .filter((a) => !sources.includes(a.href))
    .map((a) => a.href);
  void LogMessage(`dropped fabricated action link(s): ${dropped.join(", ")}`, {
    function: "invokeAgent",
    hint: "groundActions",
  });

  return { ...result, relevant_actions: grounded };
}

// The retry / key-rotation loop. Unchanged in behavior from before — it now
// also keeps `response.messages` (previously discarded) and counts attempts, so
// a caller that wants observability can have it without a second code path.
async function invokeAgent(question: string): Promise<InvokeResult> {
  let lastErr: unknown = null;
  const errors: string[] = [];
  const startedAt = Date.now();
  let keyRotations = 0;

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const response = await agent.invoke({
        messages: [["human", question]],
      });

      const messages = response.messages ?? [];
      return {
        result: groundActions(
          response.structuredResponse as QueryResponseT,
          messages,
        ),
        messages,
        attempts: attempt + 1,
        keyRotations,
        latencyMs: Date.now() - startedAt,
        errors,
      };
    } catch (err: unknown) {
      console.error("ebe", err);
      lastErr = err;
      errors.push(getErrorMessage(err));
      if (!shouldRotateKey(err)) {
        await LogMessage((err as Error).message, {
          function: "queryAgent",
        });
        throw err instanceof Error ? err : new Error(getErrorMessage(err));
      }
      // rotate to the next key AND rebuild the agent so the new key takes effect
      agent = buildAgent(advanceKey());
      keyRotations += 1;
    }
  }
  throw new Error(
    `All API keys failed. Last error: ${getErrorMessage(lastErr)}`,
  );
}

export async function queryAgent(question: string): Promise<QueryResponseT> {
  return (await invokeAgent(question)).result;
}

// Sums usage_metadata across the AI messages now that they are retained.
function sumTokenUsage(messages: unknown[]): AgentTrace["tokenUsage"] {
  let prompt = 0;
  let completion = 0;
  let seen = false;
  for (const msg of messages) {
    const usage = (msg as { usage_metadata?: Record<string, number> })
      ?.usage_metadata;
    if (!usage) continue;
    seen = true;
    prompt += usage.input_tokens ?? 0;
    completion += usage.output_tokens ?? 0;
  }
  if (!seen) return undefined;
  return { prompt, completion, total: prompt + completion };
}

// Eval-only entry point. Runs the same agent through the same path as
// queryAgent, but inside an eval store so the search tool records what it
// queried and what came back. Refuses to run in production.
export async function queryAgentTraced(
  question: string,
  opts: { filter?: CorpusFilter; timeoutMs?: number } = {},
): Promise<{ result: QueryResponseT; trace: AgentTrace }> {
  if (!env_vars.EVAL_MODE) {
    throw new Error(
      "queryAgentTraced requires EVAL_MODE=true. Tracing is disabled in production.",
    );
  }

  const store: EvalStore = { filter: opts.filter, toolCalls: [] };

  // Calls to the Gemini endpoint occasionally hang open instead of erroring,
  // which with the eval's serialized concurrency stalls an entire run behind one
  // socket. Bound it here rather than in invokeAgent so production behavior is
  // untouched. The message says "timed out" deliberately: shouldRotateKey treats
  // that as transient, so the existing retry loop rotates the key and tries
  // again instead of failing the case outright.
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const invoked = await runWithEvalStore(store, () =>
    Promise.race([
      invokeAgent(question),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`agent invocation timed out after ${timeoutMs}ms`)),
          timeoutMs,
        ).unref(),
      ),
    ]),
  );

  return {
    result: invoked.result,
    trace: {
      toolCalls: store.toolCalls,
      toolCallCount: store.toolCalls.length,
      attempts: invoked.attempts,
      keyRotations: invoked.keyRotations,
      latencyMs: invoked.latencyMs,
      model: env_vars.AI_MODEL,
      filter: opts.filter,
      tokenUsage: sumTokenUsage(invoked.messages),
      errors: invoked.errors,
      messages: invoked.messages,
    },
  };
}

import { VectorDBBaseMetadata } from "@shared/types/vectorDB/vectorDBTypes.js";
import { ObjectUnknown } from "@shared/types/general/generalTypes.js";
import {
  checkVectorDBEventMetadata,
  checkVectorDBFeaturedEventMetadata,
  checkVectorDBLeadershipMetadata,
  checkVectorDBOrganizationMetadata,
  checkVectorDBPageMetadata,
  checkVectorDBPersonMetadata,
  checkVectorDBQnAMetadata,
  checkVectorDBSiteInfoMetadata,
} from "@shared/types/vectorDB/vectorDBCheck";
export const produceDocumentObject = (
  document: string,
  metadata: VectorDBBaseMetadata,
) => {
  const documentObject: ObjectUnknown = {};
  documentObject.content = document;

  try {
    checkVectorDBPageMetadata(metadata);
    documentObject.url = metadata.url;
    documentObject.actions = metadata.actions;
    return documentObject;
  } catch {}

  try {
    checkVectorDBEventMetadata(metadata);
    documentObject.event = metadata.event;
    return documentObject;
  } catch {}

  try {
    checkVectorDBOrganizationMetadata(metadata);
    return documentObject;
  } catch {}

  try {
    // The `leadership` collection is written with the person shape
    // (writer.ts), so this is the branch that carries per-person socials.
    checkVectorDBPersonMetadata(metadata);
    documentObject.socials = metadata.socials;
    return documentObject;
  } catch {}

  try {
    checkVectorDBQnAMetadata(metadata);
    documentObject.QnA = metadata.QnA;
    return documentObject;
  } catch {}

  try {
    checkVectorDBFeaturedEventMetadata(metadata);
    documentObject.event = metadata.event;
    return documentObject;
  } catch {}

  try {
    checkVectorDBLeadershipMetadata(metadata);
    documentObject.socials = metadata.socialUrls;
    return documentObject;
  } catch {}

  try {
    checkVectorDBSiteInfoMetadata(metadata);
    documentObject.socials = metadata.socialUrls;
    return documentObject;
  } catch {}

  return documentObject;
};
