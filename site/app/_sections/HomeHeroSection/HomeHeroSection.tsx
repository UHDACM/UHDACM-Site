import React from "react";

import styles from "./HomeHeroSection.module.css";

interface MainHeroSectionProps {
  reverseOrder?: boolean;
  topLevelStyle?: React.CSSProperties;
  leftStyle?: React.CSSProperties;
  spanText?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  bottomContent?: React.ReactNode;
}

const HomeHeroSection: React.FC<MainHeroSectionProps> = ({
  reverseOrder = false,
  topLevelStyle = {},
  leftStyle = {},
  spanText,
  title,
  titleClassName,
  subtitle,
  bottomContent,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        padding: "0rem 1rem",
        paddingTop: '2.5rem',
        display: "flex",
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
          alignItems: "center",
          width: '90vw',
          maxWidth: '40rem',
          boxSizing: "border-box",
          ...leftStyle,
        }}
      >
        {(spanText || title) && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0rem" }}
          >
            {spanText && (
              <span style={{display: 'none'}} className={`BodySmall ${styles.span}`}>{spanText}</span>
            )}
            {title && (
              <div
                className={`${
                  titleClassName ? ` ${titleClassName}` : "Title"
                }`}
                style={{ whiteSpace: "pre-line", textAlign: 'center' }}
              >
                {title}
              </div>
            )}
          </div>
        )}
        {subtitle && (
          <div style={{ whiteSpace: "pre-line", textAlign: 'center' }} className="SubtitleRegular">
            {subtitle}
          </div>
        )}
        {bottomContent && <>{bottomContent}</>}
      </div>
    </div>
  );
};

export default HomeHeroSection;
