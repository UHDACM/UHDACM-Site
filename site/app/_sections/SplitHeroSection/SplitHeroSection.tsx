import React, { ReactNode } from "react";

import styles from "./SplitHeroSection.module.css";
import { HeroTextBlock, SiteSectionSplitHero, SplitHeroColumn, SplitHeroColumnType } from "@/app/_utils/types/cms/cmsTypes";
import CMSButton from "@/app/_components/Button/CMSButton/CMSButton";
import { isValidSplitHeroColumnNone, isValidSplitHeroColumnTextBlock } from "@/app/_utils/types/cms/cmsTypeValidation";


function SplitHeroColumnToComponent(component: SplitHeroColumn) {
  if (isValidSplitHeroColumnNone(component)) {
    return;
  } else if (isValidSplitHeroColumnTextBlock(component)) {
    const { textBlock } = component;
    return <HeroTextBlockSection {...textBlock} />;
  } 
  // else if (type == 'form') {
  //   return <HeroFormSection {...props} />;
  // } else if (type == 'imageCollection') {
  //   return <HeroImageCollectionSection {...props} />;
  // }
}

type SplitHeroSectionProps = Omit<SiteSectionSplitHero, "__component" | "id">;

const SplitHeroSection: React.FC<SplitHeroSectionProps> = ({
  leftComponent,
  rightComponent,
  centerIfPossible,
  sectionID
}) => {
  let leftComp = leftComponent ? SplitHeroColumnToComponent(leftComponent) : null;
  let rightComp = rightComponent ? SplitHeroColumnToComponent(rightComponent) : null;

  if (!centerIfPossible) {
    if (!leftComp) {
      leftComp = <div style={{flex: 1}} />
    }
    if (!rightComp) {
      rightComp = <div style={{flex: 1}} />
    }
  }

  return (
    <div
      className={`${styles.heroSection} SectionRoot`}
      id={sectionID}
    >
      <div className="SectionInner" style={{
        display: 'flex', flexDirection: 'row'
      }}>
        {leftComp}
        {rightComp}
      </div>
    </div>
  );
};

function HeroTextBlockSection({
  preheader,
  header,
  headerType,
  subheader,
  buttonsVisible,
  buttons,
  alignment,
}: HeroTextBlock) {
  let trueAlignment = "start";
  if (alignment === "center") trueAlignment = "center";
  else if (alignment === "right") trueAlignment = "end";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: trueAlignment,
        boxSizing: "border-box",
        flex: 1,
      }}
    >
      <div className={styles.heroHeader}>
        {preheader && (
          <span
            style={{ textAlign: alignment }}
            className={`BodySmall ${styles.span}`}
          >
            {preheader}
          </span>
        )}
        {header && (
          <div
            className={headerType ? ` ${headerType}` : "Title"}
            style={{ whiteSpace: "pre-line", textAlign: alignment }}
          >
            {header}
          </div>
        )}
      </div>
      {subheader && (
        <div
          style={{ whiteSpace: "pre-line", textAlign: alignment }}
          className="SubtitleRegular"
        >
          {subheader}
        </div>
      )}
      {buttonsVisible && (
        <div
          className={styles.heroButtons}
        >
          {buttons?.map((button, index) => (
            <CMSButton key={index} {...button} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SplitHeroSection;
