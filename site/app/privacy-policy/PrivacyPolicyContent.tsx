"use client";

import Button from "../_components/Button/Button";
import { useConsentContext } from "@/app/_context/ConcentContext/ConsentContext";

export default function PrivacyPolicyContent() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        padding: "0rem 0.5rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ height: "5rem" }} />
      <span style={{ fontSize: "2.5rem" }}>Privacy Policy</span>
      <span>Last updated: February 2, 2026</span>

      <div
        style={{
          fontSize: "1rem",
          width: "100%",
          maxWidth: "40rem",
          padding: "0.5rem 0.5rem",
        }}
      >
        <p>
          <strong>1. Introduction</strong>
        </p>
        <p>
          This Privacy Policy explains how we collect, use, and protect
          information when you use this web application (the “App”).
        </p>
        <br />
        <br />

        <p>
          <strong>2. Information We Collect</strong>
        </p>
        <p>
          We do not collect personal information such as names, email addresses,
          or payment details.
        </p>
        <br />

        <p>
          We use PostHog, a product analytics service, to collect limited usage
          data to understand how the App is used and to improve functionality.
        </p>
        <br />

        <p>The data collected by PostHog may include:</p>
        <p>
          Pages visited, button clicks and interactions, device type, browser,
          operating system, approximate location (city-level, derived from IP),
          and anonymous identifiers (cookies or local storage IDs).
        </p>
        <br />
        <p>We do not intentionally collect sensitive personal data.</p>
        <br />
        <br />

        <p>
          <strong>3. How We Use Information</strong>
        </p>
        <p>
          We use the collected analytics data solely to monitor application
          performance, understand feature usage, improve user experience, and
          diagnose bugs and technical issues.
        </p>
        <br />
        <br />

        <p>
          <strong>4. Third-Party Services</strong>
        </p>
        <p>We use PostHog as our only third-party analytics provider.</p>
        <p>
          PostHog processes data on our behalf in accordance with their privacy
          policy{" "}
          <a
            href="https://posthog.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
        <br />
        <p>
          Depending on our configuration, data may be processed in the EU or
          other regions.
        </p>
        <br />
        <br />

        <p>
          <strong>5. Cookies and Tracking Technologies</strong>
        </p>
        <p>
          PostHog uses cookies or similar technologies to recognize returning
          users and track usage patterns. You may disable cookies in your
          browser settings, but this may affect App functionality.
        </p>
        <br />
        <br />

        <p>
          <strong>6. Data Retention</strong>
        </p>
        <p>
          Analytics data is retained only for as long as necessary to fulfill
          the purposes described above or as configured in PostHog.
        </p>
        <br />
        <br />

        <p>
          <strong>7. Your Rights</strong>
        </p>
        <p>
          All data collected is anonymized, and as such, we are unable to
          provide specific data upon request.
          <br />
          <br />
          However, you may opt out of PostHog tracking by enabling “Do Not
          Track”, or by changing your tracking preferences{" "}
          <b>at the bottom of this page</b>, in your browser, or by contacting
          us.
        </p>
        <br />
        <br />

        <p>
          <strong>8. Data Security</strong>
        </p>
        <p>
          We take reasonable measures to protect analytics data from
          unauthorized access, alteration, or disclosure.
        </p>
        <br />
        <br />

        <p>
          <strong>9. Changes to This Policy</strong>
        </p>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>
        <br />
        <br />

        <p>
          <strong>10. Contact</strong>
        </p>
        <p>
          If you have questions about this Privacy Policy, contact us at:
          Junda.yin1@gmail.com
        </p>
        <br />
        <br />
        <div style={{ height: "2rem" }} />
      </div>
      <OptOut />
      <div style={{ height: "10rem" }} />
    </main>
  );
}

function OptOut() {
  const { hasConsent, setHasConsent } = useConsentContext();
  const handleToggleConsent = () => {
    setHasConsent(!hasConsent);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span>
        {hasConsent
          ? "You've opted in to analytics. (Thank you!)"
          : "You've opted out of analytics."}
      </span>
      <Button
        color={hasConsent ? "background" : "primary"}
        onClick={handleToggleConsent}
      >
        {hasConsent ? "Opt out" : "Opt in"}
      </Button>
    </div>
  );
}
