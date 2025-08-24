// TODO: Migrate all cms types to this file

import { Person, SiteEvent } from "../../types";
import { isPerson, isStrapiPicture, isValidSiteEvent } from "../../validation";

// =========================== featuredEvent ===========================
export interface FeaturedEvent {
  previewImageHD?: string,
  event: SiteEvent,
};

export function isValidFeaturedEvent(obj: unknown): obj is FeaturedEvent {
  if (!obj || typeof(obj) != 'object') {
    return false;
  }

  const { previewImageHD, event } = obj as FeaturedEvent;
  if (!event || !isValidSiteEvent(event)) {
    return false;
  }

  if (previewImageHD != undefined && isStrapiPicture(previewImageHD)) {
    return false;
  }

  return true;
}
// =========================== featuredEvent (end) ===========================

export interface Leadership {
  people: Person[]
};

export function isValidLeadership(obj: unknown): obj is Leadership {
  if (!obj || typeof(obj) != 'object') {
    return false;
  }

  const { people } = obj as Leadership;
  if (!(people instanceof Array)) {
    return false;
  }

  for (let person of people) {
    if (!isPerson(person)) {
      return false;
    }
  }

  return true;
}
