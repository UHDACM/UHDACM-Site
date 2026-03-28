'use server'
import { buildCMSFetchURL, cmsPageFetchParams } from "@shared/types/cms/CMSFuncs";
import {
  cmsSingleTypePage,
} from "@shared/types/cms/CMSTypes";
import { fetchableCMSCollection } from "@shared/types/cms/CMSTypes";
import { private_env_vars } from "./private_env_vars";
import { public_env_vars } from "./public_env_vars";


// TODO: swap with entity service
export async function fetchCMS(
  path: fetchableCMSCollection,
  params?: Record<string, any>,
  additionalTags?: fetchableCMSCollection[] | "any",
) {
  try {
    const { url, dependencyTags } = buildCMSFetchURL(`${public_env_vars.NEXT_PUBLIC_CMS_URL}`, path, params, additionalTags);
    if (!url) {
      console.error('77cshias', path, params, additionalTags)
      throw new Error('Could not generate fetch url');
    }
    const res = await fetch(url, {
      next: {
        tags: dependencyTags,
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${private_env_vars.STRAPI_API_TOKEN}`,
      },
    });
    if (!res.ok) {
      // console.log("!!!!!!!!!!error!!!!!!!!!!\n", res);
      // console.log({
      //   Authorization: `Bearer ${private_env_vars.STRAPI_API_TOKEN}`,
      // });
      try {
        console.log('raw res.text()', await res.text());
      } catch {
        console.log('could not print text');
      }
      throw new Error(`Failed to fetch API: ${path}`);
    }
    const data = await res.json();
    console.log("fetched data:", path, data);
    return data;
  } catch {
    return null;
  }
}

export async function fetchCMSPage(page: cmsSingleTypePage) {
  return await fetchCMS(page, cmsPageFetchParams);
}

/**
 * Fetches every page of a Strapi collection and returns one merged response.
 * Use when the caller needs the full set of records (e.g. a client-side search
 * over all events). Loops at pageSize=100 (Strapi v4's default max) using
 * meta.pagination.pageCount from the first response.
 */
export async function fetchCMSAll(
  path: fetchableCMSCollection,
  params?: Record<string, any>,
  additionalTags?: fetchableCMSCollection[] | "any",
) {
  const pageSize = 100;
  const firstPage = await fetchCMS(
    path,
    { ...params, "pagination[page]": 1, "pagination[pageSize]": pageSize },
    additionalTags,
  );
  if (!firstPage || !Array.isArray(firstPage.data)) {
    return { data: [], meta: null };
  }
  const pageCount: number = firstPage?.meta?.pagination?.pageCount ?? 1;
  const merged: any[] = [...firstPage.data];
  for (let page = 2; page <= pageCount; page++) {
    const next = await fetchCMS(
      path,
      { ...params, "pagination[page]": page, "pagination[pageSize]": pageSize },
      additionalTags,
    );
    if (!next || !Array.isArray(next.data)) break;
    merged.push(...next.data);
  }
  return { data: merged, meta: firstPage.meta };
}