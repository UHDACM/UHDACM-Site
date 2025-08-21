import { Organization, Person, SiteEvent, SocialObj, SocialSite, SocialSites, StrapiPicture, StrapiPictureFormat } from "./types";

export function isValidEvent(event: any): event is SiteEvent {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  const isValidISODate = (dateStr: string) =>
    isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));

  if (typeof event !== 'object') return false;
  if (typeof event.id != 'number') return false;
  if (typeof event.UrlSlug !== 'string') return false;
  if (typeof event.Name !== 'string') return false;
  if (typeof event.PreviewImage !== 'undefined' && !isStrapiPicture(event.PreviewImage)) return false;
  if (typeof event.DateStart !== 'string') return false;
  if (typeof event.DateEnd !== 'string') return false;
  if (typeof event.DescriptionShort !== 'string') return false;
  if (!Array.isArray(event.DescriptionFull)) return false;
  if (typeof event.Location !== 'string') return false;
  if (
    typeof event.Organizations !== 'undefined' &&
    (!Array.isArray(event.Organizations) || !event.Organizations.every(isOrganization))
  ) return false;
  if (event.Gallery != undefined && typeof(event.Gallery) != 'object') return false;
  if (!isValidISODate(event.DateStart)) return false;
  if (!isValidISODate(event.DateEnd)) return false;
  return true;
}


export function isSocialSite(value: any): value is SocialSite {
  return SocialSites.includes(value);
}

export function isSocialObj(obj: any): obj is SocialObj {
  if (!obj || typeof obj !== "object") return false;
  if (!isSocialSite(obj.type)) return false;
  if (typeof obj.url !== "string") return false;
  return true;
}

export function isPerson(obj: any): obj is Person {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.Name !== "string") return false;
  if (typeof obj.NameShort !== "string") return false;
  if (!isStrapiPicture(obj.Picture)) return false;
  if (typeof obj.Role !== "string") return false;
  if (typeof obj.RoleShort !== "string") return false;
  if (typeof obj.Description !== "string") return false;
  if (!Array.isArray(obj.Socials)) return false;
  if (!obj.Socials.every(isSocialObj)) return false;
  return true;
}

export function isStrapiPictureFormat(obj: any): obj is StrapiPictureFormat {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.ext !== "string") return false;
  if (typeof obj.url !== "string") return false;
  if (typeof obj.width !== "number") return false;
  if (typeof obj.height !== "number") return false;
  return true;
}

export function isStrapiPicture(obj: any): obj is StrapiPicture {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.id !== "number") return false;
  if (typeof obj.url !== "string") return false;
  // if (typeof obj.alternativeText !== "string") return false;
  // if (typeof obj.caption !== "string") return false;
  if (typeof obj.width !== "number") return false;
  if (typeof obj.height !== "number") return false;
  if (typeof obj.name !== "string") return false;
  if (!obj.formats || typeof obj.formats !== "object") return false;
  if (obj.formats.thumbnail && !isStrapiPictureFormat(obj.formats.thumbnail)) return false;
  if (obj.formats.small && !isStrapiPictureFormat(obj.formats.small)) return false;
  if (obj.formats.medium && !isStrapiPictureFormat(obj.formats.medium)) return false;
  if (obj.formats.large && !isStrapiPictureFormat(obj.formats.large)) return false;
  return true;
}


// Validation function for Organization
export function isOrganization(obj: any): obj is Organization {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.Name === "string" &&
    typeof obj.Description === "string" &&
    (obj.Logo === undefined || isStrapiPicture(obj.Logo))
  );
}
