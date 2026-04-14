# Chatbot agent eval

Scored regression suite for the UHD ACM chatbot agent, run with
[promptfoo](https://promptfoo.dev). Each case in `goldens.json` is one full agent
invocation — the same path production takes (`processQuery` → `buildHumanMessage`
→ agent → `search` tool → vector DB) — graded on what the agent *did*, not just
what it said.

## What this is, in one pass

A **golden** is one test case: a user query, optional chat history, and a set of
expectations. Running the suite plays each golden through the real agent against
the real vector DB, then grades the result three ways:

| Layer | Cost | Catches |
|---|---|---|
| **Invariants** (`invariants.ts`) | free, deterministic | raw tool output or bare URLs leaking into the answer, **fabricated links**, unrenderable markdown, schema limits |
| **Deterministic asserts** (`tests.ts`) | free | did it search at all; did the search query contain the right words |
| **LLM judge rubrics** | quota-limited | did the answer, links, and quick replies actually satisfy the case |

The judge is a separate LLM scoring a written rubric — necessary because "did it
answer helpfully" has no regex, but it is the expensive and least reliable layer,
which is why the free layers carry as much as they can.

Two properties make this suite different from a normal test suite, and both bite
if you forget them:

1. **It runs against the live corpus.** Nothing is written, but a CMS edit can
   make a case fail without a single line of code changing.
2. **Both the agent and the judge are non-deterministic.** The same golden can
   pass and fail on consecutive runs. When a case flips, suspect an ambiguously
   worded rubric before you suspect the agent — a rubric the judge can read two
   ways will grade two ways.

   Measured: two full runs with **no code change between them** flipped 4 of ~89
   judged assertions, in both directions, across unrelated goldens — roughly
   **5% churn**. Consequences:

   - The headline pass rate is **not** a precise measurement. Do not read a few
     points of movement as a regression or an improvement.
   - To decide whether one case genuinely changed, re-run *that case* a couple of
     times before and after. That is cheap and conclusive; a single full-suite
     delta is neither.
   - The free layers do not drift. `invariant` and `tool-query` have held at
     0 failures across every run, which is exactly why they are worth keeping
     deterministic.

### Reading a failure

Work outward from the cheapest signal:

1. **An invariant failed** → almost certainly a real bug. These are deterministic.
2. **`tool-query` / `lookup-decision` failed** → the agent searched wrong, or not
   at all. Real behavior change.
3. **`tool-output` failed** → what came back from the vector DB was wrong. Run
   `npm run eval:probe -- <golden-id>` — usually corpus drift, not the agent.
4. **`answer-text` / `actions` / `quick-replies` failed** → read the judge's
   stated reason before concluding anything. Check whether the rubric is
   unambiguous, and whether the case reproduces across two runs.

## Running

```bash
nvm use 22                # node 18 will not build this project
npm run eval              # all 22 goldens, ~6 min
npm run eval:fast         # deterministic checks only — seconds, no judge calls
npm run eval:view         # open the web report
npm run eval -- --filter-pattern leadership_present_fatima   # single case
npm run eval:pro          # grade with the pro tier (see quota below)
```

| Script | Judge | Use |
|---|---|---|
| `eval` | flash | the normal full run |
| `eval:fast` | none | iterating; grades strictly less, never a sign-off |
| `eval:cached` | flash | re-runs reuse cached responses — **including the agent's**, so it will not pick up a code change |
| `eval:pro` | pro | final sign-off, quota permitting |

`npm run eval` goes through `run.ts`, which forces `EVAL_MODE=true` and derives
`GOOGLE_API_KEY` (the judge's key) from the existing `GOOGLE_API_KEYS` list, so
no secret has to be duplicated in `.env` and tracing can never be left on by
accident during a normal `npm run dev`.

The judge is `google:gemini-flash-latest`, deliberately not the
`gemini-2.5-flash` system under test, so it is not grading its own output class
— a different generation preserves that separation. (`gemini-2.5-pro` is listed
by the API but 404s for this account: "no longer available to new users".)

Both `-j 1` and `PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY=1` are deliberate. The
Gemini endpoint drops connections past roughly two in flight from here, and
promptfoo grades a case's assertions in parallel — so a case with five rubrics
would lose some judge calls to `fetch failed`, which shows up as an assertion
failure rather than an infrastructure one. Serializing removes that false signal;
a full run takes roughly **6 minutes**.

## Judge quota — the thing that governs a run

A full suite issues **~113 judge calls** (5–6 rubrics × 22 goldens, serialized) —
`formatting` added one per golden.

Every **pro-tier** model on this project shares a **250 requests/day/project/model**
cap — under three full runs a day. Exceeding it does not fail cleanly: every call
returns 429 instantly, promptfoo retries into the 180s per-test ceiling, and the
run reports `Evaluation timed out` on every case with the real cause invisible.
One such run burned 66 minutes (22 × 180s) and graded nothing.

`run.ts` now guards this from both ends:

- a **preflight** call per key in `GOOGLE_API_KEYS` before the suite starts, which
  aborts in seconds naming the model and reset time, and selects the first key
  that is not exhausted;
- a **mid-run watch** on the child's output that aborts on the first quota error
  rather than letting the rest of the suite decay into timeouts.

The cap is per project per model, so extra keys in `GOOGLE_API_KEYS` only add
headroom when they come from **different projects** — several keys on one project
share a single pool.

Flash-tier judging has ample headroom, which is why it is the default. Reach for
`eval:pro` only for a sign-off run.

## What gets graded

Per golden, derived from its grading specs (see `tests.ts`):

| Golden field | Checks |
|---|---|
| `should_use_lookup` | did the agent call the search tool at all |
| `lookup.tool_query` | what it searched for (`contain` = substrings, `judge` = rubric) |
| `lookup.tool_output` | what the vector DB handed back |
| `response.answer.main_text` | the user-facing answer — *what* it says |
| `response.answer.formatting` | the same text — *how it reads* (see House style) |
| `response.answer.actions_min` | `relevant_actions` |
| `response.answer.quick_replies` | `quick_replies` |

`main_text` and `formatting` grade the same string under separate metrics on
purpose: "right answer, unreadable" and "wrong answer" are different bugs and
should not fail as one number.

Plus six deterministic invariants on every case (`invariants.ts`), which are
free and catch what a judge is unreliable at:

- no raw tool output in the answer (JSON, `page-home:` prefixes, the `SOURCES` header)
- no raw URL in the answer — links belong in `relevant_actions`
- **no fabricated links** — every `href` must appear verbatim in a search result
- **no markdown the bubble cannot render** — headings, numbered lists, tables,
  task lists, strikethrough, code blocks, inline `[label](href)` links
- answer under 900 characters — a wall of text in a ~250px bubble
- `relevant_actions` / `quick_replies` within the schema's max of 3

## House style

The answer is rendered by `react-markdown` with **no `remark-gfm`** and no rehype
plugins (`site/app/_features/chatbot/chatbot-markdown-renderer.tsx`), into a bubble
roughly 250px wide (24rem panel × 65% `max-width`). So only three things are allowed,
and `rendersInSupportedMarkdown` enforces the rest deterministically:

| Allowed | Why the rest is not |
|---|---|
| `**bold**` — names, roles, event titles, dates | — |
| `*italic*` | — |
| `- ` bullet lists, when listing 3+ things | — |
| ~~headings~~ | styled, but 1.1–1.3rem dominates a two-sentence answer |
| ~~numbered lists~~ | `.md ol` has no CSS — renders with no indent at all |
| ~~tables, task lists, strikethrough~~ | GFM: not parsed, reach the user as literal characters |
| ~~code blocks~~ | overflow the bubble horizontally |
| ~~inline `[label](href)` links~~ | `globals.css` strips underline and color from every `<a>`, so they are invisible as links; links belong in `relevant_actions` |

**Do not write a rubric that asks for a table or numbered steps** — the invariant will
fail the answer no matter how good it is. If numbered steps become worth having (the
"how to join" answer is genuinely sequential), the fix is one CSS rule mirroring the
existing `.md ul`, plus dropping that entry from `UNSUPPORTED_MARKDOWN`.

The matching instructions live in the `FORMATTING:` section of `systemPrompt` in
`../langchain/langchain.ts`, and are summarized again in the `response` field's
`.describe()` — `toolStrategy` passes field descriptions to the model, so if you change
one, change both.

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
   a malformed entry rather than silently contributing zero assertions. Give it a
   `formatting` spec alongside `main_text` — copy the one from the nearest existing
   case of the same shape (person lookup, enumerable answer, or not-found) rather
   than writing a fourth variant.
2. If it is an "absent" case, add a profile to `absence.ts` with a `note`
   explaining the choice.
3. Run `npm run eval:probe -- <your-id>` and confirm the retrieved documents
   match what the golden assumes.
4. Run `npm run eval -- --filter-pattern <your-id>` — **twice**. A rubric that
   grades differently on two identical runs is ambiguous, not flaky.

### Writing a rubric the judge cannot read two ways

The judge follows the rubric literally, so any wording it can resolve more than
one way becomes a coin flip that looks exactly like an agent regression. A real
example from this suite:

```
At least one of: her social (label = the social's name)
                 AND the leadership page (label = 'more leadership').
```

Two defects. "At least one of" is OR but is joined with **AND**, so the judge had
to guess which it meant; and `label = the social's name` reads as strict
equality, so the agent's `"Fatima Tanvir's LinkedIn"` was accepted on one run and
rejected on the next with the opposite justification. Rewritten to state the
either/or explicitly and to name both acceptable label forms, the same three
goldens then passed 6/6 across two runs.

So:

- Use **either/or** or **all of** — never "at least one of ... AND".
- If a near-miss form is acceptable, **say so with an example**. Prefer "a label
  naming the platform, e.g. 'LinkedIn' or 'Fatima's LinkedIn'" over "label = the
  social's name".
- Describe what the user should get, not an exact string, unless the exact string
  genuinely matters.
- Keep one rubric to one claim. Bundled claims fail without telling you which
  half broke.

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
| `run.ts` | launcher; sets `EVAL_MODE`, picks a judge key with quota, sets concurrency limits, aborts on quota exhaustion |
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
