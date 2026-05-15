import { useConsentContext } from "@/app/_context/ConcentContext/ConsentContext";
import { usePostHog } from "@posthog/react";

/**
 * Returns posthog if the user has allowed analytics, otherwise {}.
 *
 * Read-only by design. Pushing the consent decision into the SDK lives in
 * ConsentProvider, which mounts exactly once. It used to live here, which meant
 * every component calling this hook ran opt_in_capturing() on mount — and
 * posthog-js captures an `$opt_in` event on *every* such call, with no
 * already-opted-in guard of its own. A page with N tracked buttons therefore
 * sent N `$opt_in` events, and did it again on every client-side navigation.
 */
export default function useAnalytics() {
  const posthog = usePostHog();
  const { hasConsent } = useConsentContext();

  if (!hasConsent) return {};
  return { posthog };
}
