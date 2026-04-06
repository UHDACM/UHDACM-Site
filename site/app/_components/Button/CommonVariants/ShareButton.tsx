"use client";

import { DefaultShareOutline } from "@/app/_icons/Icons";
import CopyButton from "../Variants/CopyButton";
import useAnalytics from "@/app/_hooks/useAnalytics";

export default function ShareButton({ copyText, replaceTextOnCopyString }: { copyText: string; replaceTextOnCopyString: string; }) {
  const { posthog } = useAnalytics();
  return (
    <CopyButton
      style={{
        transition: "background-color 0.2s ease-in-out, border 0.2s ease-in-out",
      }}
      onCopyStyle={{
        border: "1px solid transparent",
        backgroundColor: "rgb(var(--color-font-secondary))",
      }}
      copyText={copyText}
      replaceTextOnCopy={replaceTextOnCopyString}
      onCopy={() => posthog?.capture("share_click", { url: copyText })}
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
