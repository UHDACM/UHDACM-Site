import {
  isValidSiteSectionFeaturedEvent,
  isValidSiteSectionLatestQnA,
  isValidSiteSectionSearch,
  isValidSiteSectionSplitHero,
} from "@/app/_utils/types/cms/cmsTypeValidation";
import { ReactNode } from "react";
import FeaturedEventSection from "../FeaturedEventSection/FeaturedEventSection";
import LatestQnASection from "../LatestQnASection/LatestQnASection";
import SearchSection from "../SearchSection/SearchSection";
import { SiteSection } from "@/app/_utils/types/cms/cmsTypes";
import SplitHeroSection from "../SplitHeroSection/SplitHeroSection";
import styles from "./SectionsRenderer.module.css";

export default function SectionsRenderer({
  sections,
}: {
  sections: SiteSection[];
}) {
  return (
    <>
      <div className={styles.NavbarPadding} />
      {sections.map((section, i) => {
        let Comp: ReactNode = undefined;
        if (isValidSiteSectionFeaturedEvent(section)) {
          Comp = <FeaturedEventSection key={i} />;
        } else if (isValidSiteSectionLatestQnA(section)) {
          Comp = (
            <LatestQnASection
              reverseOnDesktop={section.reverseOnDesktop}
              key={i}
            />
          );
        } else if (isValidSiteSectionSearch(section)) {
          Comp = (
            <SearchSection
              header={section.header}
              type={section.type}
              listingMode={section.listingMode}
              defaultSortingMode={section.defaultSortingMode}
              key={i}
            />
          );
        } else if (isValidSiteSectionSplitHero(section)) {
          Comp = <SplitHeroSection {...section} key={i} />;
        }
        if (!Comp) return null;
        return Comp;
      })}
    </>
  );
}
