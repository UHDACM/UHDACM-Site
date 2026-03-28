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
  SplitHeroColumnSingleImage,
  SplitHeroColumnFloatingImages,
  SiteSectionLeadership,
  SiteInfo,
  EntrySortModes,
  ListingModes,
  Organization,
  StrapiPicture,
  StrapiPictureFormat,
  Person,
  SocialObj,
  SocialSite,
  SocialSites,
  SiteEvent,
  SiteEventSummary,
  QnA,
  QnASummary,
  AnnouncementObj,
  AnnouncementSubheaderItem,
  AnnouncementColorThemes,
  CMSAnnouncementIcons,
  SiteSectionAnnouncement,
  FeatureCardProps,
  FeatureCardIcons,
  FeatureCardColors,
  SiteSectionFeatureCard,
  CardSectionItem,
  SiteSectionCardSection,
  VerticalTimelineEntry,
  SiteSectionVerticalTimeline,
} from "./CMSTypes";

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
  value: any,
): value is cmsCollectionSingular {
  return ["event", "gallery", "organization", "person", "qna"].includes(value);
}

export function isCMSCollectionPlural(
  value: any,
): value is cmsCollectionPlural {
  return ["events", "galleries", "organizations", "people", "qnas"].includes(
    value,
  );
}

export function cmsCollectionSingularToPlural(
  singular: cmsCollectionSingular,
): cmsCollectionPlural | undefined {
  const singulars = ["event", "gallery", "organization", "person", "qna"];
  const plurals = ["events", "galleries", "organizations", "people", "qnas"];
  const index = singulars.indexOf(singular);
  return index !== -1 ? (plurals[index] as cmsCollectionPlural) : undefined;
}

export function cmsCollectionPluralToSingular(
  plural: cmsCollectionPlural,
): cmsCollectionSingular | undefined {
  const index = cmsCollectionsPlural.indexOf(plural);
  return index !== -1
    ? (cmsCollectionsSingular[index] as cmsCollectionSingular)
    : undefined;
}

export function isCMSSingleType(value: any): value is cmsSingleType {
  return cmsSingleTypes.includes(value);
}

export function isCMSSingleTypePage(value: any): value is cmsSingleTypePage {
  return cmsSingleTypePages.includes(value);
}

export function isValidSiteSection(obj: unknown): obj is SiteSection {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, sectionID } = obj as SiteSection;

  if (sectionID != undefined && typeof sectionID !== "string") {
    return false;
  }

  switch (__component) {
    case "site-sections.leadership-section":
      return isValidSiteSectionLeadership(obj);
    case "site-sections.featured-event":
      return isValidSiteSectionFeaturedEvent(obj);
    case "site-sections.latest-qna":
      return isValidSiteSectionLatestQnA(obj);
    case "site-sections.search-section":
      return isValidSiteSectionSearch(obj);
    case "site-sections.split-hero-section":
      return isValidSiteSectionSplitHero(obj);
    case "site-sections.announcement":
      return isValidSiteSectionAnnouncement(obj);
    case "site-sections.feature-card-section":
      return isValidSiteSectionFeatureCard(obj);
    case "site-sections.card-section":
      return isValidSiteSectionCardSection(obj);
    case "site-sections.vertical-timeline":
      return isValidSiteSectionVerticalTimeline(obj);
    default:
      return false;
  }
}

export function isValidSiteSectionLeadership(
  obj: unknown,
): obj is SiteSectionLeadership {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component } = obj as SiteSectionLeadership;
  if (__component !== "site-sections.leadership-section") {
    return false;
  }

  return true;
}

export function isValidSiteSectionAnnouncement(
  obj: unknown,
): obj is SiteSectionAnnouncement {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component } = obj as SiteSectionAnnouncement;
  if (__component !== "site-sections.announcement") {
    return false;
  }

  return true;
}

