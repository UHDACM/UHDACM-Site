"use client";

import { DefaultShareOutline } from "@/app/_icons/Icons";
import Button from "../Button";
import { ReactNode, useRef, useState } from "react";

const defaultTimeout = 2000;
const defaultChildren: ReactNode = "Copy";
export default function CopyButton({
  copyText,
  replaceTextOnCopy,
  children,
  copyTimeout,
  onCopyStyle,
  style,
  onCopy,
}: {
  copyText: string;
  replaceTextOnCopy?: ReactNode;
  children?: ReactNode;
  copyTimeout?: number;
  onCopyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const lastCopy = useRef(-1);

  const timeoutLength = copyTimeout || defaultTimeout;
  const handleCopy = () => {
    if (Date.now() - lastCopy.current < timeoutLength) {
      return;
    }
    lastCopy.current = Date.now();
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => {
        setCopied(false);
      }, timeoutLength);
    });
  };

  return (
    <Button onClick={handleCopy} style={{...style, ...(copied ? onCopyStyle : {})}}>
      {copied ? replaceTextOnCopy : children || defaultChildren}
    </Button>
  );
}
