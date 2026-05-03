import { HeroTextBlock as HeroTextBlockProps } from "@shared/types/cms/CMSTypes";
import { CSSProperties, Fragment, ReactNode } from "react";
import styles from "./HeroTextBlock.module.css";
import CMSButton from "@/app/_components/Button/CMSButton/CMSButton";

export function HeroTextBlock({
  preheader,
  header,
  headerType,
  subheader,
  buttonsVisible,
  buttons,
  alignment,
}: HeroTextBlockProps) {
  // Alignment rides on CSS variables rather than inline styles so a page can
  // override it at a breakpoint (inline styles can't be beaten by a media query).
  let trueAlignment = "start";
  if (alignment === "center") trueAlignment = "center";
  else if (alignment === "right") trueAlignment = "end";

  function toNode(
    text?: string,
    type?:
      | HeroTextBlockProps["headerType"]
      | "Title"
      | "BodySmall"
      | "SubtitleRegular",
  ): ReactNode {
    return extractRichText(text, type);
  }

  const preheaderNode = toNode(preheader, "BodySmall");
  const headerNode = toNode(header, headerType ? headerType : "Title");
  const subheaderNode = toNode(subheader, "SubtitleRegular");

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={
          {
            "--hero-text-block-align": trueAlignment,
            "--hero-text-block-text-align": alignment,
          } as CSSProperties
        }
        className={styles.textBlockInner}
      >
        <div className={styles.heroHeader}>
          {preheader && (
            <span className={`BodySmall ${styles.span}`}>{preheaderNode}</span>
          )}
          {header && (
            <div className={headerType ? ` ${headerType}` : "Title"}>
              {headerNode}
            </div>
          )}
        </div>
        {subheader && (
          <div style={{ whiteSpace: "pre-line" }} className="SubtitleRegular">
            {subheaderNode}
          </div>
        )}
        {buttonsVisible && (
          <div className={styles.heroButtons}>
            {buttons?.map((button, index) => (
              <CMSButton key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Gradient start/end stops per color family. toStop is the base; LENGTH_WEIGHT shifts it darker for longer words.
const COLOR_CONFIG: Record<string, { family: string; fromStop: number; toStop: number }> = {
  primary:   { family: "primary",   fromStop: 500, toStop: 600 },
  secondary: { family: "secondary", fromStop: 400, toStop: 500 },
  accent:    { family: "accent",    fromStop: 400, toStop: 500 },
  neutral:   { family: "neutral",   fromStop: 100, toStop: 200 },
};
const LENGTH_WEIGHT = 0.06;

function extractColorSpans(
  str: string,
  type?:
    | HeroTextBlockProps["headerType"]
    | "Title"
    | "BodySmall"
    | "BodyRegular"
    | "SubtitleRegular",
) {
  // gets texts and applies color ${color}(text). e.g.: "${primary}(Yo!!!), Hello $(secondary){World}"
  const result: ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;

  while (i < str.length) {
    if (str[i] === "$" && str[i + 1] === "[") {
      const nameStart = i + 2;
      const nameEnd = str.indexOf("]", nameStart);
      if (nameEnd === -1 || str[nameEnd + 1] !== "(") { i++; continue; }

      const textStart = nameEnd + 2;
      const textEnd = str.indexOf(")", textStart);
      if (textEnd === -1) { i++; continue; }

      // push plain text before this span
      if (i > lastIndex) {
        result.push(<span key={`t${i}`} className={type}>{str.substring(lastIndex, i)}</span>);
      }

      const colorName = str.substring(nameStart, nameEnd).toLowerCase().trim();
      const spanText = str.substring(textStart, textEnd);
      const config = COLOR_CONFIG[colorName];

      if (config) {
        const stopShift = Math.min(4, Math.round(spanText.length * LENGTH_WEIGHT));
        const fromVar = `--color-${config.family}-${config.fromStop}`;
        const toVar = `--color-${config.family}-${config.toStop + stopShift * 100}`;
        result.push(
          <span
            key={i}
            className={type}
            style={{
              background: `linear-gradient(to right, rgba(var(${fromVar}), 1), rgba(var(${toVar}), 1))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
              color: "transparent",
            }}
          >
            {spanText}
          </span>
        );
      } else {
        result.push(<span key={i} className={type}>{spanText}</span>);
      }

      lastIndex = textEnd + 1;
      i = lastIndex;
    } else {
      i++;
    }
  }

  result.push(<span key="end" className={type}>{str.substring(lastIndex)}</span>);
  return result;
}

// Renders text with `\n` markers as line breaks AND `$[color](text)` spans, the
// same handling SplitHeroSection uses for its text. Reuse for any CMS-authored
// rich text field that should honor author line breaks.
export function extractRichText(
  str?: string,
  type?:
    | HeroTextBlockProps["headerType"]
    | "Title"
    | "BodySmall"
    | "BodyRegular"
    | "SubtitleRegular",
): ReactNode {
  if (!str) return null;
  // Break on both the literal "\n" marker an author may type AND real newline
  // characters (e.g. pressing Enter in a CMS textarea).
  const NEWLINE = String.fromCharCode(10);
  const lines = str.split(/\\n/g).join(NEWLINE).split(NEWLINE);
  return lines.map((line, idx) => (
    <Fragment key={idx}>
      {extractColorSpans(line, type)}
      {idx < lines.length - 1 && <br />}
    </Fragment>
  ));
}


