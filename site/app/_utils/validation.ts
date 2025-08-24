import {
  Organization,
  Person,
  QnA,
  SiteEvent,
  SocialObj,
  SocialSite,
  SocialSites,
  StrapiPicture,
  StrapiPictureFormat,
} from "./types";

export function isValidSiteEvent(event: any): event is SiteEvent {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  const isValidISODate = (dateStr: string) =>
    isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));

  const {
    id,
    urlSlug,
    name,
    previewImage,
    dateStart,
    dateEnd,
    descriptionShort,
    descriptionFull,
    location,
    organizations,
    gallery,
  } = event as SiteEvent;

  if (typeof event !== "object") return false;
  if (typeof id != "number") return false;
  if (typeof urlSlug !== "string") return false;
  if (typeof name !== "string") return false;
  if (typeof previewImage !== "undefined" && !isStrapiPicture(previewImage))
    return false;
  if (typeof dateStart !== "string") return false;
  if (typeof dateEnd !== "string") return false;
  if (typeof descriptionShort !== "string") return false;
  if (!Array.isArray(descriptionFull)) return false;
  if (typeof location !== "string") return false;
  if (
    typeof organizations !== "undefined" &&
    (!Array.isArray(organizations) || !organizations.every(isOrganization))
  )
    return false;
  if (gallery != undefined && typeof gallery != "object") return false;
  if (!isValidISODate(dateStart)) return false;
  if (!isValidISODate(dateEnd)) return false;
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
  const { name, nameShort, picture, role, roleShort, description, socials } =
    obj as Person;
  if (!obj || typeof obj !== "object") return false;
  if (typeof name !== "string") return false;
  if (typeof nameShort !== "string") return false;
  if (!isStrapiPicture(picture)) return false;
  if (typeof role !== "string") return false;
  if (typeof roleShort !== "string") return false;
  if (typeof description !== "string") return false;
  if (!Array.isArray(socials)) return false;
  if (!socials.every(isSocialObj)) return false;
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
  if (obj.formats.thumbnail && !isStrapiPictureFormat(obj.formats.thumbnail))
    return false;
  if (obj.formats.small && !isStrapiPictureFormat(obj.formats.small))
    return false;
  if (obj.formats.medium && !isStrapiPictureFormat(obj.formats.medium))
    return false;
  if (obj.formats.large && !isStrapiPictureFormat(obj.formats.large))
    return false;
  return true;
}

// Validation function for Organization
export function isOrganization(obj: any): obj is Organization {
  if (!obj || typeof obj != "object") {
    return false;
  }

  const { name, description, logo } = obj as Organization;

  if (typeof name != "string") {
    return false;
  } else if (typeof description != "string") {
    return false;
  }
  if (logo != undefined && !isStrapiPicture(logo)) {
    return false;
  }
  return true;
}

export function isValidQnA(obj: any): obj is QnA {
  const {
    videoName,
    featuredGuests,
    thumbnail,
    videoLink,
    uploadDate,
    descriptionShort,
  } = obj as QnA;
  if (typeof obj !== "object" || obj === null) return false;
  if (typeof videoName !== "string") return false;
  if (featuredGuests != undefined && typeof featuredGuests !== "string")
    return false;
  if (thumbnail !== undefined && typeof thumbnail !== "object") return false;
  if (typeof videoLink !== "string") return false;
  if (typeof uploadDate !== "string") return false;
  if (typeof descriptionShort !== "string") return false;
  const date = new Date(uploadDate);
  if (isNaN(date.getTime())) return false;
  return true;
}
