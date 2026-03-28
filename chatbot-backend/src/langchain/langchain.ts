import "dotenv/config";
import { env_vars } from "../tools/env/envVars";
import { LogMessage } from "../log/log";
import { z } from "zod";
import { sleep } from "@shared/tools";

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
import { initChatModel } from "langchain";
import { queryCollection } from "../context/context";

const ActionSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const QuickReplySchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const QueryResponseSchema = z.object({
  response: z.string(),
  relevant_actions: z.array(ActionSchema),
  quick_replies: z.array(QuickReplySchema).max(3),
});

export type QueryResponseT = z.infer<typeof QueryResponseSchema>;

let agent: ReactAgent | undefined = undefined;
async function initializeAgent() {
  // TODO: I said "screw it" and just used the first API key available.
  process.env.GOOGLE_API_KEY = env_vars.AI_APIKEYS[0];
  const model = await initChatModel(`google-genai:${env_vars.AI_MODEL}`);

  const search = tool(
    async ({ query }) => {
      console.log('querying', query);
      const QueryResponse = await queryCollection(query);
      let contextStr = "";
      for (const [document, metadata] of QueryResponse) {
        const documentObject = produceDocumentObject(document, metadata);
        contextStr += `${metadata.collection}:${JSON.stringify(documentObject)}\n`;
        /**
         * page-home:{
         *  content here
         * }
         */
      }
      return contextStr
    },
    {
      name: "search",
      description: "Search for information related to University of Houston Downtown - Association for Computing Machinery (UHD ACM). Only use if current information is not enough to answer user's inquiry.",
      schema: z.object({
        query: z.string().describe("Semantic search query input"),
      }),
    },
  );

  agent = createAgent({
    model: model,
    tools: [search],
    responseFormat: toolStrategy(QueryResponseSchema),
  });
}
initializeAgent();

const max_wait = 2000;
async function waitForAgent() {
  let waitTime = 0;
  while (waitTime < max_wait) {
    console.log('waiting for agent');
    if (!agent) {
      await sleep(300);
      waitTime += 300;
    } else {
      break;
    }
  }
  console.log('done waiting');
}

export async function queryAgent(question: string): Promise<QueryResponseT> {
  let lastErr: unknown = null;
  await waitForAgent();
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    // needs to be set here, langchain agent uses GOOGLE_API_KEY env
    try {
      console.log("attempt", attempt);

      const response = await agent!.invoke({
        messages: [["human", question]],
      });

      return response.structuredResponse as QueryResponseT;
    } catch (err: unknown) {
      console.error('ebe', err);
      lastErr = err;
      if (!shouldRotateKey(err)) {
        await LogMessage((err as Error).message, {
          function: "queryAgent",
        });
        throw err instanceof Error ? err : new Error(getErrorMessage(err));
      }
      advanceKey();
    }
  }
  throw new Error(
    `All API keys failed. Last error: ${getErrorMessage(lastErr)}`,
  );
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
const produceDocumentObject = (
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
    checkVectorDBPersonMetadata(metadata);
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
