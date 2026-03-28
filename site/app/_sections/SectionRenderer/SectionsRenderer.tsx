import {
  isValidSiteSectionAnnouncement,
  isValidSiteSectionCardSection,
  isValidSiteSectionFeatureCard,
  isValidSiteSectionFeaturedEvent,
  isValidSiteSectionLatestQnA,
  isValidSiteSectionLeadership,
  isValidSiteSectionSearch,
  isValidSiteSectionSplitHero,
  isValidSiteSectionVerticalTimeline,
} from "@shared/types/cms/CMSCheck";
import { ReactNode } from "react";
import FeaturedEventSection from "../FeaturedEventSection/FeaturedEventSection";
import LatestQnASection from "../LatestQnASection/LatestQnASection";
import SearchSection from "../SearchSection/SearchSection";
import { SiteSection } from "@shared/types/cms/CMSTypes";
import SplitHeroSection from "../SplitHeroSection/SplitHeroSection";
import LeadershipSection from "../LeadershipSection/LeadershipSection";
import AnnouncementSection from "../AnnouncementCarouselSection/AnnoucementCarouselSection";
import FeatureCardSection from "../FeatureCardSection/FeatureCardSection";
import CardSection from "../CardSection/CardSection";
import VerticalTimelineSection from "../VerticalTimelineSection/VerticalTimelineSection";
import SearchSectionV2 from "../SearchSectionV2/SearchSectionV2";

export default function SectionsRenderer({
  sections,
}: {
  sections: SiteSection[];
}) {
  return (
    <>
      {sections.map((section) => {
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
          // Comp = (
          //   <SearchSection sectionID={section.sectionID}
          //     header={section.header}
          //     type={section.type}
          //     listingMode={section.listingMode}
          //     defaultSortingMode={section.defaultSortingMode}
          //     key={id}
          //   />
          // );
          Comp = (
            <SearchSectionV2 
              sectionID={section.sectionID}
              title={section.header}
              type={section.type == 'galleries' ? 'events' : section.type}
              // listingMode={section.listingMode}
              // defaultSortingMode={section.defaultSortingMode}
              key={id}
            />
          );
        } else if (isValidSiteSectionSplitHero(section)) {
          Comp = <SplitHeroSection {...section} key={id} />;
        } else if (isValidSiteSectionAnnouncement(section)) {
          Comp = <AnnouncementSection {...section} key={id} />;
        } else if (isValidSiteSectionAnnouncement(section)) {
          Comp = <AnnouncementSection {...section} key={id} />;
        } else if (isValidSiteSectionFeatureCard(section)) {
          Comp = <FeatureCardSection {...section} key={id} />;
        } else if (isValidSiteSectionCardSection(section)) {
          Comp = <CardSection {...section} key={id} />;
        } else if (isValidSiteSectionVerticalTimeline(section)) {
          Comp = <VerticalTimelineSection {...section} key={id} />;
        }
        if (!Comp) return null;
        return Comp;
      })}
    </>
  );
}
