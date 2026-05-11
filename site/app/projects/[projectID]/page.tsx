import Button from "@/app/_components/Button/Button";

import { fetchCMS } from "@/app/_utils/cms";
import { isValidSiteProject } from "@shared/types/cms/CMSCheck";
import Page404 from "@/app/not-found";
import ProjectPageClientComponent from "./ProjectPageClientComponent";
import { WrapInNavbarAndFooter } from "@/app/_utils/tsxServerTools";
import { NavbarPadding } from "@/app/_pageRenderer/PageRenderer";
import JoinProjectsSection from "../_components/JoinProjectsSection";

type ProjectPageParams = Promise<{
  projectID: string;
}>;

export const generateStaticParams = async () => {
  const res = await fetchCMS("projects", {});

  const paths: string[] = [];
  if (res && Array.isArray(res.data)) {
    for (const project of res.data) {
      if (project?.urlSlug) {
        paths.push(project.urlSlug);
      }
    }
  }

  return paths.map((projectID) => ({ projectID }));
};

export default async function ProjectPage({
  params,
}: {
  params: ProjectPageParams;
}) {
  const { projectID } = await params;
  const res = await fetchCMS(
    "projects",
    {
      "populate[0]": "previewImage",
      "populate[1]": "people",
      "populate[2]": "people.picture",
      "populate[3]": "people.socials",
      "filters[urlSlug][$eq]": projectID,
    },
    // cross-tagged on people so editing a participant busts this page too
    // (tags are passed in plural form; buildCMSFetchURL singularizes them)
    ["people"],
  );

  if (!res) {
    return <ProjectPage404 />;
  }

  const project = Array.isArray(res.data) ? res.data[0] : undefined;

  if (!project || !isValidSiteProject(project)) {
    return <ProjectPage404 />;
  }


  return (
    <WrapInNavbarAndFooter>
      <NavbarPadding />
      <ProjectPageClientComponent project={project} />
      <JoinProjectsSection />
    </WrapInNavbarAndFooter>
  );
}

function ProjectPage404() {
  return (
    <Page404
      customMessage={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            gap: "0.5rem",
          }}
        >
          <h1 className="H4">Project not found</h1>
          <Button href="/projects">Back to Projects</Button>
        </div>
      }
    />
  );
}
