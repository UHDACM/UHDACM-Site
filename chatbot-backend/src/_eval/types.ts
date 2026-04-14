import * as fs from "fs";
import * as path from "path";

/**
 * Shape of the hand-written cases in goldens.json, plus a validator.
 *
 * Follows the `check*` convention used across shared/src/types — a malformed
 * golden must fail loudly at load time, otherwise it silently contributes zero
 * assertions and the run reports a false pass.
 */

export type Grading = "contain" | "judge";

export interface GradingSpec {
  grading: Grading;
  /** Human-readable criterion. Sent to the judge when grading === "judge". */
  rubric: string;
  /** Required substrings. Only meaningful when grading === "contain". */
  contains?: string[];
}

export interface GoldenHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Golden {
  id: string;
  goal: string;
  state: string;
  input: {
    query: string;
    history: GoldenHistoryMessage[];
  };
  /** Whether the agent is expected to call the search tool at all. */
  should_use_lookup: boolean;
  /** Present only when should_use_lookup is true. */
  lookup?: {
    tool_query?: GradingSpec;
    tool_output?: GradingSpec;
  };
  response: {
    answer: {
      main_text?: GradingSpec;
      /** How the answer is presented — bolding, bullets, length. Graded
       *  separately from main_text so a failure says which half broke. */
      formatting?: GradingSpec;
      actions_min?: GradingSpec;
      quick_replies?: GradingSpec;
    };
  };
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function checkGradingSpec(v: unknown, where: string): asserts v is GradingSpec {
  if (!isObject(v)) throw new Error(`${where}: expected an object`);
  if (v.grading !== "contain" && v.grading !== "judge") {
    throw new Error(`${where}: grading must be "contain" or "judge"`);
  }
  if (typeof v.rubric !== "string" || !v.rubric.trim()) {
    throw new Error(`${where}: rubric must be a non-empty string`);
  }
  if (v.grading === "contain") {
    if (!Array.isArray(v.contains) || v.contains.length === 0) {
      throw new Error(`${where}: grading "contain" requires a non-empty contains[]`);
    }
    if (!v.contains.every((c) => typeof c === "string")) {
      throw new Error(`${where}: contains[] must be all strings`);
    }
  }
}

export function checkGolden(v: unknown): asserts v is Golden {
  if (!isObject(v)) throw new Error("golden: expected an object");

  const id = v.id;
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("golden: id must be a non-empty string");
  }
  for (const key of ["goal", "state"] as const) {
    if (typeof v[key] !== "string") throw new Error(`${id}: ${key} must be a string`);
  }

  if (!isObject(v.input)) throw new Error(`${id}: input must be an object`);
  if (typeof v.input.query !== "string" || !v.input.query.trim()) {
    throw new Error(`${id}: input.query must be a non-empty string`);
  }
  if (!Array.isArray(v.input.history)) {
    throw new Error(`${id}: input.history must be an array`);
  }
  for (const [i, msg] of v.input.history.entries()) {
    if (!isObject(msg)) throw new Error(`${id}: history[${i}] must be an object`);
    if (msg.role !== "user" && msg.role !== "assistant") {
      throw new Error(`${id}: history[${i}].role must be "user" or "assistant"`);
    }
    if (typeof msg.content !== "string") {
      throw new Error(`${id}: history[${i}].content must be a string`);
    }
  }

  if (typeof v.should_use_lookup !== "boolean") {
    throw new Error(`${id}: should_use_lookup must be a boolean`);
  }

  if (v.should_use_lookup) {
    if (!isObject(v.lookup)) {
      throw new Error(`${id}: should_use_lookup is true but lookup is missing`);
    }
    if (v.lookup.tool_query !== undefined) {
      checkGradingSpec(v.lookup.tool_query, `${id}.lookup.tool_query`);
    }
    if (v.lookup.tool_output !== undefined) {
      checkGradingSpec(v.lookup.tool_output, `${id}.lookup.tool_output`);
    }
  } else if (v.lookup !== undefined) {
    throw new Error(`${id}: should_use_lookup is false but a lookup spec is present`);
  }

  if (!isObject(v.response) || !isObject(v.response.answer)) {
    throw new Error(`${id}: response.answer must be an object`);
  }
  const answer = v.response.answer;
  // Every gradable key must be listed here. An unlisted one is not rejected —
  // it is simply never validated and never turned into an assertion, so the
  // golden silently grades less than it appears to.
  for (const key of ["main_text", "formatting", "actions_min", "quick_replies"] as const) {
    if (answer[key] !== undefined) {
      checkGradingSpec(answer[key], `${id}.response.answer.${key}`);
    }
  }
}

/**
 * Loads and validates goldens.json.
 *
 * Note the file's outer value is an array *of arrays* (grouped cases), so it is
 * flattened here — every consumer wants the flat list.
 */
export function loadGoldens(): Golden[] {
  const raw = JSON.parse(
    fs.readFileSync(path.join(__dirname, "goldens.json"), "utf-8"),
  );
  if (!Array.isArray(raw)) throw new Error("goldens.json: expected an array");

  const flat: unknown[] = raw.flat();
  flat.forEach(checkGolden);
  const goldens = flat as Golden[];

  const seen = new Set<string>();
  for (const g of goldens) {
    if (seen.has(g.id)) throw new Error(`goldens.json: duplicate id "${g.id}"`);
    seen.add(g.id);
  }
  return goldens;
}
