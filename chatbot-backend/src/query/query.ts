import { AgentTrace, queryAgent, queryAgentTraced } from "../langchain/langchain";
import { CorpusFilter } from "../tools/evalContext";
import { LogMessage } from "../log/log";
import { env_vars } from "../tools/env/envVars";
import { QueryMessage, QueryResponse } from "@shared/types/query/queryTypes";
import { contextMsgLimit } from "@shared/types/query/queryData";

// Eval-only pinned "today". Production always uses the real current date.
//
// The eval reads the LIVE corpus, whose events are for the current academic year.
// On the real date those events may all be in the past, which makes "any upcoming
// events" legitimately empty and the events_present golden impossible to pass
// (and makes the agent flip between declining and listing, run to run). Pinning
// "today" to an in-season date removes both problems for the eval without
// touching production. Tied to the corpus's event dates — if the CMS rolls to a
// new academic year, re-check with `npm run eval:probe -- events` and update.
const EVAL_PINNED_DATE = new Date(2026, 0, 15); // Jan 15 2026: Spring events upcoming

// Behavioral instructions live in the agent's system prompt (see langchain.ts).
// The human message carries only per-request data.
const buildHumanMessage = (query: string, context?: QueryMessage[]): string => {
  let prevMsg = "";
  if (context) {
    prevMsg += "\n\n Previous messages: ";
    let msgCount = 0;
    for (const msg of context) {
      msgCount += 1;
      if (msgCount > contextMsgLimit) break;
      prevMsg += `${JSON.stringify({ sender: msg.sender, msg: msg.response })}.`;
    }
  }

  const today = (env_vars.EVAL_MODE ? EVAL_PINNED_DATE : new Date()).toLocaleDateString();

  return `Today's date is: ${today}.
---
CONVERSATION HISTORY:
${prevMsg}
---
USER QUERY:
${query}
`;
};

export const processQuery = async (
  query: string,
  context?: QueryMessage[],
): Promise<QueryResponse> => {
  try {
    return await queryAgent(buildHumanMessage(query, context));
  } catch (e) {
    await LogMessage(`Failed to generate response`, {
      function: "processQuery",
      query,
      error: (e as Error).message,
    });
    return {
      response: "Failed to generate response",
      relevant_actions: [],
      quick_replies: [],
    };
  }
};

// Eval-only. Same prompt construction as processQuery, but surfaces the agent
// trace and lets the caller inject a corpus filter. Errors are NOT swallowed
// into a canned response here — the eval needs to see the real failure.
export const processQueryTraced = async (
  query: string,
  context?: QueryMessage[],
  opts: { filter?: CorpusFilter; timeoutMs?: number } = {},
): Promise<{ result: QueryResponse; trace: AgentTrace }> => {
  return await queryAgentTraced(buildHumanMessage(query, context), opts);
};
