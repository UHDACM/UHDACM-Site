import { ReactNode } from "react";

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
  UrlSlug: string;
  Name: string;
  PreviewImage: StrapiPicture | undefined;
  DateStart: string;
  DateEnd: string;
  DescriptionShort: string;
  DescriptionFull: ObjectAny[];
  Location: string;
  Organizations?: Organization[];
};

export type SocialSite =
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "personal_site"
  | "github"
  | "youtube";

export const SocialSites: SocialSite[] = [
  "linkedin",
  "x",
  "facebook",
  "instagram",
  "personal_site",
  "github",
  "youtube"
];

export type SocialObj = {
  type: SocialSite;
  url: string;
}

export type Person = {
  Name: string;
  NameShort: string;
  Picture: StrapiPicture | undefined;
  Role: string;
  RoleShort: string;
  Description: string;
  Socials: SocialObj[];
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
  Name: string,
  Description: string,
  Logo: StrapiPicture | undefined,
};


