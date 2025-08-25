import { fetchCMSPage } from "../_utils/cms";
import { SiteSection } from "../_utils/types/cms/cmsTypes";
import { isValidSiteSection, isValidSiteSectionFeaturedEvent, isValidSiteSectionLatestQnA } from "../_utils/types/cms/cmsTypeValidation";
import Page404 from "../not-found";
import SectionsRenderer from "../_sections/SectionRenderer/SectionsRenderer";

export default async function Page() {
  const res = await fetchCMSPage("page-about");
  // console.log('res', res);
  const data = res.data;

  console.log('Fetched page-about data:', JSON.stringify(data, null, 2));

  const sections: SiteSection[] = data.sections;
  for (let section of sections) {
    if (!isValidSiteSection(section)) {
      console.log('Invalid section found:', section);
      return <Page404 customMessage={"Some or all of the requested page could not be generated "} />
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
      <SectionsRenderer sections={sections} />
    </div>
  );
}