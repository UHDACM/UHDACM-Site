import SplitHeroSection from "@/app/_sections/SplitHeroSection/SplitHeroSection";
import {
  SplitHeroColumnSingleImage,
  SplitHeroColumnTextBlock,
} from "@shared/types/cms/CMSTypes";
import { getProjectsPageData } from "./projectsPageData";
import styles from "../projects.module.css";

/**
 * Intro hero for /projects.
 *
 * The projects page deliberately skips PageRenderer (which only understands a
 * sections dynamiczone) and instead composes SplitHeroSection directly from the
 * flat `page-projects` fields. SplitHeroSection's props are
 * Omit<SiteSectionSplitHero, "__component" | "id">, so a plain object literal
 * is all it needs.
 */
export default async function ProjectsIntroSection() {
  const data = await getProjectsPageData();
  if (!data) return null;

  const textBlock: SplitHeroColumnTextBlock = {
    type: "textBlock",
    textBlock: {
      header: data.introTitle,
      headerType: "H1",
      alignment: "left",
      buttonsVisible: false,
      ...(data.introSubtitle ? { subheader: data.introSubtitle } : {}),
    },
  };

  const image: SplitHeroColumnSingleImage | undefined = data.introImage
    ? { type: "singleImage", singleImage: { image: data.introImage } }
    : undefined;

  return (
    <div className={styles.introMobileCenter}>
      <SplitHeroSection
        sectionID="intro"
        leftComponent={textBlock}
        centerIfPossible={!image}
        reverseOnDesktop={false}
        reverseOnMobile={false}
        {...(image ? { rightComponent: image } : {})}
      />
    </div>
  );
}
