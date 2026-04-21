import { NavbarPadding } from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";
import JoinProjectsSection from "./_components/JoinProjectsSection";
import ProjectsGrid from "./_components/ProjectsGrid";
import ProjectsIntroSection from "./_components/ProjectsIntroSection";

/**
 * /projects composes its sections directly rather than going through
 * PageRenderer, which only renders a CMS sections dynamiczone. That is the
 * intended departure from the component-based page styling — the copy still
 * comes from the CMS, via the flat `projects-page` single type.
 */
export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <NavbarPadding />
      <ProjectsIntroSection />
      <ProjectsGrid />
      <JoinProjectsSection />
    </WrapInNavbarAndFooter>
  );
}
