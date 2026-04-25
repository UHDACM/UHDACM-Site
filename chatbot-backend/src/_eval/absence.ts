import { CorpusFilter } from "../tools/evalContext";

/**
 * Corpus filters that make an "absent" golden actually absent.
 *
 * The present/absent golden pairs use IDENTICAL queries — only the state of the
 * vector DB differs. Rather than seeding a second copy of the corpus, each
 * absent case hides the documents it must not find. Nothing is ever written to
 * the DB; see queryCollection in context/context.ts for how each granularity is
 * applied.
 *
 * Two granularities are needed. `collections` is the blunt instrument and does
 * most of the work. `docIds` handles the rest, because the corpus is chunked per
 * *page section* and topics bleed across pages: the "Want to collaborate?"
 * section lives on page-events, and a "Join Today!" CTA lives on page-home.
 * Excluding whole pages to suppress those would gut the corpus and turn the case
 * into "empty DB" rather than "this one topic is missing".
 *
 * Keyed by golden id rather than by `state` on purpose: `person_not_present`
 * covers two different situations. Felipe Vasquez is genuinely absent from the
 * real corpus and needs no filter at all, while "Who is the president?" only
 * becomes a miss once the leadership collection is suppressed.
 *
 * Ids absent from this map run unfiltered against the real corpus.
 *
 * MAINTENANCE: these were calibrated against the live corpus with
 * `npm run eval:probe`, which prints exactly what each filter lets through and
 * makes no LLM calls. The CMS changes over time — when an absent case starts
 * failing, re-run the probe and check whether new content has drifted in.
 *
 * NOT YET CALIBRATED: the "project" / "projects-page" entries below were added
 * by reasoning about what project copy will say, because no project content
 * existed in the CMS when the collections were introduced. Re-run the probe
 * once real projects are published — and check the profiles that do NOT list
 * them (glossary_absent_events in particular, since project blurbs are likely
 * to name hackathons and workshops).
 */

interface AbsenceProfile {
  /** Whole collections to hide. See VectorDBBaseMetadata["collection"]. */
  collections?: string[];
  /** Individual chunk ids to hide, for topics that bleed across pages. */
  docIds?: string[];
  /** Why these, so a future reader can re-derive the choice. */
  note: string;
}

