import { AgentTrace, queryAgent, queryAgentTraced } from "../langchain/langchain";
import { CorpusFilter } from "../tools/evalContext";
import { LogMessage } from "../log/log";
import { QueryMessage, QueryResponse } from "@shared/types/query/queryTypes";
import { contextMsgLimit } from "@shared/types/query/queryData";

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

  return `Today's date is: ${new Date().toLocaleDateString()}.
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
