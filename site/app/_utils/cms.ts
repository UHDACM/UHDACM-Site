import { objectToUrlParams } from "./tools";
import {
  cmsCollectionPlural,
  cmsCollectionSingular,
  cmsSingleType,
  cmsSingleTypePage,
} from "./types/cms/cmsTypes";
import {
  isCMSCollectionPlural,
  isCMSSingleType,
  cmsCollectionPluralToSingular,
  isCMSSingleTypePage,
} from "./types/cms/cmsTypeValidation";

type fetchableCMSCollection =
  | cmsCollectionPlural
  | cmsSingleType
  | cmsSingleTypePage;
type cmsCollectionSingulars =
  | cmsCollectionSingular
  | cmsSingleType
  | cmsSingleTypePage | 'any';

// TODO: swap with entity service
export async function fetchCMS(
  path: fetchableCMSCollection,
  params?: Record<string, any>,
  additionalTags?: fetchableCMSCollection[] | "any"
) {
  let collectionTag: cmsCollectionSingulars | undefined =
    convertFetchableToSingular(path);
    
  if (!collectionTag) {
    console.log("failed to find collection tag", path);
    // this should never happen
    return undefined;
  }

  const dependencyTags: cmsCollectionSingulars[] = [collectionTag];
  if (additionalTags) {
    if (Array.isArray(additionalTags)) {
      for (const tag of additionalTags) {
        const singularTag = convertFetchableToSingular(tag);
        if (singularTag) {
          dependencyTags.push(singularTag);
        }
      }
    } else if (additionalTags === "any") {
      // If additionalTags is "any", we can add all possible tags
      dependencyTags.push("any");
    }
  }

  try {
    const urlParams = params ? objectToUrlParams(params) : undefined;
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/${path}${
      urlParams ? `?${urlParams}` : ""
    }`;
    console.log(
      `Fetching CMS: ${url} \nwith tag: ${collectionTag} | ${JSON.stringify(
        dependencyTags
      )}`
    );
    const res = await fetch(url, {
      next: {
        tags: dependencyTags
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    if (!res.ok) {
      // console.log("!!!!!!!!!!error!!!!!!!!!!\n", res);
      throw new Error(`Failed to fetch API: ${path}`);
    }
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function fetchCMSPage(page: cmsSingleTypePage) {
  const populateList: string[] = [
    "sections",
    "sections.type",
    "sections.leftComponent",
    "sections.rightComponent",
    "sections.leftComponent.form",
    "sections.rightComponent.form",
    "sections.leftComponent.textBlock",
    "sections.rightComponent.textBlock",
    "sections.leftComponent.textBlock.buttons",
    "sections.rightComponent.textBlock.buttons",

    "sections.leftComponent.imageCollection",
    "sections.rightComponent.imageCollection",
    "sections.leftComponent.imageCollection.images",
    "sections.rightComponent.imageCollection.images",

    "sections.leftComponent.singleImage",
    "sections.rightComponent.singleImage",
    "sections.leftComponent.singleImage.image",
    "sections.rightComponent.singleImage.image",

    "sections.leftComponent.floatingImages",
    "sections.rightComponent.floatingImages",
    "sections.leftComponent.floatingImages.images",
    "sections.rightComponent.floatingImages.images",
  ];

  const params: { [key: string]: string } = {};
  for (const i in populateList) {
    params[`populate[${i}]`] = `${populateList[i]}`;
  }

  return await fetchCMS(page, params, "any");
}

const convertFetchableToSingular = (
  path: fetchableCMSCollection
): cmsCollectionSingulars | undefined => {
  if (isCMSCollectionPlural(path)) {
    return cmsCollectionPluralToSingular(path);
  }
  if (isCMSSingleType(path)) {
    return path;
  }
  if (isCMSSingleTypePage(path)) {
    return path;
  }
  return undefined;
};
