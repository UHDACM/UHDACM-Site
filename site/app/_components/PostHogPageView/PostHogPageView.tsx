"use client";

import { Suspense, useEffect } from "react";
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

// useSearchParams() requires a Suspense boundary in the App Router.
export default function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewInner />
    </Suspense>
  );
}
