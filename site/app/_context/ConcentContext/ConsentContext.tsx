"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePostHog } from "@posthog/react";

const STORAGE_KEY = "_allowedAnalytics";

/**
 * BETA: analytics defaults to ON and the consent banner is disabled.
 *
 * To restore the consent flow: set this back to `undefined` and re-mount
 * <AnalyticsConsentBanner /> in app/body.tsx (the component is still there).
 * An explicit stored choice always wins over this default, so anyone who opts
 * out via /privacy-policy stays opted out.
 */
const DEFAULT_CONSENT: boolean | undefined = true;

interface ConsentContextType {
  hasConsent: boolean | undefined;
  setHasConsent: (value: boolean | undefined) => void;
  /** True once the persisted choice has been read on the client. */
  loaded: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const readConsent = (): boolean | undefined => {
  const consent = localStorage.getItem(STORAGE_KEY);
  if (consent === "true") return true;
  if (consent === "false") return false;
  return DEFAULT_CONSENT;
};

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start at the default so capturing is on from the first render (no opt-out window).
  const [hasConsent, setHasConsentState] = useState<boolean | undefined>(DEFAULT_CONSENT);
  const [loaded, setLoaded] = useState(false);
  const posthog = usePostHog();

  const setHasConsent = useCallback((value: boolean | undefined) => {
    setHasConsentState(value);
    if (value !== undefined) {
      localStorage.setItem(STORAGE_KEY, value.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    // Read the persisted choice once on mount (client only).
    setHasConsentState(readConsent());
    setLoaded(true);

    // Sync when another tab changes the choice — no polling required.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setHasConsentState(readConsent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // The one place the stored choice is pushed into the PostHog SDK.
  //
  // `captureEventName: false` because this is a state *sync*, not a user
  // action: posthog-js captures an `$opt_in` event on every opt_in_capturing()
  // call and has no already-opted-in guard of its own. This effect used to live
  // in useAnalytics(), so it ran once per component instance using that hook
  // and buried the project in `$opt_in`. If the opt-in signal is ever wanted,
  // capture it explicitly from the banner click.
  //
  // The has_opted_*_capturing() checks keep a re-run (a second tab writing the
  // same value, say) from re-entering the SDK's consent machinery needlessly.
  useEffect(() => {
    if (!posthog) return;
    if (hasConsent) {
      if (!posthog.has_opted_in_capturing()) {
        posthog.opt_in_capturing({ captureEventName: false });
      }
    } else if (!posthog.has_opted_out_capturing()) {
      // Covers `undefined` (no choice yet) as well as an explicit decline.
      posthog.opt_out_capturing();
    }
  }, [hasConsent, posthog]);

  const value = useMemo<ConsentContextType>(
    () => ({ hasConsent, setHasConsent, loaded }),
    [hasConsent, setHasConsent, loaded],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsentContext = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsentContext must be used within a ConsentProvider");
  }
  return context;
};
