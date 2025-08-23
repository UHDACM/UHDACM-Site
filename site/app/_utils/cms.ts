import { objectToUrlParams } from "./tools";

export async function fetchCMS(path: cmsCollectionPlural | cmsSingleType, params?: Record<string, any>) {
  let collectionTag: string = '';
  if (isCMSCollectionPlural(path)) {
    const res = cmsCollectionPluralToSingular(path);
    if (!res) {
      // if is single type, it should ALWAYS have a plural type.
      return undefined;
    }
  } else if (isCMSSingleType(path)) {
    // its a single type, use path as is
    collectionTag = path;
  } else {
    // this should never happen
    return undefined;
  }

  try {
    const urlParams = params ? objectToUrlParams(params) : undefined;
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/${path}${urlParams ? `?${urlParams}` : ''}`;
    console.log(`Fetching CMS: ${url}`);
    const res = await fetch(url, {
      next: {
        tags: [collectionTag]
      },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      }
    });
    if (!res.ok) {
      console.error(res);
      throw new Error(`Failed to fetch API: ${path}`);
    }
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export type cmsCollectionSingular = 'event' | 'gallery' | 'organization' | 'person' | 'qna';
export type cmsCollectionPlural = 'events' | 'galleries' | 'organizations' | 'people' | 'qnas';

// BE SURE TO KEEP SINGULAR IN SYNC WITH PLURAL (e.g.: singular[0] = event, and plural[0] = events)
export const cmsCollectionsSingular: cmsCollectionSingular[] = ['event', 'gallery', 'organization', 'person', 'qna'];
export const cmsCollectionsPlural: cmsCollectionPlural[] = ['events', 'galleries', 'organizations', 'people', 'qnas'];

export function isCMSCollectionSingular(value: any): value is cmsCollectionSingular {
  return cmsCollectionsSingular.includes(value);
}

export function isCMSCollectionPlural(value: any): value is cmsCollectionPlural {
  return cmsCollectionsPlural.includes(value);
}

export function cmsCollectionSingularToPlural(singular: cmsCollectionSingular): cmsCollectionPlural | undefined {
  const index = cmsCollectionsSingular.indexOf(singular);
  return index !== -1 ? cmsCollectionsPlural[index] : undefined;
}

export function cmsCollectionPluralToSingular(plural: cmsCollectionPlural): cmsCollectionSingular | undefined {
  const index = cmsCollectionsPlural.indexOf(plural);
  return index !== -1 ? cmsCollectionsSingular[index] : undefined;
}

export type cmsSingleType = 'featured-event' | 'leadership';
export const cmsSingleTypes: cmsSingleType[] = ['featured-event', 'leadership'];
export function isCMSSingleType(value: any): value is cmsSingleType {
  return cmsSingleTypes.includes(value);
}