export function isValidSiteSectionFeaturedEvent(
  obj: unknown,
): obj is SiteSectionFeaturedEvent {
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

export function isValidSiteSectionLatestQnA(
  obj: unknown,
): obj is SiteSectionLatestQnA {
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

export function isValidSiteSectionSearch(
  obj: unknown,
): obj is SiteSectionSearch {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { __component, type, header, listingMode, defaultSortingMode } =
    obj as SiteSectionSearch;
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

export function isSplitHeroColumnType(
  value: any,
): value is SplitHeroColumnType {
  return SplitHeroColumnTypes.includes(value);
}

// Validation function for SplitHeroColumn using conditional statements and destructuring
export function isValidSplitHeroColumnNone(
  obj: unknown,
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
    case "singleImage":
      return isValidSplitHeroColumnSingleImage(obj);
    case "floatingImages":
      return isValidSplitHeroColumnFloatingImages(obj);
    default:
      return false;
  }
}

export function isValidSplitHeroColumnTextBlock(
  obj: unknown,
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
  obj: unknown,
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
  obj: unknown,
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

export function isValidSplitHeroColumnSingleImage(
  obj: unknown,
): obj is SplitHeroColumnSingleImage {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, singleImage } = obj as SplitHeroColumnSingleImage;

  if (type !== "singleImage") {
    return false;
  }

  if (!singleImage || typeof singleImage !== "object") {
    return false;
  }

  if (!isStrapiPicture(singleImage.image)) {
    console.log(
      "Invalid singleImage found:",
      JSON.stringify(singleImage, null, 2),
    );
    return false;
  }

  return true;
}

export function isValidSplitHeroColumnFloatingImages(
  obj: unknown,
): obj is SplitHeroColumnFloatingImages {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { type, floatingImages } = obj as SplitHeroColumnFloatingImages;

  if (type !== "floatingImages") {
    return false;
  }

  if (!floatingImages || typeof floatingImages !== "object") {
    return false;
  }

  if (!Array.isArray(floatingImages.images)) {
    return false;
  }

  for (const img of floatingImages.images) {
    if (!isStrapiPicture(img)) {
      return false;
    }
  }

  return true;
}

export function isValidSiteSectionSplitHero(
  obj: unknown,
): obj is SiteSectionSplitHero {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const {
    __component,
    leftComponent,
    rightComponent,
    centerIfPossible,
    reverseOnDesktop,
    reverseOnMobile,
  } = obj as SiteSectionSplitHero;

  if (__component !== "site-sections.split-hero-section") {
    return false;
  }

  if (leftComponent != undefined && !isValidSplitHeroColumn(leftComponent)) {
    return false;
  }

  if (rightComponent != undefined && !isValidSplitHeroColumn(rightComponent)) {
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

export function isValidHeroTextBlockAlignment(
  value: any,
): value is HeroTextBlockAlignment {
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

  if (
    isIconOnRightSide != undefined &&
    typeof isIconOnRightSide !== "boolean"
  ) {
    return false;
  }

  if (!CMSButtonTargets.includes(target)) {
    return false;
  }

  return true;
}

export function isValidSiteInfo(obj: unknown): obj is SiteInfo {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const { logo, socials } = obj as SiteInfo;

  if (!isStrapiPicture(logo)) {
    return false;
  }

  if (socials !== undefined) {
    if (!Array.isArray(socials)) {
      return false;
    }

    for (const social of socials) {
      if (!isValidSocialObj(social)) {
        return false;
      }
    }
  }

  return true;
}

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
  if (previewImage && !isStrapiPicture(previewImage))
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
  if (gallery && typeof gallery != "object") return false;
  if (!isValidISODate(dateStart)) return false;
  if (!isValidISODate(dateEnd)) return false;
  return true;
}

// Lighter validator for list/search views. Skips descriptionFull and
// organizations (omitted from the payload via Strapi `fields`/`populate`).
export function isValidSiteEventSummary(
  event: any,
): event is SiteEventSummary {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const isValidISODate = (dateStr: string) =>
    isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));

  if (typeof event !== "object" || event === null) return false;
  const {
    id,
    urlSlug,
    name,
    previewImage,
    dateStart,
    dateEnd,
    descriptionShort,
    location,
    gallery,
  } = event as SiteEventSummary;

  if (typeof id !== "number") return false;
  if (typeof urlSlug !== "string") return false;
  if (typeof name !== "string") return false;
  if (previewImage && !isStrapiPicture(previewImage)) return false;
  if (typeof dateStart !== "string") return false;
  if (typeof dateEnd !== "string") return false;
  if (typeof descriptionShort !== "string") return false;
  if (typeof location !== "string") return false;
  if (gallery && typeof gallery !== "object") return false;
  if (!isValidISODate(dateStart)) return false;
  if (!isValidISODate(dateEnd)) return false;
  return true;
}

export function isSocialSite(value: any): value is SocialSite {
  return SocialSites.includes(value);
}

export function isValidSocialObj(obj: any): obj is SocialObj {
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
  if (!socials.every(isValidSocialObj)) return false;
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
  // if (typeof obj.width !== "number") return false;
  // if (typeof obj.height !== "number") return false;
  // if (typeof obj.name !== "string") return false;
  if (obj.formats) {
    if (typeof obj.formats !== "object") {
      return false;
    }
    if (obj.formats.thumbnail && !isStrapiPictureFormat(obj.formats.thumbnail))
      return false;
    if (obj.formats.small && !isStrapiPictureFormat(obj.formats.small))
      return false;
    if (obj.formats.medium && !isStrapiPictureFormat(obj.formats.medium))
      return false;
    if (obj.formats.large && !isStrapiPictureFormat(obj.formats.large))
      return false;
  }
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

// QnA has no list-vs-detail field split today; the summary validator is the
// same shape. Exposed as a separate name for symmetry with the event side.
export function isValidQnASummary(obj: any): obj is QnASummary {
  return isValidQnA(obj);
}

function isValidAnnouncementSubheaderItem(obj: unknown): obj is AnnouncementSubheaderItem {
  if (!obj || typeof obj !== "object") return false;
  const { text, icon } = obj as AnnouncementSubheaderItem;
  if (typeof text !== "string") return false;
  if (icon !== undefined && !CMSAnnouncementIcons.includes(icon as any)) return false;
  return true;
}

export function isValidSiteSectionFeatureCard(
  obj: unknown,
): obj is SiteSectionFeatureCard {
  if (!obj || typeof obj !== "object") return false;
  const { __component, cards, position } = obj as SiteSectionFeatureCard;
  if (__component !== "site-sections.feature-card-section") return false;
  if (!Array.isArray(cards)) return false;
  if (!cards.every(isValidFeatureCard)) return false;
  if (!["top", "center", "bottom"].includes(position)) return false;
  return true;
}

export function isValidFeatureCard(obj: unknown): obj is FeatureCardProps {
  if (!obj || typeof obj !== "object") return false;
  const { icon, color, title, description } = obj as FeatureCardProps;
  if (!FeatureCardIcons.includes(icon as any)) return false;
  if (!FeatureCardColors.includes(color as any)) return false;
  if (typeof title !== "string") return false;
  if (typeof description !== "string") return false;
  return true;
}

export function isValidCardSectionItem(obj: unknown): obj is CardSectionItem {
  if (!obj || typeof obj !== "object") return false;
  const { icon, title, subtitle, href } = obj as CardSectionItem;
  if (!FeatureCardIcons.includes(icon as any)) return false;
  if (typeof title !== "string") return false;
  if (typeof subtitle !== "string") return false;
  if (href && typeof href !== "string") return false;
  return true;
}

export function isValidSiteSectionCardSection(
  obj: unknown,
): obj is SiteSectionCardSection {
  if (!obj || typeof obj !== "object") return false;
  const { __component, title, subtitle, cards } = obj as SiteSectionCardSection;
  if (__component !== "site-sections.card-section") return false;
  if (typeof title !== "string") return false;
  if (subtitle !== undefined && typeof subtitle !== "string") return false;
  if (!Array.isArray(cards)) return false;
  if (!cards.every(isValidCardSectionItem)) {console.log('invalid card found'); return false;}
  return true;
}

export function isValidVerticalTimelineEntry(obj: unknown): obj is VerticalTimelineEntry {
  if (!obj || typeof obj !== "object") return false;
  const { date, title, subtitle, description, href } = obj as VerticalTimelineEntry;
  if (typeof date !== "string") return false;
  if (typeof title !== "string") return false;
  if (typeof subtitle !== "string") return false;
  if (description && typeof description !== "string") return false;
  if (href && typeof href !== "string") return false;
  return true;
}

export function isValidSiteSectionVerticalTimeline(
  obj: unknown,
): obj is SiteSectionVerticalTimeline {
  if (!obj || typeof obj !== "object") return false;
  const { __component, title, subtitle, entries } = obj as SiteSectionVerticalTimeline;
  if (__component !== "site-sections.vertical-timeline") return false;
  if (typeof title !== "string") return false;
  if (subtitle && typeof subtitle !== "string") return false;
  if (!Array.isArray(entries)) return false;
  if (!entries.every(isValidVerticalTimelineEntry)) {return false};
  return true;
}

export function isValidAnnouncement(obj: unknown): obj is AnnouncementObj {
  if (!obj || typeof obj !== "object") return false;
  const { image, title, subheader, badge, body, buttons, colorTheme } = obj as AnnouncementObj;
  if (!isStrapiPicture(image)) return false;
  if (typeof title !== "string") return false;
  if (subheader !== undefined) {
    if (!Array.isArray(subheader)) return false;
    if (!subheader.every(isValidAnnouncementSubheaderItem)) return false;
  }
  if (badge !== undefined && typeof badge !== "string") return false;
  if (body !== undefined && typeof body !== "string") return false;
  if (!Array.isArray(buttons)) return false;
  if (!buttons.every(isValidCMSButton)) return false;
  if (colorTheme !== undefined && !AnnouncementColorThemes.includes(colorTheme as any)) return false;
  return true;
}
