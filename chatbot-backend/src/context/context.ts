import { ChromaClient, CloudClient } from "chromadb";
import { CorpusFilter } from "../tools/evalContext";
import { env_vars } from "../tools/env/envVars";
import { vectorDBEmptyCollectionMarkerDocument } from "@shared/types/vectorDB/vectorDBData";
import { VectorDBBaseMetadata } from "@shared/types/vectorDB/vectorDBTypes";
import { convertSafeMetadataToVectorDBMetadata } from "@shared/types/vectorDB/vectorDBFuncs";
import { LogMessage } from "../log/log";

// Define the collection name
const collectionName = env_vars.CHROMA_DB_COLLECTION_NAME;
export const nResults = 16; // top-k passed to the LLM; kept small to shrink the prompt + speed the final call

// Initialize Chroma client
const client = env_vars.CHROMA_IS_CLOUD
  ? new CloudClient({
      apiKey: env_vars.CHROMA_API_KEY,
      tenant: env_vars.CHROMA_TENANT,
      database: env_vars.CHROMA_DATABASE_NAME,
    })
  : new ChromaClient({
      host: env_vars.CHROMA_DB_HOST,
      port: env_vars.CHROMA_DB_PORT,
    });

// Function to query the collection and return related items as a string array
//
// `filter` is eval-only — production never passes it, and with it absent the
// emitted query is byte-identical to what it always was. The eval harness uses
// it to simulate a corpus that is missing certain content (see _eval/absence.ts)
// without ever writing to the DB:
//   - filter.where is applied by Chroma server-side *during* the search, so the
//     result is the true top-`nResults` of the remaining corpus.
//   - filter.excludeDocIds is applied here, with the fetch size raised by exactly
//     the number of excluded ids so that dropping them still leaves a full
//     `nResults` page. Ranking is by distance, so post-filtering preserves order
//     and the outcome matches what a corpus without those documents would return.
export async function queryCollection(
  query: string,
  filter?: CorpusFilter,
): Promise<[string, VectorDBBaseMetadata, string][]> {
  try {
    // Get the collection
    const collection = await client.getCollection({ name: collectionName });

    const excludedIds = new Set(filter?.excludeDocIds ?? []);

    // Query the collection
    const queryRes = await collection.query({
      queryTexts: [query],
      nResults: nResults + excludedIds.size,
      ...(filter?.where ? { where: filter.where } : {}),
    });

    // Extract and return the results as a string array

    const documentMetadataArray: [string, VectorDBBaseMetadata, string][] = [];
    for (let i = 0; i < queryRes.documents[0].length; i++) {
      if (documentMetadataArray.length >= nResults) break;

      const val = queryRes.documents[0][i];

      if (!val) {
        // idk how this would happen
        console.error("Ran out of values", JSON.stringify(queryRes, null, 2));
        break;
      }
      if (val == vectorDBEmptyCollectionMarkerDocument) {
        // skip empty documents
        continue;
      }
      if (excludedIds.has(queryRes.ids[0][i] ?? "")) {
        // eval-only: this document is being treated as absent from the corpus
        continue;
      }

      try {
        const metadata = queryRes.metadatas[0][i];
        if (!metadata) {
          // idk how this is possible
          console.error(
            "Ran out of metadatas",
            JSON.stringify(queryRes, null, 2),
          );
          break;
        }
        const convMetadata = convertSafeMetadataToVectorDBMetadata(metadata);
        documentMetadataArray.push([val, convMetadata, queryRes.ids[0][i] ?? ""]);
      } catch (e) {
        LogMessage(`${(e as Error).message}`, {
          function: "queryCollection",
          hint: "convMetadata",
        });
        break;
      }
    }

    // console.log(documents);
    // console.log(metadatas);
    // console.log(documentMetadataArray)

    return documentMetadataArray;
  } catch (error) {
    console.error("Error querying the collection:", error);
    LogMessage((error as Error).message, {
      function: "queryCollection",
    });
    return [];
  }
}
