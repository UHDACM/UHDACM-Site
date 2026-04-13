# Chatbot agent eval

Scored regression suite for the UHD ACM chatbot agent, run with
[promptfoo](https://promptfoo.dev). Each case in `goldens.json` is one full agent
invocation — the same path production takes (`processQuery` → `buildHumanMessage`
→ agent → `search` tool → vector DB) — graded on what the agent *did*, not just
what it said.

## Running

```bash
nvm use 22                # node 18 will not build this project
npm run eval              # all 22 goldens
npm run eval:view         # open the web report
npm run eval -- --filter-pattern leadership_present_fatima   # single case
```

`npm run eval` goes through `run.ts`, which forces `EVAL_MODE=true` and derives
`GOOGLE_API_KEY` (the judge's key) from the existing `GOOGLE_API_KEYS` list, so
no secret has to be duplicated in `.env` and tracing can never be left on by
accident during a normal `npm run dev`.

The judge is `google:gemini-3.1-pro-preview` — a pro-tier model, deliberately not
the `gemini-2.5-flash` system under test, so it is not grading its own output
class. (`gemini-2.5-pro` is listed by the API but 404s for this account:
"no longer available to new users".)

Both `-j 1` and `PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY=1` are deliberate. The
Gemini endpoint drops connections past roughly two in flight from here, and
promptfoo grades a case's assertions in parallel — so a case with five rubrics
would lose some judge calls to `fetch failed`, which shows up as an assertion
failure rather than an infrastructure one. Serializing removes that false signal;
a full run takes roughly 15 minutes.

## What gets graded

Per golden, derived from its grading specs (see `tests.ts`):

| Golden field | Checks |
|---|---|
| `should_use_lookup` | did the agent call the search tool at all |
| `lookup.tool_query` | what it searched for (`contain` = substrings, `judge` = rubric) |
| `lookup.tool_output` | what the vector DB handed back |
| `response.answer.main_text` | the user-facing answer |
| `response.answer.actions_min` | `relevant_actions` |
| `response.answer.quick_replies` | `quick_replies` |

Plus four deterministic invariants on every case (`invariants.ts`), which are
free and catch what a judge is unreliable at:

- no raw tool output in the answer (JSON, `page-home:` prefixes, the `SOURCES` header)
- no raw URL in the answer — links belong in `relevant_actions`
- **no fabricated links** — every `href` must appear verbatim in a search result
- `relevant_actions` / `quick_replies` within the schema's max of 3

## How "absent" cases work

The `present`/`absent` golden pairs use **identical queries** — only the state of
the vector DB differs. Rather than maintaining a second corpus, absent cases hide
the documents they must not find, at query time. **Nothing is ever written to the
vector DB.** See `absence.ts` for the per-golden profiles and
`queryCollection` in `../context/context.ts` for how they are applied:

- **`collections`** — a Chroma `$nin` metadata filter, applied server-side
  *during* the search, so the query returns the true top-k of the remaining
  corpus. Tolerant of new CMS content.
- **`docIds`** — individual chunks, dropped here with the fetch size raised by
  exactly the number of exclusions so a full page of results still comes back.

Both granularities are needed because the corpus is chunked per *page section*
and topics bleed across pages: the "Want to collaborate?" section lives on
page-events, and a "Join Today!" CTA lives on page-home. Excluding whole pages to
suppress those would gut the corpus and turn the case into "empty DB" rather than
"this one topic is missing".

## Calibrating after a CMS change

The eval reads the **live corpus**, so CMS edits can drift it away from what the
goldens assume — a `present` case can start failing because content moved, and an
`absent` case can start leaking because new content arrived.

```bash
npm run eval:probe              # every golden
npm run eval:probe -- events    # ids containing "events"
```

`probe.ts` issues the exact read-only query each golden would issue and prints
what came back. **No LLM calls, no cost, no writes.** It flags two things
automatically:

- `FILTER LEAK` — an excluded document came back anyway
- `SHORT PAGE` — fewer than 8 documents, meaning the over-fetch margin was short

Neither flag firing is sufficient on its own — also read the documents against
the golden's `tool_output` rubric. A leak can be *semantic* — e.g. `page-home-3`
("Events Join workshops, hackathons, and meetups…") satisfies no filter on the
`event` collection but plainly describes events, so it is excluded by id in
`glossary_absent_events`.

When a case starts failing, run the probe first. It answers "did the agent
regress, or did the corpus move?" without spending anything.

### The profiles are tied to `nResults`

`nResults` in `../context/context.ts` is top-k. **Changing it invalidates the
absence profiles** and you must re-probe. Going from 8 to 16 pulled roughly a
quarter of the whole corpus into every query and re-introduced leaks that were
clean at 8 — `page-qnas-1` ("Coming soon… an inspiring conversation with Arbaz
Khan") started surfacing in `events_absent_upcoming`, which is precisely an
upcoming event. Higher top-k makes "absent" progressively harder to express by
exclusion, because ever more adjacent content surfaces.

Note also that a `collections`-only filter can legitimately return fewer than
`nResults` documents. Empty collections carry a marker document that
`queryCollection` always skips; when a collection is excluded, those markers move
up into top-k and get skipped, so the page shrinks. That is faithful — it is what
a corpus genuinely missing that collection would return — which is why the probe
reports it as a `note:` rather than a `SHORT PAGE` warning.

## Adding a golden

1. Add the case to `goldens.json` (the outer value is an array *of arrays*;
   `loadGoldens` flattens it). `types.ts` validates the shape and fails loudly on
   a malformed entry rather than silently contributing zero assertions.
2. If it is an "absent" case, add a profile to `absence.ts` with a `note`
   explaining the choice.
3. Run `npm run eval:probe -- <your-id>` and confirm the retrieved documents
   match what the golden assumes.
4. Run `npm run eval -- --filter-pattern <your-id>`.

## Files

| File | Role |
|---|---|
| `goldens.json` | the cases — the only file most changes touch |
| `types.ts` | golden schema + `checkGolden` validator + `loadGoldens` |
| `absence.ts` | per-golden corpus filters that make "absent" absent |
| `tests.ts` | goldens → promptfoo test cases + assertions |
| `invariants.ts` | deterministic checks applied to every case |
| `provider.ts` | promptfoo provider — one call == one agent invocation |
| `probe.ts` | calibration tool, no LLM calls |
| `run.ts` | launcher; sets `EVAL_MODE`, the judge key, and concurrency limits |
| `providerOutput.ts` | output shape + the parse that keeps assertions honest |
| `promptfooconfig.yaml` | wiring |

## Observability

`queryAgentTraced` (`../langchain/langchain.ts`) returns an `AgentTrace`
alongside the answer: the tool calls with their queries, outputs, retrieved
document ids and collections, plus attempt count, key rotations, latency, and
token usage. It **throws unless `EVAL_MODE=true`**, and the production
`queryAgent` / `processQuery` signatures and behavior are unchanged — with the
flag off, no trace is built and `queryCollection` issues exactly the query it
always did.

The retrieved document ids in the trace are what make a failure diagnosable as
corpus drift rather than an agent regression.