const PROFILES: Record<string, AbsenceProfile> = {
  // leadership_absent_felipe / _bare_name / _after_error are intentionally
  // absent from this map: Felipe Vasquez is genuinely not in the corpus, so no
  // filter is needed, and leadership must stay visible because those goldens
  // still expect a "more leadership" link in the actions.

  leadership_absent_president_by_role: {
    collections: ["leadership"],
    note: "A president only stops existing once leadership itself is unreachable.",
  },

  events_absent_upcoming: {
    // qna is excluded because a QnA IS an upcoming event at UHD ACM: at top-k 16
    // qna-3 ("QnA ... feat. MJ ... networking, projects, navigating life in
    // tech") surfaces and the agent presents it as a scheduled event, inventing a
    // date. A corpus with nothing scheduled would not surface it either.
    // project is excluded for the same reason as qna: a project chunk carries a
    // dateStart and, when still running, no dateEnd — so an ongoing project
    // reads as something currently scheduled.
    collections: ["event", "featured-event", "qna", "project"],
    docIds: [
      "page-qnas-1", // "Coming soon... Join us for an inspiring conversation with Arbaz Khan"
      "page-home-3", // "Events Join workshops, hackathons, and meetups..."
    ],
    note: "Page blurbs about the events page may remain — they list no actual event. page-qnas-1 announces an upcoming one, and qna entries and ongoing projects are themselves upcoming activity, so all are hidden.",
  },

  join_absent_how_to_join: {
    // projects-page carries a {"label":"Join Projects","href":<form>} action —
    // a real sign-up path delivered through action metadata, same as the two
    // docIds noted below.
    collections: ["page-join", "projects-page"],
    docIds: [
      "page-home-6", // "Join Today!" CTA
      "event-22", // General Interest Meeting — "Join us for our General Meeting"
      "event-24", // ACM Interest Meeting
      // These two carry a sign-up link in page *action metadata* rather than in
      // the document text: {"label":"Join UHD ACM Today","href":".../join"}.
      // produceDocumentObject passes actions to the model, so they count.
      "page-about-4",
      "page-home-0",
    ],
    note: "page-join holds the real sign-up path; these chunks are the sign-up info that leaks from other pages, including via action metadata.",
  },

  contact_org_absent_partnership: {
    collections: ["page-contact", "site-info"],
    docIds: [
      "page-events-2", // "Want to collaborate? We're always looking for partners..."
      "page-join-0", // "Join our Discord!" — a contact channel
      "page-join-1", // "Join through CampusGroups! ... updates straight to your inbox"
    ],
    note: "The collaboration pitch lives on the events page, and the reachable-channel copy lives on the join page — neither is on page-contact.",
  },

  org_benefit_absent_why_join: {
    // event/featured-event/qna are excluded because workshop and Q&A copy read as
    // benefit pitches: at top-k 16 event-10 ("How to Secure a Full-time Role ...
    // learn what employers are looking for"), event-22 ("... ways to get
    // involved"), and the qna entries ("practical insights and advice for anyone
    // exploring a career") all surface and the agent lists them as things you get
    // out of joining. Hiding the events alone just floats the qna entries up.
    // project/projects-page are excluded because the projects pitch is a benefit
    // pitch almost word for word — "develop skill and valuable network" — and
    // project chunks list participants, which reads as the community on offer.
    collections: [
      "page-join",
      "page-about",
      "page-home",
      "event",
      "featured-event",
      "qna",
      "project",
      "projects-page",
    ],
    docIds: [
      "page-galleries-0", // "From workshops and hackathons to socials and guest talks"
      "page-media-3", // "the latest on events, workshops, socials, and career opportunities"
      "page-qnas-0", // "Professional QnAs ... industry leaders and UHD alumni" — a benefit
      "page-qnas-1", // "Coming soon... inspiring conversation with Arbaz Khan"
      "site-info-0", // socials list — a member-facing perk
      "page-events-2", // "Want to collaborate?"
    ],
    note: "Benefit language is spread thin across the whole site; at top-k 16 event workshop descriptions read as benefits too, so the event and project collections are hidden alongside the remaining benefit pitches.",
  },

  glossary_absent_qnas: {
    collections: ["qna", "page-qnas"],
    docIds: [
      "page-media-2", // "View latest and all Question and Answer Interview Videos"
      "page-home-5", // same string, different page
    ],
    note: "Both chunks spell out what a QnA is, which is exactly the definition this case must lack.",
  },

  glossary_absent_events: {
    // qna/page-qnas are excluded because the monthly "Professional Q&As with
    // industry leaders and alumni" copy describes an event series; at top-k 16 the
    // agent lifts it and answers "they host monthly Professional Q&As" — exactly
    // the kind of event description this case must lack.
    collections: [
      "event",
      "featured-event",
      "page-events",
      "qna",
      "page-qnas",
    ],
    docIds: [
      "page-home-3", // "Events Join workshops, hackathons, and meetups..."
      "page-home-4", // "View our calendar and find what we have planned for you!"
      "page-media-3", // "the latest on events, workshops, socials..."
      "page-about-3", // "Our Journey" timeline — recounts hackathons and workshops
      "page-galleries-0", // "From workshops and hackathons to socials and guest talks"
    ],
    note: "These describe what UHD ACM events are, which the rubric requires to be missing; the QnA collections describe the Q&A event series, so they are hidden too.",
  },
};

export function filterForGolden(goldenId: string): CorpusFilter | undefined {
  const profile = PROFILES[goldenId];
  if (!profile) return undefined;

  const filter: CorpusFilter = {};
  if (profile.collections?.length) {
    filter.where = { collection: { $nin: profile.collections } };
  }
  if (profile.docIds?.length) {
    filter.excludeDocIds = profile.docIds;
  }
  return Object.keys(filter).length ? filter : undefined;
}

export function profileForGolden(goldenId: string): AbsenceProfile | undefined {
  return PROFILES[goldenId];
}
