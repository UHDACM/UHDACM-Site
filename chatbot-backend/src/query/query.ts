import { queryAgent } from "../langchain/langchain";
import { LogMessage } from "../log/log";
import { QueryMessage, QueryResponse } from "@shared/types/query/queryTypes";
import { contextMsgLimit } from "@shared/types/query/queryData";

export const processQuery = async (
  query: string,
  context?: QueryMessage[],
): Promise<QueryResponse> => {
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

  // Behavioral instructions now live in the agent's system prompt
  // (see langchain.ts). The human message carries only per-request data.
  const humanMessage = `Today's date is: ${new Date().toLocaleDateString()}.
---
CONVERSATION HISTORY:
${prevMsg}
---
USER QUERY:
${query}
`;

  try {
    return await queryAgent(humanMessage);
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
