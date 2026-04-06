"use client";

import Link from "next/link";
import Button from "../Button/Button";
import { useConsentContext } from "@/app/_context/ConcentContext/ConsentContext";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";
import styles from "./AnalyticsConsentBanner.module.css";

/**
 * Cookie/analytics consent banner.
 *
 * Shown only when the user has not yet made a choice (hasConsent === undefined).
 * Accept/Decline persist the decision via ConsentContext (localStorage), which
 * useAnalytics() reads to opt PostHog capturing in or out.
 *
 * Visibility is derived entirely from the ConsentContext (which owns the state
 * and the `loaded` flag) — the banner keeps no local state, so it never
 * schedules an update on itself. `loaded` gates against SSR / first-paint flash
 * until the persisted choice has been read on the client.
 */
export default function AnalyticsConsentBanner() {
  const { hasConsent, setHasConsent, loaded } = useConsentContext();
  const { NEXT_PUBLIC_ENABLE_RUM } = usePublicEnv();

  // Nothing to consent to if analytics isn't enabled for this deployment.
  if (!NEXT_PUBLIC_ENABLE_RUM) return null;
  if (!loaded || hasConsent !== undefined) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Analytics consent">
      <p className={styles.message}>
        We use privacy-friendly analytics (PostHog) to understand how the site is
        used and to improve it. See our{" "}
        <Link href="/privacy-policy" className={styles.link}>
          Privacy Policy
        </Link>
        .
      </p>
      <div className={styles.actions}>
        <Button color="background" onClick={() => setHasConsent(false)}>
          Decline
        </Button>
        <Button color="primary" onClick={() => setHasConsent(true)}>
          Accept
        </Button>
      </div>
    </div>
  );
}
