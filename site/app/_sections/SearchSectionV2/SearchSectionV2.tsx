import { Suspense } from "react";
import { fetchCMSAll } from "@/app/_utils/cms";
import {
  isValidQnASummary,
  isValidSiteEventSummary,
} from "@shared/types/cms/CMSCheck";
import { QnASummary, SiteEventSummary } from "@shared/types/cms/CMSTypes";
import {
  ProduceDateRangeText,
  TryGetImageFormatUrl,
} from "@/app/_utils/types/cms/cmsTypeTools";
import {
  formatRelativeUpcoming,
  isUpcoming,
} from "@/app/_utils/dateRelative";
import { public_env_vars } from "@/app/_utils/public_env_vars";
import { extractColorSpans } from "../SplitHeroSection/HeroTextBlock/HeroTextBlock";
import SearchSectionV2Client, {
  SearchSectionV2Item,
} from "./SearchSectionV2Client";
import styles from "./SearchSectionV2.module.css";

export type SearchSectionV2Type = "events" | "qnas";

export type SearchSectionV2Props = {
  sectionID?: string;
  type: SearchSectionV2Type;
  title?: string;
  subtitle?: string;
};

export default async function SearchSectionV2({
  sectionID,
  type,
  title,
  subtitle,
}: SearchSectionV2Props) {
  const cmsUrl = public_env_vars.NEXT_PUBLIC_CMS_URL;
  let items: SearchSectionV2Item[] = [];

  if (type === "events") {
    const res = await fetchCMSAll("events", {
      "fields[0]": "urlSlug",
      "fields[1]": "name",
      "fields[2]": "dateStart",
      "fields[3]": "dateEnd",
      "fields[4]": "descriptionShort",
      "fields[5]": "location",
      "populate[previewImage]": "true",
      "populate[gallery][fields][0]": "id",
    });
    const raw = res.data;
    console.log('raww data', raw);
    const events: SiteEventSummary[] = [];
    for (const ev of raw) {
      if (isValidSiteEventSummary(ev)) events.push(ev);
    }
    items = events
      .map((event) => eventToItem(event, cmsUrl))
      .sort(
        (a, b) =>
          new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
      );
  } else if (type === "qnas") {
    const res = await fetchCMSAll("qnas", {
      "fields[0]": "videoName",
      "fields[1]": "videoLink",
      "fields[2]": "uploadDate",
      "fields[3]": "descriptionShort",
      "fields[4]": "featuredGuests",
      "populate[thumbnail]": "true",
    });
    const raw = res.data;
    const qnas: QnASummary[] = [];
    for (const q of raw) {
      if (isValidQnASummary(q)) qnas.push(q);
    }
    items = qnas
      .map((qna) => qnaToItem(qna, cmsUrl))
      .sort(
        (a, b) =>
          new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
      );
  }

  return (
    <Suspense>
      <div className={"SectionRoot"} id={sectionID}>
        <div className={`SectionInner ${styles.innerStyling}`}>
          {(title || subtitle) && (
            <div className={styles.headerBlock}>
              {title && (
                <h1 className={`H3 ${styles.headerTitle}`}>
                  {extractColorSpans(title, "H3")}
                </h1>
              )}
              {subtitle && (
                <div className={`SubtitleRegular ${styles.headerSubtitle}`}>
                  {extractColorSpans(subtitle, "SubtitleRegular")}
                </div>
              )}
            </div>
          )}
          <SearchSectionV2Client items={items} type={type} />
        </div>
      </div>
    </Suspense>
  );
}

function eventToItem(event: SiteEventSummary, cmsUrl: string): SearchSectionV2Item {
  const imgUrl = event.previewImage
    ? TryGetImageFormatUrl(event.previewImage, "medium", cmsUrl)
    : undefined;

  const meta: SearchSectionV2Item["meta"] = [
    {
      icon: "calendar",
      color: "primary",
      text: ProduceDateRangeText(event.dateStart, event.dateEnd),
    },
  ];
  if (event.location) {
    meta.push({
      icon: "location-pin",
      color: "secondary",
      text: event.location,
    });
  }

  const upcoming = isUpcoming(event.dateStart);
  return {
    id: event.id,
    title: event.name,
    subtitle: event.descriptionShort,
    imageSrc: imgUrl,
    imageAlt: event.previewImage?.alternativeText,
    href: `/events/${event.urlSlug}`,
    meta,
    sortDate: event.dateStart,
    hasGallery: !!event.gallery,
    location: event.location,
    isUpcoming: upcoming,
    upcomingLabel: upcoming ? formatRelativeUpcoming(event.dateStart) ?? undefined : undefined,
  };
}

function qnaToItem(qna: QnASummary, cmsUrl: string): SearchSectionV2Item {
  const imgUrl = qna.thumbnail
    ? TryGetImageFormatUrl(qna.thumbnail, "medium", cmsUrl)
    : undefined;

  const meta: SearchSectionV2Item["meta"] = [
    {
      icon: "calendar",
      color: "primary",
      text: ProduceDateRangeText(qna.uploadDate, qna.uploadDate),
    },
  ];
  if (qna.featuredGuests) {
    meta.push({
      icon: "users",
      color: "secondary",
      text: qna.featuredGuests,
    });
  }

  const upcoming = isUpcoming(qna.uploadDate);
  return {
    id: qna.videoLink,
    title: qna.videoName,
    subtitle: qna.descriptionShort,
    imageSrc: imgUrl,
    imageAlt: qna.thumbnail?.alternativeText,
    href: qna.videoLink,
    meta,
    sortDate: qna.uploadDate,
    featuredGuests: qna.featuredGuests,
    isUpcoming: upcoming,
    upcomingLabel: upcoming ? formatRelativeUpcoming(qna.uploadDate) ?? undefined : undefined,
  };
}
