import { QueryMessage } from "@shared/types/query/queryTypes";
import { processQueryTraced } from "../query/query";
import { filterForGolden } from "./absence";
import { GoldenHistoryMessage } from "./types";

/**
 * promptfoo custom provider. One call == one full agent invocation against the
 * real (read-only) vector DB, with the golden's absence filter applied.
 *
 * The returned `output` is an object rather than a string so assertions can aim
 * at individual fields — see tests.ts, which uses per-assertion `transform` to
 * point each rubric at output.response, output.relevant_actions, the tool query,
 * or the tool output.
 */

interface ProviderContext {
  vars: {
    goldenId: string;
    query: string;
    history: GoldenHistoryMessage[];
  };
}

// The goldens speak {role, content}; the backend speaks QueryMessage. The unused
// fields are what a real client would have sent alongside the text.
function toQueryMessages(history: GoldenHistoryMessage[]): QueryMessage[] {
  return history.map((msg) => ({
    sender: msg.role === "assistant" ? "bot" : "user",
    response: msg.content,
    relevant_actions: [],
    quick_replies: [],
    timestamp: new Date().toISOString(),
  }));
}

class UhdAcmAgentProvider {
  id() {
    return "uhdacm-agent";
  }

  async callApi(_prompt: string, context: ProviderContext) {
    const { goldenId, query, history } = context.vars;

    try {
      const { result, trace } = await processQueryTraced(
        query,
        history?.length ? toQueryMessages(history) : undefined,
        { filter: filterForGolden(goldenId) },
      );

      return {
        output: {
          response: result.response,
          relevant_actions: result.relevant_actions,
          quick_replies: result.quick_replies,
          trace,
        },
        tokenUsage: trace.tokenUsage
          ? {
              prompt: trace.tokenUsage.prompt,
              completion: trace.tokenUsage.completion,
              total: trace.tokenUsage.total,
            }
          : undefined,
        metadata: { goldenId, trace },
      };
    } catch (e) {
      // Surface the real failure. processQuery swallows errors into a canned
      // "Failed to generate response" for end users; an eval must not.
      return { error: `${goldenId}: ${(e as Error).message}` };
    }
  }
}

module.exports = UhdAcmAgentProvider;
