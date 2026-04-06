import { useConsentContext } from "@/app/_context/ConcentContext/ConsentContext";
import { usePostHog } from "@posthog/react";
import { useEffect } from "react";

/**
 * Returns post hog if user has allowed it
 * @returns 
 */
export default function useAnalytics() {
  const posthog = usePostHog()
  const { hasConsent } = useConsentContext();

  useEffect(() => {
    if (hasConsent) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, [hasConsent]);
  
  if (!hasConsent) return {};
  return { posthog };
}