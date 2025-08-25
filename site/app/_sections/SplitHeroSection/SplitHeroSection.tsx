import React, { ReactNode } from "react";

import styles from "./SplitHeroSection.module.css";
import {
  HeroTextBlock as HeroTextBlockProps,
  SiteSectionSplitHero,
  SplitHeroColumn
} from "@/app/_utils/types/cms/cmsTypes";
import CMSButton from "@/app/_components/Button/CMSButton/CMSButton";
import {
  isValidSplitHeroColumnImageCollection,
  isValidSplitHeroColumnNone,
  isValidSplitHeroColumnSingleImage,
  isValidSplitHeroColumnTextBlock,
} from "@/app/_utils/types/cms/cmsTypeValidation";
import HeroSingleImage from "./HeroSingleImage/HeroSingleImage";
import HeroImageCollection from "./HeroImageCollection/HeroImageCollection";

function SplitHeroColumnToComponent(component?: SplitHeroColumn) {
  if (component == null) {
    return null;
  }
  if (isValidSplitHeroColumnNone(component)) {
    return;
  } else if (isValidSplitHeroColumnTextBlock(component)) {
    const { textBlock } = component;
    return <HeroTextBlock {...textBlock} />;
  } else if (isValidSplitHeroColumnSingleImage(component)) {
    const { singleImage } = component;
    return <HeroSingleImage image={singleImage.image} />;
  } else if (isValidSplitHeroColumnImageCollection(component)) {
    return <HeroImageCollection images={component.imageCollection.images} />;
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
  reverseOnDesktop,
  reverseOnMobile,
  sectionID,
}) => {
  let leftComp = SplitHeroColumnToComponent(leftComponent);
  let rightComp = SplitHeroColumnToComponent(rightComponent);

  if (!centerIfPossible) {
    if (!leftComp) {
      leftComp = <div style={{ flex: 1 }} />;
    }
    if (!rightComp) {
      rightComp = <div style={{ flex: 1 }} />;
    }
  }

  return (
    <div className={`${styles.heroSection} SectionRoot`} id={sectionID}>
      <div
        className={`${styles.heroInner} SectionInner ${
          reverseOnDesktop ? styles.reverseOnDesktop : ""
        } ${reverseOnMobile ? styles.reverseOnMobile : ""}`}
      >
        {leftComp}
        {rightComp}
      </div>
    </div>
  );
};

function HeroTextBlock({
  preheader,
  header,
  headerType,
  subheader,
  buttonsVisible,
  buttons,
  alignment,
}: HeroTextBlockProps) {
  let trueAlignment = "start";
  if (alignment === "center") trueAlignment = "center";
  else if (alignment === "right") trueAlignment = "end";

  function toNode(text?: string): ReactNode {
    if (!text) return null;
    const lines = text.split("\\n");
    return lines.map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        {idx < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  const preheaderNode = toNode(preheader);
  const headerNode = toNode(header);
  const subheaderNode = toNode(subheader);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "auto",
          alignItems: trueAlignment,
          boxSizing: "border-box",
        }}
      >
        <div className={styles.heroHeader}>
          {preheader && (
            <span
              style={{ textAlign: alignment }}
              className={`BodySmall ${styles.span}`}
            >
              {preheaderNode}
            </span>
          )}
          {header && (
            <div
              className={headerType ? ` ${headerType}` : "Title"}
              style={{ textAlign: alignment }}
            >
              {headerNode}
            </div>
          )}
        </div>
        {subheader && (
          <div
            style={{ whiteSpace: "pre-line", textAlign: alignment }}
            className="SubtitleRegular"
          >
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


export default SplitHeroSection;
