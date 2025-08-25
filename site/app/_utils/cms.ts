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

// TODO: swap with entity service
export async function fetchCMS(
  path: cmsCollectionPlural | cmsSingleType | cmsSingleTypePage,
  params?: Record<string, any>,
  additionalTags?:
    | (cmsCollectionPlural | cmsSingleType | cmsSingleTypePage)[]
    | "any"
) {
  let collectionTag:
    | cmsCollectionSingular
    | cmsSingleType
    | cmsSingleTypePage
    | undefined = undefined;
  if (isCMSCollectionPlural(path)) {
    const res = cmsCollectionPluralToSingular(path);
    if (res) {
      collectionTag = res;
    }
  } else if (isCMSSingleType(path)) {
    // its a single type, use path as is
    collectionTag = path;
  } else if (isCMSSingleTypePage(path)) {
    collectionTag = path;
  }

  if (!collectionTag) {
    console.log("failed to find collection tag", path);
    // this should never happen
    return undefined;
  }

  try {
    const urlParams = params ? objectToUrlParams(params) : undefined;
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/${path}${
      urlParams ? `?${urlParams}` : ""
    }`;
    // console.log(`Fetching CMS: ${url}`);
    const res = await fetch(url, {
      next: {
        tags: [collectionTag, ...(additionalTags || [])],
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    if (!res.ok) {
      console.log("!!!!!!!!!!error!!!!!!!!!!\n", res);
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
