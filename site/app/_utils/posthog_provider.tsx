"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePublicEnv } from "../_context/PublicEnvContext/PublicEnvContext";

// Module-level guard so init runs exactly once per page load.
let initialized = false;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const public_env = usePublicEnv();

  // Initialize during render rather than in an effect. React flushes passive
  // effects children-first, so an effect here would run *after* descendants
  // (e.g. PostHogPageView) fire theirs — dropping the first $pageview of the
  // session. init() is idempotent behind the guard and touches no React state.
  if (
    typeof window !== "undefined" &&
    !initialized &&
    public_env.NEXT_PUBLIC_ENABLE_RUM
  ) {
    initialized = true;
    posthog.init(public_env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: public_env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2025-11-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      // BETA: consent defaults to on (see DEFAULT_CONSENT in ConsentContext),
      // so start capturing immediately. Set back to `true` when the consent
      // banner is re-enabled, so nothing is captured before the user opts in.
      opt_out_capturing_by_default: false,
    });
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
