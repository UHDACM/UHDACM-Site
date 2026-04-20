/**
 * Share text is built from NEXT_PUBLIC_SELF_URL, which webpack inlines at build
 * time and which is routinely wrong for the environment actually serving the
 * page (a prod build carrying https://test.uhdacm.org, a deploy carrying
 * http://localhost:3000). Re-point any such origin at the origin the visitor is
 * really on. Same idea as chatbot-backend's rewriteFrontendUrls
 * (chatbot-backend/src/langchain/langchain.ts:140-154), sourcing the target from
 * window.location instead of FRONTEND_ADDRESS.
 */

// Origin only (scheme + optional www./test. + uhdacm.org). The negative
// lookahead stops the match at a path/query/end boundary, so a lookalike host
// such as uhdacm.org.evil.com is never rewritten.
const UHDACM_ORIGIN_RE = /https?:\/\/(?:www\.|test\.)?uhdacm\.org(?![\w.-])/gi;

const stripTrailingSlashes = (s: string) => s.replace(/\/+$/, "");
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function rewriteShareOrigin(text: string, configuredSelfUrl?: string): string {
  // SSR / prerender: no origin to resolve against, leave the text alone.
  if (typeof window === "undefined") return text;
  const origin = stripTrailingSlashes(window.location.origin);

  // Any uhdacm.org origin baked into the string.
  let out = text.replace(UHDACM_ORIGIN_RE, origin);

  // Plus whatever NEXT_PUBLIC_SELF_URL was at build time, which covers the
  // non-uhdacm misconfiguration (site/.env ships http://localhost:3000).
  const configured = configuredSelfUrl ? stripTrailingSlashes(configuredSelfUrl) : "";
  if (configured && configured !== origin) {
    out = out.replace(new RegExp(`${escapeRegExp(configured)}(?![\\w.-])`, "gi"), origin);
  }
  return out;
}
