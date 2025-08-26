import {
  isValidSiteSectionFeaturedEvent,
  isValidSiteSectionLatestQnA,
  isValidSiteSectionLeadership,
  isValidSiteSectionSearch,
  isValidSiteSectionSplitHero,
} from "@/app/_utils/types/cms/cmsTypeValidation";
import { ReactNode } from "react";
import FeaturedEventSection from "../FeaturedEventSection/FeaturedEventSection";
import LatestQnASection from "../LatestQnASection/LatestQnASection";
import SearchSection from "../SearchSection/SearchSection";
import { SiteSection } from "@/app/_utils/types/cms/cmsTypes";
import SplitHeroSection from "../SplitHeroSection/SplitHeroSection";
import LeadershipSection from "../LeadershipSection/LeadershipSection";

export default function SectionsRenderer({
  sections,
}: {
  sections: SiteSection[];
}) {
  return (
    <>
      {sections.map((section, i) => {
        let Comp: ReactNode = undefined;
        const id = section.id;
        if (isValidSiteSectionLeadership(section)) {
          Comp = <LeadershipSection sectionID={section.sectionID} key={id} />;
        }
        if (isValidSiteSectionFeaturedEvent(section)) {
          Comp = <FeaturedEventSection sectionID={section.sectionID} key={id} />;
        } else if (isValidSiteSectionLatestQnA(section)) {
          Comp = (
            <LatestQnASection sectionID={section.sectionID}
              reverseOnDesktop={section.reverseOnDesktop}
              key={id}
            />
          );
        } else if (isValidSiteSectionSearch(section)) {
          Comp = (
            <SearchSection sectionID={section.sectionID}
              header={section.header}
              type={section.type}
              listingMode={section.listingMode}
              defaultSortingMode={section.defaultSortingMode}
              key={id}
            />
          );
        } else if (isValidSiteSectionSplitHero(section)) {
          Comp = <SplitHeroSection {...section} key={id} />;
        }
        if (!Comp) return null;
        return Comp;
      })}
    </>
  );
}
