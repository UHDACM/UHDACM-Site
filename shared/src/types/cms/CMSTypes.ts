// TODO: This is a freaking mess, we'll have to clean this up soon.

export type fetchableCMSCollection =
  | cmsCollectionPlural
  | cmsSingleType
  | cmsSingleTypePage;
export type cmsCollectionSingulars =
  | cmsCollectionSingular
  | cmsSingleType
  | cmsSingleTypePage | 'any';


// BE SURE TO KEEP SINGULAR IN SYNC WITH PLURAL (e.g.: singular[0] = event, and plural[0] = events)
export const cmsCollectionsSingular = [
  "event",
  "gallery",
  "organization",
  "person",
  "qna",
  "project"
] as const;
export const cmsCollectionsPlural = [
  "events",
  "galleries",
  "organizations",
  "people",
  "qnas",
  "projects"
] as const;

export type cmsCollectionSingular = (typeof cmsCollectionsSingular)[number];
export type cmsCollectionPlural = (typeof cmsCollectionsPlural)[number];


// NOTE: "projects-page" lives here rather than in cmsSingleTypePages on purpose.
// Everything in cmsSingleTypePages is assumed to carry a `sections` dynamiczone
// (see fetchCMSPage/PageRenderer, and the vector writer's page branch). The
// projects page uses flat fields instead, so it must stay out of that list.
export const cmsSingleTypes = ["featured-event", "leadership", "site-info", "announcement", "projects-page"] as const;
export type cmsSingleType = (typeof cmsSingleTypes)[number];

export const cmsSingleTypePages = [
  "page-about",
  "page-contact",
  "page-events",
  "page-home",
  "page-join",
  "page-media",
  "page-galleries",
  "page-qnas"
] as const;
export type cmsSingleTypePage = (typeof cmsSingleTypePages)[number];


// =========================== featuredEvent ===========================
export interface FeaturedEvent {
  previewImageHD?: string;
  event: SiteEvent;
}
// =========================== featuredEvent (end) ===========================

export interface Leadership {
  people: Person[];
}

const sectionCMSNames = [
  "site-sections.leadership-section",
  "site-sections.split-hero-section",
  "site-sections.search-section",
  "site-sections.featured-event",
  "site-sections.latest-qna",
  "site-sections.announcement",
  "site-sections.feature-card-section",
  "site-sections.card-section",
  "site-sections.vertical-timeline",
] as const;

export type cmsSectionName = (typeof sectionCMSNames)[number];

// this is the bare minimum a site section will have
export interface SiteSection {
  __component: cmsSectionName;
  id: number;
  sectionID?: string;
}

export interface SiteSectionLeadership extends SiteSection {
  __component: "site-sections.leadership-section";
}

export interface SiteSectionFeaturedEvent extends SiteSection {
  __component: "site-sections.featured-event";
  header?: string;
}

export interface SiteSectionLatestQnA extends SiteSection {
  __component: "site-sections.latest-qna";
  reverseOnDesktop: boolean
}

export interface SiteSectionAnnouncement extends SiteSection {
  __component: "site-sections.announcement";
};

export const FeatureCardPositions = ['top', 'center', 'bottom'] as const;
export type FeatureCardPosition = typeof FeatureCardPositions[number];
export interface SiteSectionFeatureCard extends SiteSection {
  __component: "site-sections.feature-card-section";
  cards: FeatureCardProps[];
  position: FeatureCardPosition;
};

const SearchSectionTypes = ["events", "galleries", "qnas"] as const;

export type SearchSectionType = (typeof SearchSectionTypes)[number];

export interface SiteSectionSearch extends SiteSection {
  __component: "site-sections.search-section";
  type: SearchSectionType;
  header?: string;
  listingMode: ListingMode;
  defaultSortingMode: EntrySortMode;
}

export const SplitHeroColumnTypes = [
  "textBlock",
  "form",
  "imageCollection",
  "singleImage",
  "floatingImages",
  "none",
] as const;
export type SplitHeroColumnType = (typeof SplitHeroColumnTypes)[number];

