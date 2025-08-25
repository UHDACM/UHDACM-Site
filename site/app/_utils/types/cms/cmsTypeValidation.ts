
import { EntrySortModes, ListingModes } from "../../types";
import { isPerson, isStrapiPicture, isValidSiteEvent } from "../../validation";
import {
  FeaturedEvent,
  Leadership,
  cmsCollectionSingular,
  cmsCollectionPlural,
  cmsSingleType,
  SiteSection,
  SiteSectionFeaturedEvent,
  SiteSectionLatestQnA,
  SearchSectionType,
  SiteSectionSearch,
  SplitHeroColumnType,
  SplitHeroColumnTypes,
  SplitHeroColumn,
  SplitHeroColumnImageCollection,
  CMSButton,
  CMSButtonIcon,
  HeroTextBlock,
  HeaderType,
  HeroTextBlockAlignment,
  SiteSectionSplitHero,
  SplitHeroColumnTextBlock,
  SplitHeroColumnForm,
  SplitHeroColumnNone,
  cmsSingleTypes,
  cmsCollectionsPlural,
  cmsCollectionsSingular,
  cmsSingleTypePage,
  cmsSingleTypePages,
  CMSButtonTargets,
} from "./cmsTypes";

export function isValidFeaturedEvent(obj: unknown): obj is FeaturedEvent {
  if (!obj || typeof obj != "object") {
    return false;
  }

  const { previewImageHD, event } = obj as FeaturedEvent;
  if (!event || !isValidSiteEvent(event)) {
    return false;
  }

  if (previewImageHD != undefined && !isStrapiPicture(previewImageHD)) {
    return false;
  }

  return true;
}

export function isValidLeadership(obj: unknown): obj is Leadership {
  if (!obj || typeof obj != "object") {
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

export function isCMSCollectionSingular(
  value: any
): value is cmsCollectionSingular {
  return [
    "event",
    "gallery",
    "organization",
    "person",
    "qna",
  ].includes(value);
}

export function isCMSCollectionPlural(
  value: any
): value is cmsCollectionPlural {
  return [
    "events",
    "galleries",
    "organizations",
    "people",
    "qnas",
  ].includes(value);
}

export function cmsCollectionSingularToPlural(
  singular: cmsCollectionSingular
): cmsCollectionPlural | undefined {
  const singulars = [
    "event",
    "gallery",
    "organization",
    "person",
    "qna",
  ];
  const plurals = [
    "events",
    "galleries",
    "organizations",
    "people",
    "qnas",
  ];
  const index = singulars.indexOf(singular);
  return index !== -1 ? (plurals[index] as cmsCollectionPlural) : undefined;
}

export function cmsCollectionPluralToSingular(
  plural: cmsCollectionPlural
): cmsCollectionSingular | undefined {
  const index = cmsCollectionsPlural.indexOf(plural);
  return index !== -1 ? (cmsCollectionsSingular[index] as cmsCollectionSingular) : undefined;
}

export function isCMSSingleType(value: any): value is cmsSingleType {
  return cmsSingleTypes.includes(value);
};


export function isCMSSingleTypePage(value: any): value is cmsSingleTypePage {
  return cmsSingleTypePages.includes(value);
};

export function isValidSiteSection(obj: unknown): obj is SiteSection {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, sectionID } = obj as SiteSection;

  if (sectionID != undefined && typeof sectionID !== "string") {
    return false;
  }

  switch (__component) {
    case "site-sections.featured-event":
      return isValidSiteSectionFeaturedEvent(obj);
    case "site-sections.latest-qna":
      return isValidSiteSectionLatestQnA(obj);
    case "site-sections.search-section":
      return isValidSiteSectionSearch(obj);
    case "site-sections.split-hero-section":
      return isValidSiteSectionSplitHero(obj);
    default:
      return false;
  }
}

export function isValidSiteSectionFeaturedEvent(obj: unknown): obj is SiteSectionFeaturedEvent {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, header } = obj as SiteSectionFeaturedEvent;
  if (__component !== "site-sections.featured-event") {
    return false;
  }
  
  if (header != undefined && typeof header !== "string") {
    return false;
  }

  return true;
}

export function isValidSiteSectionLatestQnA(obj: unknown): obj is SiteSectionLatestQnA {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, reverseOnDesktop } = obj as SiteSectionLatestQnA;
  if (__component !== "site-sections.latest-qna") {
    return false;
  }
  if (typeof reverseOnDesktop !== "boolean") {
    return false;
  }
  return true;
}

export function isSearchSectionType(value: any): value is SearchSectionType {
  return ["events", "galleries", "qnas"].includes(value);
}

export function isValidSiteSectionSearch(obj: unknown): obj is SiteSectionSearch {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, type, header, listingMode, defaultSortingMode } = obj as SiteSectionSearch;
  if (__component !== "site-sections.search-section") {
    return false;
  }
  if (!isSearchSectionType(type)) {
    return false;
  }
  if (header != undefined && typeof header !== "string") {
    return false;
  }
  if (!listingMode || !ListingModes.includes(listingMode)) {
    return false;
  }
  if (!defaultSortingMode || !EntrySortModes.includes(defaultSortingMode)) {
    return false;
  }
  return true;
}


