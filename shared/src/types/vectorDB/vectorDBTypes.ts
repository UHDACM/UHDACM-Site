import { AnnouncementObj, cmsSingleTypePage, QnA, SiteEvent, SiteProject, SocialObj } from "../cms/CMSTypes";
import { DBTicket } from "../ticket/ticketTypes";


export interface VectorDBBaseMetadata {
  collection: DBTicket['collection'],
};

export interface VectorDBPageMetadataAction {
  label: string,
  href: string
};



// done
// "page-about"
// "page-contact"
// "page-events"
// "page-home"
// "page-join"
// "page-media"
// "page-galleries"
// "page-qnas"
// chunked per section on a page
// "page-projects" is included here even though it is not a cmsSingleTypePage:
// it is not built from a sections dynamiczone, but it is still one page with a
// URL and CTAs, so it reuses this metadata shape rather than inventing another.
export interface VectorDBPageMetadata extends VectorDBBaseMetadata {
  collection: cmsSingleTypePage | 'page-projects',
  url: string,
  actions?: VectorDBPageMetadataAction[]
};


// "event" done
// "gallery" skipped, handled by event
export interface VectorDBEventMetadata extends VectorDBBaseMetadata {
  collection: 'event',
  event: PartialSiteEvent
};

// partial site event is lighter weight than SiteEvent, and can be used in LLM
export interface PartialSiteEvent {
  url: SiteEvent['urlSlug'];
  name: SiteEvent['name'];
  previewImageUrl?: string;
  dateStart: SiteEvent['dateStart'];
  dateEnd: SiteEvent['dateEnd'];
  descriptionShort: SiteEvent['descriptionShort'];
  location: SiteEvent['location'];
  hasGallery: boolean;
  organizationNames?: string[];
};


// "project"
export interface VectorDBProjectMetadata extends VectorDBBaseMetadata {
  collection: 'project',
  project: PartialSiteProject
};

// Lighter than SiteProject, and safe to hand to the LLM.
//
// NOTE: the project URL lives in here rather than at the top level on purpose.
// produceDocumentObject tries checkVectorDBPageMetadata first, and that check
// passes for anything with a string `collection` and a string `url` — a
// top-level url here would make every project chunk read as a page.
export interface PartialSiteProject {
  url: string;
  name: SiteProject['name'];
  previewImageUrl?: string;
  dateStart: SiteProject['dateStart'];
  dateEnd?: SiteProject['dateEnd'];
  descriptionShort: SiteProject['descriptionShort'];
  repoUrl?: string;
  demoUrl?: string;
  participantNames?: string[];
};


// "organization" (empty for now)
export interface VectorDBOrganizationMetadata extends VectorDBBaseMetadata {}

// "person" (skipped, person is not publically accessible, but "leadership" is.)
export interface VectorDBPersonMetadata extends VectorDBBaseMetadata {
  socials: SocialObj[]
};

// "qna"
export interface VectorDBQnAMetadata extends VectorDBBaseMetadata {
  QnA: QnA
};


// "featured-event"
export interface VectorDBFeaturedEventMetadata extends VectorDBBaseMetadata {
  event: PartialSiteEvent
};

// "leadership" (chunked per user)
export interface VectorDBLeadershipMetadata extends VectorDBBaseMetadata {
  socialUrls?: string[],
};

// "site-info"
export interface VectorDBSiteInfoMetadata extends VectorDBBaseMetadata {
  socialUrls?: string[],
};

// "announcement"
export interface VectorDBAnnouncementMetadata extends VectorDBBaseMetadata {
  Announcement: AnnouncementObj
};

export interface SafeMetadata {
  [key: string]: string | boolean | number;
}
