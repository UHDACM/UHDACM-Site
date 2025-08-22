import React from "react";

import styles from "./MainHeroSection.module.css";

interface MainHeroSectionProps {
  reverseOrder?: boolean;
  dontReverseOnMobile?: boolean;
  topLevelStyle?: React.CSSProperties;
  topLevelClassName?: string;
  leftStyle?: React.CSSProperties;
  rightContent?: React.ReactNode;
  rightStyle?: React.CSSProperties;
  spanText?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  bottomContent?: React.ReactNode;
  addNavbarPadding?: boolean;
}

const MainHeroSection: React.FC<MainHeroSectionProps> = ({
  reverseOrder = false,
  topLevelStyle = {},
  topLevelClassName,
  leftStyle = {},
  rightStyle = {},
  spanText,
  title,
  titleClassName,
  subtitle,
  bottomContent,
  rightContent,
  dontReverseOnMobile,
  addNavbarPadding
}) => {
  return (
    <div className={`${styles.heroSection} ${topLevelClassName} ${addNavbarPadding && styles.addNavbarPadding}`} style={topLevelStyle}>
      <div className={`${reverseOrder && styles.heroRowReverse} ${styles.heroRow} ${dontReverseOnMobile && styles.dontReverseOnMobile}`}>
        <div className={styles.heroLeft} style={leftStyle}>
          {(spanText || title) && (
            <div className={styles.heroHeader}>
              {spanText && (
                <span className={`BodySmall ${styles.span}`}>{spanText}</span>
              )}
              {title && (
                <div
                  className={titleClassName ? ` ${titleClassName}` : "Title"}
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
          {bottomContent && (
            <div className={styles.heroBottom}>{bottomContent}</div>
          )}
        </div>
        <div style={rightStyle} className={styles.heroRight}>
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default MainHeroSection;
