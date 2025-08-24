import { ReactNode } from "react";
import { BlocksContent } from '@strapi/blocks-react-renderer'

export type FunctionUnknown = (...args: unknown[]) => unknown;
export type CardinalDirection = 'down' | 'left' | 'up' | 'right';

export type ObjectAny = { [key: string]: any };

export type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

export const Months: Month[] = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

export type NavigationEntryObj = {
  title: ReactNode;
  path: string;
  children?: NavigationEntryObj[];
};

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
  gallery?: ObjectAny;
  organizations?: Organization[];
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


export type ListingMode = "on" | "after" | "before";
export const ListingModes: ListingMode[] = ["on", "after", "before"];


export type QnA = {
  videoName: string,
  featuredGuests?: string,
  thumbnail?: StrapiPicture,
  videoLink: string,
  uploadDate: string,
  descriptionShort: string
};

