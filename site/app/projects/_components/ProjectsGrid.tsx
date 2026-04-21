import SearchTileV2, {
  SearchTileMeta,
} from "@/app/_components/SearchTileV2/SearchTileV2";
import { fetchCMSAll } from "@/app/_utils/cms";
import { public_env_vars } from "@/app/_utils/public_env_vars";
import {
  ProduceProjectDateText,
  TryGetImageFormatUrl,
} from "@/app/_utils/types/cms/cmsTypeTools";
import { isValidSiteProjectSummary } from "@shared/types/cms/CMSCheck";
import { SiteProjectSummary } from "@shared/types/cms/CMSTypes";
import styles from "../projects.module.css";

/**
 * The /projects card grid.
 *
 * Deliberately not SearchSectionV2: with a handful of projects, a search bar
 * and filter tabs are noise. The card component itself is reused as-is.
 */
export default async function ProjectsGrid() {
  const cmsUrl = public_env_vars.NEXT_PUBLIC_CMS_URL;

  const res = await fetchCMSAll("projects", {
    "fields[0]": "urlSlug",
    "fields[1]": "name",
    "fields[2]": "dateStart",
    "fields[3]": "dateEnd",
    "fields[4]": "descriptionShort",
    "populate[previewImage]": "true",
    // ids only — the grid needs the participant count, not the records
    "populate[people][fields][0]": "id",
  });

  const projects: SiteProjectSummary[] = [];
  for (const raw of Array.isArray(res.data) ? res.data : []) {
    // Read the relation off the raw payload: `people` is not part of the
    // summary type, we only ever want its length.
    const peopleCount = Array.isArray(raw?.people) ? raw.people.length : 0;
    if (isValidSiteProjectSummary(raw)) {
      projects.push({ ...raw, peopleCount });
    }
  }

  projects.sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime(),
  );

  return (
    <div className="SectionRoot">
      <div className={`SectionInner ${styles.innerStyling}`}>
        {projects.length === 0 ? (
          <div className={`BodyLargeHeavy ${styles.empty}`}>
            No projects to show yet — check back soon.
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => {
              const imgUrl = project.previewImage
                ? TryGetImageFormatUrl(project.previewImage, "medium", cmsUrl)
                : undefined;

              const meta: SearchTileMeta[] = [
                {
                  icon: "calendar",
                  color: "primary",
                  text: ProduceProjectDateText(
                    project.dateStart,
                    project.dateEnd,
                  ),
                },
              ];
              if (project.peopleCount) {
                meta.push({
                  icon: "people",
                  color: "secondary",
                  text: `${project.peopleCount} ${
                    project.peopleCount === 1 ? "person" : "people"
                  }`,
                });
              }

              return (
                <SearchTileV2
                  key={project.id}
                  title={project.name}
                  subtitle={project.descriptionShort}
                  image={{
                    src: imgUrl,
                    alt: project.previewImage?.alternativeText,
                  }}
                  meta={meta}
                  href={`/projects/${project.urlSlug}`}
                  entryTypeLabel="PROJECT"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
