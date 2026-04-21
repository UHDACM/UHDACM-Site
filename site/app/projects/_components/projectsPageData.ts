"use server";

import { fetchCMS } from "@/app/_utils/cms";
import { isValidProjectsPage } from "@shared/types/cms/CMSCheck";
import { ProjectsPage } from "@shared/types/cms/CMSTypes";

/**
 * Fetches the `projects-page` single type — the CMS-editable copy for the
 * projects intro and the "Join Projects" call to action.
 *
 * Returns undefined rather than throwing when the CMS is unreachable or the
 * single type has not been created yet, so callers can render nothing instead
 * of taking the page down.
 */
export async function getProjectsPageData(): Promise<ProjectsPage | undefined> {
  const res = await fetchCMS("projects-page", { populate: "*" });
  const data = res?.data;
  if (!isValidProjectsPage(data)) {
    return undefined;
  }
  return data;
}
