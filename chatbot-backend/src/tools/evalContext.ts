import { AsyncLocalStorage } from "node:async_hooks";
import type { Where } from "chromadb";

// Per-invocation eval state. Lives in AsyncLocalStorage rather than a module
// global so the eval runner can execute cases concurrently without the search
// tool of one case seeing the filter or trace sink of another.
//
// Outside of runWithEvalStore (i.e. every production request) getEvalStore()
// returns undefined and the callers fall straight through to normal behavior.

export interface ToolCallRecord {
  name: string;
  /** The semantic query the model actually passed to the search tool. */
  query: string;
  /** The final tool output string, after document shaping + URL rewriting. */
  output: string;
  ms: number;
  /** Which documents came back — lets a failure be diagnosed as corpus drift. */
  docIds: string[];
  collections: string[];
}

/**
 * Describes a corpus that is missing some content, without touching the DB.
 *
 * Two granularities, because one is not enough:
 *  - `where` excludes whole collections server-side. Cheap, and tolerant of new
 *    documents being added to the CMS later.
 *  - `excludeDocIds` excludes individual documents. Needed because the corpus is
 *    chunked per *page section*, so topics bleed across collections — the
 *    "Want to collaborate?" section lives on page-events, and a "Join Today!"
 *    CTA lives on page-home. Collection-level exclusion alone cannot express
 *    "partnership info is absent" without deleting half the corpus.
 */
export interface CorpusFilter {
  where?: Where;
  excludeDocIds?: string[];
}

export interface EvalStore {
  /** Corpus filter injected for this invocation; see _eval/absence.ts. */
  filter?: CorpusFilter;
  toolCalls: ToolCallRecord[];
}

const als = new AsyncLocalStorage<EvalStore>();

export function runWithEvalStore<T>(
  store: EvalStore,
  fn: () => Promise<T>,
): Promise<T> {
  return als.run(store, fn);
}

export function getEvalStore(): EvalStore | undefined {
  return als.getStore();
}