export function isSplitHeroColumnType(value: any): value is SplitHeroColumnType {
  return SplitHeroColumnTypes.includes(value);
}

// Validation function for SplitHeroColumn using conditional statements and destructuring
export function isValidSplitHeroColumnNone(
  obj: unknown
): obj is SplitHeroColumnNone {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type } = obj as SplitHeroColumnNone;

  return type === "none";
}

export function isValidSplitHeroColumn(obj: any): obj is SplitHeroColumn {
  if (!obj || typeof obj !== "object") return false;

  const { type } = obj as SplitHeroColumn;

  switch (type) {
    case "none":
      return isValidSplitHeroColumnNone(obj);
    case "textBlock":
      return isValidSplitHeroColumnTextBlock(obj);
    case "form":
      return isValidSplitHeroColumnForm(obj);
    case "imageCollection":
      return isValidSplitHeroColumnImageCollection(obj);
    default:
      return false;
  }
}

export function isValidSplitHeroColumnTextBlock(
  obj: unknown
): obj is SplitHeroColumnTextBlock {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, textBlock } = obj as SplitHeroColumnTextBlock;

  if (type !== "textBlock" || !textBlock) {
    return false;
  }

  return isValidHeroTextBlock(textBlock);
}

export function isValidSplitHeroColumnForm(
  obj: unknown
): obj is SplitHeroColumnForm {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, form } = obj as SplitHeroColumnForm;

  if (type !== "form" || !form || typeof form.iFrameFormUrl !== "string") {
    return false;
  }

  return true;
}

export function isValidSplitHeroColumnImageCollection(
  obj: unknown
): obj is SplitHeroColumnImageCollection {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, imageCollection } = obj as SplitHeroColumnImageCollection;

  if (type !== "imageCollection") {
    return false;
  }

  if (
    !imageCollection ||
    typeof imageCollection !== "object" ||
    !Array.isArray(imageCollection.images)
  ) {
    return false;
  }

  for (const img of imageCollection.images) {
    if (!isStrapiPicture(img)) {
      return false;
    }
  }

  return true;
}

export function isValidSiteSectionSplitHero(
  obj: unknown
): obj is SiteSectionSplitHero {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, leftComponent, rightComponent, centerIfPossible, reverseOnDesktop, reverseOnMobile } =
    obj as SiteSectionSplitHero;

  if (__component !== "site-sections.split-hero-section") {
    return false;
  }

  if (
    leftComponent != undefined &&
    !isValidSplitHeroColumn(leftComponent)
  ) {
    return false;
  }

  if (
    rightComponent != undefined &&
    !isValidSplitHeroColumn(rightComponent)
  ) {
    return false;
  }

  if (typeof centerIfPossible !== "boolean") {
    return false;
  }

  if (typeof reverseOnDesktop !== "boolean") {
    return false;
  }

  if (typeof reverseOnMobile !== "boolean") {
    return false;
  }

  return true;
}

export function isValidHeroTextBlock(obj: unknown): obj is HeroTextBlock {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const {
    preheader,
    header,
    headerType,
    subheader,
    buttonsVisible,
    buttons,
    alignment,
  } = obj as HeroTextBlock;

  if (preheader != undefined && typeof preheader !== "string") {
    return false;
  }

  if (typeof header !== "string" || !isValidHeaderType(headerType)) {
    return false;
  }

  if (subheader != undefined && typeof subheader !== "string") {
    return false;
  }

  if (typeof buttonsVisible !== "boolean") {
    return false;
  }

  if (buttons != undefined) {
    if (!Array.isArray(buttons)) {
      return false;
    }
    for (const button of buttons) {
      if (!isValidCMSButton(button)) {
        return false;
      }
    }
  }

  if (!isValidHeroTextBlockAlignment(alignment)) {
    return false;
  }

  return true;
}

export function isValidHeaderType(value: any): value is HeaderType {
  const validHeaderTypes = ["Title", "H1", "H2", "H3", "H4", "H5", "H6"];
  return validHeaderTypes.includes(value);
}

export function isValidHeroTextBlockAlignment(value: any): value is HeroTextBlockAlignment {
  const validAlignments = ["left", "center", "right"];
  return validAlignments.includes(value);
}

export function isValidCMSButtonIcon(value: any): value is CMSButtonIcon {
  const validIcons = [
    "chevron-left",
    "chevron-right",
    "share",
    "calendar",
    "search",
  ];
  return validIcons.includes(value);
}

export function isValidCMSButton(obj: unknown): obj is CMSButton {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { text, icon, isIconOnRightSide, href, target } = obj as CMSButton;

  if (typeof text !== "string" || typeof href !== "string") {
    return false;
  }

  if (icon != undefined && !isValidCMSButtonIcon(icon)) {
    return false;
  }

  if (isIconOnRightSide != undefined && typeof isIconOnRightSide !== "boolean") {
    return false;
  }

  if (!CMSButtonTargets.includes(target)) {
    return false;
  }

  return true;
}



