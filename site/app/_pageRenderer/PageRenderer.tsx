import SectionsRenderer from "../_sections/SectionRenderer/SectionsRenderer";
import { fetchCMSPage } from "../_utils/cms";
import { cmsSingleTypePage, SiteSection } from "../_utils/types/cms/cmsTypes";
import { isValidSiteSection } from "../_utils/types/cms/cmsTypeValidation";
import Page404 from "../not-found";

export default async function PageRenderer({ lostMessage, page }: { lostMessage?: string, page: cmsSingleTypePage }) {
  const res = await fetchCMSPage(page);
  if (!res || !res.data) {
    return <Page404 customMessage={lostMessage || "Page not found"} />;
  }
  // console.log('res', res);
  const data = res.data;

  // console.log("Fetched page-home data:", JSON.stringify(data, null, 2));

  const sections: SiteSection[] = data.sections;
  for (let section of sections) {
    if (!isValidSiteSection(section)) {
      // console.log("Invalid section found:", section);
      return (
        <Page404
          customMessage={
            "Some or all of the requested page could not be generated"
          }
        />
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SectionsRenderer sections={sections} />
    </div>
  );
}
