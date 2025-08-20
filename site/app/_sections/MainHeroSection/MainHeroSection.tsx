import React from "react";

import styles from "./MainHeroSection.module.css";

interface MainHeroSectionProps {
  reverseOrder?: boolean;
  topLevelStyle?: React.CSSProperties;
  leftStyle?: React.CSSProperties;
  rightContent?: React.ReactNode;
  rightStyle?: React.CSSProperties;
  spanText?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  bottomContent?: React.ReactNode;
}

const MainHeroSection: React.FC<MainHeroSectionProps> = ({
  reverseOrder = false,
  topLevelStyle = {},
  leftStyle = {},
  rightStyle = {},
  spanText,
  title,
  titleClassName,
  subtitle,
  bottomContent,
  rightContent,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        padding: "0rem 2rem",
        boxSizing: "border-box",
        flexDirection: reverseOrder ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "center",
        ...topLevelStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "start",
          padding: "0rem 2rem",
          boxSizing: "border-box",
          ...leftStyle,
        }}
      >
        {(spanText || title) && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0rem" }}
          >
            {spanText && (
              <span className={`BodySmall ${styles.span}`}>{spanText}</span>
            )}
            {title && (
              <div
                className={`${
                  titleClassName ? ` ${titleClassName}` : "FontTitle"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {title}
              </div>
            )}
          </div>
        )}
        {subtitle && (
          <div style={{ whiteSpace: "pre-line" }} className="SubtitleRegular">
            {subtitle}
          </div>
        )}
        {bottomContent && <>{bottomContent}</>}
      </div>
      <div style={{ ...rightStyle }}>{rightContent}</div>
    </div>
  );
};

export default MainHeroSection;
