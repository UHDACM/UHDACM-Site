"use client";

import { DefaultShareOutline } from "@/app/_icons/Icons";
import CopyButton from "../Variants/CopyButton";
import useAnalytics from "@/app/_hooks/useAnalytics";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";
import { rewriteShareOrigin } from "@/app/_utils/shareUrl";

export default function ShareButton({ copyText, replaceTextOnCopyString }: { copyText: string; replaceTextOnCopyString: string; }) {
  const { posthog } = useAnalytics();
  const public_env = usePublicEnv();
  // Callers build copyText from the build-time NEXT_PUBLIC_SELF_URL, which is
  // frozen into the bundle and often belongs to a different environment.
  const shareText = rewriteShareOrigin(copyText, public_env.NEXT_PUBLIC_SELF_URL);
  return (
    <CopyButton
      style={{
        transition: "background-color 0.2s ease-in-out, border 0.2s ease-in-out",
      }}
      onCopyStyle={{
        border: "1px solid transparent",
        backgroundColor: "rgb(var(--color-font-secondary))",
      }}
      copyText={shareText}
      replaceTextOnCopy={replaceTextOnCopyString}
      onCopy={() => posthog?.capture("share_click", { url: shareText })}
    >
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          alignItems: "center",
        }}
      >
        <span className={"BodyLargeHeavy"}>Share</span>
        <DefaultShareOutline fontSize={"inherit"} strokeWidth={"0.15rem"} />
      </div>
    </CopyButton>
  );
}
