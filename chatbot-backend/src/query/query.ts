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

  const prompt = `
You are a user-facing assistant for UHD ACM.

Answer the user's query, and only use the search tool when needed. Do NOT use prior knowledge.
If the query cannot be answered from the provided information, say so plainly in the response.

Fields:
- response: the answer text. Markdown is allowed inside this string.
- relevant_actions: links directly useful to the answer. Use only hrefs returned by the search tool — never invent URLs. Leave empty if none apply. Only have relevant actions when it makes sense to answer the query. If the user asks about an event, gallery, etc., include a link action when one is available in context. If an url is linked in relevant actions, do not show it in the text. Encourage the user to use the relevant_actions when appropriate. Have maximum 3 relevant_actions.
- quick_replies: up to 3 likely follow-up questions. label is 2–3 words; value is a fully-phrased follow-up query. Leave empty if none apply.

Do not mention tools or internal mechanisms to the user. Try to keep the response short

Today's date is: ${new Date().toLocaleDateString()}.

---
CONVERSATION HISTORY:
${prevMsg}

---
USER QUERY:
${query}
`;

  try {
    return await queryAgent(prompt);
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
