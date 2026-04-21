import SplitHeroSection from "@/app/_sections/SplitHeroSection/SplitHeroSection";
import { SplitHeroColumnTextBlock } from "@shared/types/cms/CMSTypes";
import { getProjectsPageData } from "./projectsPageData";

/**
 * "Join Projects" call to action, rendered at the bottom of both /projects and
 * /projects/<slug>.
 *
 * The Join button goes through the CMSButton renderer, which already reports
 * `cms_button_click` to PostHog — so the signup CTA is measurable without any
 * extra instrumentation here.
 */
export default async function JoinProjectsSection() {
  const data = await getProjectsPageData();
  if (!data) return null;

  const textBlock: SplitHeroColumnTextBlock = {
    type: "textBlock",
    textBlock: {
      header: data.joinTitle,
      headerType: "H1",
      alignment: "center",
      buttonsVisible: true,
      buttons: [
        {
          text: "Join",
          icon: "chevron-right",
          isIconOnRightSide: true,
          href: data.joinFormUrl,
          target: "_blank",
        },
      ],
      ...(data.joinSubtitle ? { subheader: data.joinSubtitle } : {}),
    },
  };

  return (
    <SplitHeroSection
      sectionID="join"
      leftComponent={textBlock}
      centerIfPossible={true}
      reverseOnDesktop={false}
      reverseOnMobile={false}
    />
  );
}
