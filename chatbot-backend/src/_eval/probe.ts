import { nResults, queryCollection } from "../context/context";
import { produceDocumentObject } from "../langchain/langchain";
import { filterForGolden, profileForGolden } from "./absence";
import { loadGoldens } from "./types";

/**
 * Calibration tool for the absence filters. Makes NO LLM calls and writes
 * nothing — it only issues the same read-only Chroma query the search tool
 * would issue for each golden, and prints what came back.
 *
 * Run: `npm run eval:probe`          (all goldens)
 *      `npm run eval:probe -- events` (ids containing "events")
 *
 * What to look for:
 *   - an *_absent_* case must surface nothing its "must not contain" rubric
 *     forbids. If it leaks, widen the exclusion list in absence.ts.
 *   - the paired *_present_* case must surface the relevant documents. If it
 *     does not, the real corpus has drifted away from what the golden assumes
 *     and the golden (or the CMS) is what needs fixing, not the harness.
 */

const filterArg = process.argv[2];

// Render exactly what the search tool hands the model — document text PLUS the
// metadata produceDocumentObject attaches (url, actions, event, QnA, socials).
// Previewing only the raw document text hid real leaks: page action links like
// {"label":"Join the Club","href":"/join"} ride along in metadata, so a case
// that excluded page-join still fed the model sign-up links.
const preview = (doc: string, metadata: Parameters<typeof produceDocumentObject>[1], n = 240) => {
  const flat = JSON.stringify(produceDocumentObject(doc, metadata))
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > n ? `${flat.slice(0, n)}…` : flat;
};

async function main() {
  const goldens = loadGoldens().filter(
    (g) => !filterArg || g.id.includes(filterArg),
  );

  if (goldens.length === 0) {
    console.log(`No goldens matched "${filterArg}".`);
    return;
  }

  for (const g of goldens) {
    const filter = filterForGolden(g.id);
    const profile = profileForGolden(g.id);
    const excludedCollections = profile?.collections ?? [];
    const excludedIds = profile?.docIds ?? [];

    console.log("\n" + "=".repeat(78));
    console.log(`${g.id}  [${g.goal} / ${g.state}]`);
    console.log(`query:    ${JSON.stringify(g.input.query)}`);
    if (!filter) {
      console.log("filter:   (none — real corpus)");
    } else {
      if (excludedCollections.length) {
        console.log(`filter:   -collections ${excludedCollections.join(", ")}`);
      }
      if (excludedIds.length) {
        console.log(`          -docs ${excludedIds.join(", ")}`);
      }
      console.log(`why:      ${profile?.note ?? ""}`);
    }

    if (!g.should_use_lookup) {
      console.log("note:     golden expects NO lookup; showing what it would find anyway");
    }
    if (g.lookup?.tool_output) {
      console.log(`rubric:   ${g.lookup.tool_output.rubric}`);
    }

    const results = await queryCollection(g.input.query, filter);
    // Baseline for the same query with no filter. Needed because empty
    // collections carry a marker document that queryCollection always skips, so
    // a page can be short for reasons that have nothing to do with the filter.
    const unfiltered = filter
      ? await queryCollection(g.input.query)
      : results;
    console.log(
      `returned: ${results.length} document(s)` +
        (filter ? ` (unfiltered baseline: ${unfiltered.length})` : ""),
    );

    for (const [document, metadata, id] of results) {
      console.log(`  - [${metadata.collection}] ${id}`);
      console.log(`      ${preview(document, metadata)}`);
    }

    // Belt and braces: prove both filter layers actually held.
    const leaked = results.filter(
      ([, m, id]) => excludedCollections.includes(m.collection) || excludedIds.includes(id),
    );
    if (leaked.length) {
      console.log(
        `  !! FILTER LEAK: ${leaked.length} excluded doc(s) came back — ${leaked
          .map(([, , id]) => id)
          .join(", ")}`,
      );
    }
    // Only docId exclusion needs the over-fetch margin, so only it can come up
    // short. A `collections`-only shortfall is faithful: with those documents
    // genuinely gone, empty-collection marker docs rank into the top-k and
    // queryCollection skips them — exactly what a real absent corpus returns.
    if (excludedIds.length && results.length < unfiltered.length) {
      console.log(
        `  !! SHORT PAGE: ${results.length} docs vs ${unfiltered.length} unfiltered — the over-fetch margin did not replace the excluded docs`,
      );
    } else if (filter && results.length < unfiltered.length) {
      console.log(
        `  note: ${results.length} vs ${unfiltered.length} unfiltered — expected; empty-collection markers move into top-k and are skipped`,
      );
    }
  }

  console.log("\n" + "=".repeat(78));
  console.log(`Probed ${goldens.length} golden(s). No LLM calls, no writes.`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
