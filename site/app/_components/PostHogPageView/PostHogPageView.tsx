"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useAnalytics from "@/app/_hooks/useAnalytics";

/**
 * Captures a PostHog "$pageview" on every route change.
 *
 * PostHog is initialized with capture_pageview: false, so pageviews are sent
 * manually here. useAnalytics() only returns posthog when the user has consented,
 * so posthog?.capture no-ops until consent is granted. Depending the effect on
 * `posthog` also fires the first pageview the moment consent is granted.
 */
function PostHogPageViewInner() {
  const { posthog } = useAnalytics();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog || !pathname) return;
    let url = window.origin + pathname;
    const search = searchParams?.toString();
    if (search) url += `?${search}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}

/**
 * Captures a "page_engagement" event per route visit, carrying how long the
 * visit lasted and how far down the page the reader got.
 *
 * Rolled by hand rather than switching on capture_pageleave: PostHog derives
 * its $pageleave dwell/scroll properties from its *internal* pageview
 * tracking, which is disabled here (pageviews are sent manually above).
 *
 * This runs on every route, not just the pages we happen to care about — an
 * average with no baseline to compare against isn't worth much.
 */
function PageEngagementTracker() {
  const { posthog } = useAnalytics();
  const pathname = usePathname();

  // Held in a ref so the effect below can depend on `pathname` alone. If it
  // depended on `posthog`, consent resolving mid-visit would re-run it, and the
  // cleanup would flush a bogus near-zero-duration visit.
  const posthogRef = useRef(posthog);
  useEffect(() => {
    posthogRef.current = posthog;
  }, [posthog]);

  useEffect(() => {
    if (!pathname) return;

    let startedAt = Date.now();
    let maxScroll = 0;
    let sent = false;

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight;
      if (scrollable <= 0) return;
      const seen = window.scrollY + window.innerHeight;
      const pct = Math.min(100, Math.round((seen / scrollable) * 100));
      if (pct > maxScroll) maxScroll = pct;
    };

    // Measure once up front: a page that fits on screen without scrolling has
    // already been seen in full, and would otherwise report 0%.
    measure();

    const flush = () => {
      if (sent) return;
      sent = true;
      posthogRef.current?.capture("page_engagement", {
        path: pathname,
        duration_ms: Date.now() - startedAt,
        max_scroll_percentage: maxScroll,
      });
    };

    // Restored from the back/forward cache — this is a fresh visit.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      startedAt = Date.now();
      maxScroll = 0;
      sent = false;
      measure();
    };

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    // pagehide rather than beforeunload: beforeunload does not reliably fire on
    // mobile, which is the primary device here.
    window.addEventListener("pagehide", flush);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("pageshow", onPageShow);
      // Client-side navigation away from this route ends the visit.
      flush();
    };
  }, [pathname]);

  return null;
}

// useSearchParams() requires a Suspense boundary in the App Router.
export default function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewInner />
      <PageEngagementTracker />
    </Suspense>
  );
}