export interface SplitHeroColumn {
  type: SplitHeroColumnType;
}

export interface SplitHeroColumnImageCollection extends SplitHeroColumn {
  type: "imageCollection";
  imageCollection: {
    images: StrapiPicture[];
  };
}

export interface SplitHeroColumnSingleImage extends SplitHeroColumn {
  type: "singleImage";
  singleImage: {
    image: StrapiPicture;
  };
}

export interface SplitHeroColumnFloatingImages extends SplitHeroColumn {
  type: "floatingImages";
  floatingImages: {
    images: StrapiPicture[];
  };
}

export const CMSButtonIcons = [
  "chevron-left",
  "chevron-right",
  "share",
  "calendar",
  "search",
] as const;
export type CMSButtonIcon = (typeof CMSButtonIcons)[number];

export const CMSButtonTargets = ['_blank', '_self', '_parent', '_top'] as const;
export type CMSButtonTarget = (typeof CMSButtonTargets[number]);
export interface CMSButton {
  text: string;
  icon?: CMSButtonIcon;
  isIconOnRightSide?: boolean;
  href: string;
  target: CMSButtonTarget;
}

export const HeaderTypes = [
  "Title",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
] as const;
export type HeaderType = (typeof HeaderTypes)[number];

export const HeroTextBlockAlignments = ["left", "center", "right"] as const;
export type HeroTextBlockAlignment = (typeof HeroTextBlockAlignments)[number];
export interface HeroTextBlock {
  preheader?: string;
  header: string;
  headerType: HeaderType;
  subheader?: string;
  buttonsVisible: boolean;
  buttons?: CMSButton[];
  alignment: HeroTextBlockAlignment;
}

export interface SplitHeroColumnTextBlock extends SplitHeroColumn {
  type: "textBlock";
  textBlock: HeroTextBlock;
}


export interface SplitHeroColumnForm extends SplitHeroColumn {
  type: "form";
  form: {
    iFrameFormUrl: string;
  };
}

export interface SplitHeroColumnNone extends SplitHeroColumn {
  type: "none";
}

export interface SiteSectionSplitHero extends SiteSection {
  __component: "site-sections.split-hero-section";
  leftComponent?: SplitHeroColumn;
  rightComponent?: SplitHeroColumn;
  centerIfPossible: boolean;
  reverseOnDesktop: boolean;
  reverseOnMobile: boolean;
}

export interface SitePage {
  sections: SiteSection[];
}

export interface SiteInfo {
  logo: StrapiPicture;
  socials?: SocialObj[];
}



import { BlocksContent } from '@strapi/blocks-react-renderer'
import { ObjectUnknown } from "../general/generalTypes";


export type SiteEvent = {
  id: number;
  urlSlug: string;
  name: string;
  previewImage: StrapiPicture | undefined;
  dateStart: string;
  dateEnd: string;
  descriptionShort: string;
  descriptionFull: BlocksContent;
  location: string;
  gallery?: ObjectUnknown; // TODO: define more specifically
  organizations?: Organization[];
};

// Subset of SiteEvent used by list/search views — excludes heavy fields
// (descriptionFull blocks, organizations) so we can fetch a slimmer payload.
export type SiteEventSummary = Pick<
  SiteEvent,
  | "id"
  | "urlSlug"
  | "name"
  | "previewImage"
  | "dateStart"
  | "dateEnd"
  | "descriptionShort"
  | "location"
> & { gallery?: ObjectUnknown };

export type SiteProject = {
  id: number;
  urlSlug: string;
  name: string;
  previewImage: StrapiPicture | undefined;
  dateStart: string;
  // absent means the project is still ongoing
  dateEnd?: string;
  descriptionShort: string;
  descriptionFull: BlocksContent;
  repoUrl?: string;
  demoUrl?: string;
  people?: Person[];
};

