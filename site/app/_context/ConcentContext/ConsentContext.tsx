"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
