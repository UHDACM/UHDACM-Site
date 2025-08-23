import { DefaultShareOutline } from "@/app/_icons/Icons";
import CopyButton from "../Variants/CopyButton";

export default function ShareButton({ copyText, replaceTextOnCopyString }: { copyText: string; replaceTextOnCopyString: string; }) {
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
    >
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        <span className={"BodyLargeHeavy"}>Share</span>
        <DefaultShareOutline fontSize={"inherit"} strokeWidth={"0.15rem"} />
      </div>
    </CopyButton>
  );
}