// Subset of SiteProject used by the listing grid — excludes descriptionFull and
// the full people records, so the grid fetches a slimmer payload.
export type SiteProjectSummary = Pick<
  SiteProject,
  | "id"
  | "urlSlug"
  | "name"
  | "previewImage"
  | "dateStart"
  | "dateEnd"
  | "descriptionShort"
> & { peopleCount?: number };

// The "projects-page" single type. Deliberately flat fields rather than a
// dynamiczone — the org needs to edit this copy without assembling sections.
export type ProjectsPage = {
  introImage?: StrapiPicture;
  introTitle: string;
  introSubtitle?: string;
  joinTitle: string;
  joinSubtitle?: string;
  joinFormUrl: string;
};

export type SocialSite =
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "personal_site"
  | "github"
  | "youtube"
  | "discord";

export const SocialSites: SocialSite[] = [
  "linkedin",
  "x",
  "facebook",
  "instagram",
  "personal_site",
  "github",
  "youtube",
  "discord"
];

export type SocialObj = {
  type: SocialSite;
  url: string;
}

export type Person = {
  name: string;
  nameShort: string;
  picture: StrapiPicture | undefined;
  role: string;
  roleShort: string;
  description: string;
  socials: SocialObj[];
}

export type StrapiPictureFormat = {
  ext: string;
  url: string;
  width: number;
  height: number;
};

export type StrapiPicture = {
  id: number;
  url: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  name: string;
  formats: {
    thumbnail?: StrapiPictureFormat;
    small?: StrapiPictureFormat;
    medium?: StrapiPictureFormat;
    large?: StrapiPictureFormat;
  };
};

export type Organization = {
  name: string,
  description: string,
  logo: StrapiPicture | undefined,
};


export const ListingModes = ["on", "after", "before"] as const;
export type ListingMode = typeof ListingModes[number];

export const EntrySortModes = ["ascending", "descending"] as const;
export type EntrySortMode = typeof EntrySortModes[number];

export type QnA = {
  videoName: string,
  featuredGuests?: string,
  thumbnail?: StrapiPicture,
  videoLink: string,
  uploadDate: string,
  descriptionShort: string
};

// QnA is already lean enough for list/search views; alias for symmetry with
// SiteEventSummary so callers can opt into the "summary" naming convention.
export type QnASummary = QnA;


export const CMSAnnouncementIcons = ['calendar', 'clock', 'location-pin'] as const;
export type CMSAnnouncementIcon = typeof CMSAnnouncementIcons[number];

export type AnnouncementSubheaderItem = {
  text: string;
  icon?: CMSAnnouncementIcon;
};

export const AnnouncementColorThemes = ['primary', 'secondary', 'accent', 'background'] as const;
export type AnnouncementColorTheme = typeof AnnouncementColorThemes[number];

export type AnnouncementObj = {
  image: StrapiPicture;
  title: string;
  subheader?: AnnouncementSubheaderItem[];
  badge?: string;
  body?: string;
  buttons: CMSButton[];
  colorTheme?: AnnouncementColorTheme;
};


export const FeatureCardIcons = ['heart', 'target', 'code', 'users', 'calendar', 'people', 'clock'] as const;
export type FeatureCardIcon = typeof FeatureCardIcons[number];

export const FeatureCardColors = ['primary', 'secondary', 'accent', 'background'] as const;
export type FeatureCardColor = typeof FeatureCardColors[number];

export type FeatureCardProps = {
  icon: FeatureCardIcon;
  color: FeatureCardColor;
  title: string;
  description: string;
};


export type CardSectionItem = {
  icon: FeatureCardIcon;
  title: string;
  subtitle: string;
  href?: string;
};

export interface SiteSectionCardSection extends SiteSection {
  __component: "site-sections.card-section";
  title: string;
  subtitle?: string;
  cards: CardSectionItem[];
}


export type VerticalTimelineEntry = {
  date: string;
  title: string;
  subtitle: string;
  description?: string;
  href?: string;
};

export interface SiteSectionVerticalTimeline extends SiteSection {
  __component: "site-sections.vertical-timeline";
  title: string;
  subtitle?: string;
  entries: VerticalTimelineEntry[];
}

