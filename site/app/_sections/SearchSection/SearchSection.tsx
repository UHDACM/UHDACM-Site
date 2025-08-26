import { EntryTileProps } from "@/app/_components/EntryTile/EntryTile";
import { fetchCMS } from "@/app/_utils/cms";
import { EventToEntry } from "@/app/_utils/tsxTools";
import { isValidQnA, isValidSiteEvent } from "@/app/_utils/validation";
import { ReactNode, Suspense } from "react";

import styles from "./SearchSection.module.css";
import EntrySearchTool from "@/app/_components/EntrySearchTool/EntrySearchTool";
import { SearchSectionType } from "@/app/_utils/types/cms/cmsTypes";
import { EntrySortMode, ListingMode, QnA } from "@/app/_utils/types";
import Button from "@/app/_components/Button/Button";
import {
  DefaultChevronRight,
  DefaultOpenInNewTab,
} from "@/app/_icons/Icons";
import {
  intToMonth,
  toTitleCase,
} from "@/app/_utils/tools";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
export default async function SearchSection({
  header,
  type,
  listingMode,
  defaultSortingMode,
  sectionID,
}: {
  header?: string;
  type: SearchSectionType;
  listingMode: ListingMode;
  defaultSortingMode: EntrySortMode;
  sectionID?: string;
}) {
  const CurrentSearchSectionSearchToolProps = {
    listingMode,
    defaultSortingMode,
  };

  let Comp: ReactNode = undefined;

  if (type == "events") {
    Comp = <EventsSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else if (type == "galleries") {
    Comp = <GalleriesSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else if (type == "qnas") {
    Comp = <QnAsSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else {
    return null;
  }

  return (
    <Suspense>
      <div className={"SectionRoot"} id={sectionID}>
        <div className={`SectionInner ${styles.innerStyling}`}>
          {header && (
            <h1 className={`H1 ${styles.searchHeaderTitle}`}>{header}</h1>
          )}
          {Comp}
        </div>
      </div>
    </Suspense>
  );
}

type SearchSectionSearchToolProps = {
  listingMode: ListingMode;
  defaultSortingMode: EntrySortMode;
};

export async function EventsSearchTool({
  listingMode = "after",
  defaultSortingMode = "ascending",
}: SearchSectionSearchToolProps) {
  const res = await fetchCMS("events", { populate: "previewImage" });

  const validEntries: EntryTileProps[] = [];
  if (res) {
    const eventsRaw = res.data;
    for (const event of eventsRaw) {
      if (isValidSiteEvent(event)) {
        validEntries.push(EventToEntry(event));
      }
    }
  }
  return (
    <EntrySearchTool
      entries={validEntries}
      entryTypePlural="Events"
      entryTypeSingular="Event"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}

export async function GalleriesSearchTool({
  listingMode = "after",
  defaultSortingMode = "ascending",
}: SearchSectionSearchToolProps) {
  const res = await fetchCMS("events", {
    "populate[0]": "previewImage",
    "populate[1]": "gallery",
  });
  const eventsRaw = res ? res.data : [];
  const validEntries: EntryTileProps[] = [];
  for (const event of eventsRaw) {
    if (isValidSiteEvent(event) && event.gallery) {
      const entry = EventToEntry(event);
      entry.CallToAction = (
        <div className="BodyLarge" style={{ display: "flex", gap: "0.5rem" }}>
          <ShareButton
            copyText={`${process.env.NEXT_PUBLIC_SELF_URL}/galleries/${event.urlSlug}`}
            replaceTextOnCopyString="Copied!"
          />
          <Button href={`/galleries/${event.urlSlug}`}>
            <span style={{ fontWeight: 500 }}>View Gallery</span>
            <DefaultChevronRight
              fontSize={"inherit"}
              style={{ marginRight: "-0.25rem" }}
              strokeWidth={"0.20rem"}
            />
          </Button>
        </div>
      );
      validEntries.push(entry);
    }
  }
  return (
    <EntrySearchTool
      entries={validEntries}
      entryTypePlural="Galleries"
      entryTypeSingular="Gallery"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}

export async function QnAsSearchTool({
  listingMode = "before",
  defaultSortingMode = "descending",
}: SearchSectionSearchToolProps) {
  const res = await fetchCMS("qnas", { populate: "thumbnail" }, ['qnas']);

  const validEntries: EntryTileProps[] = [];

  const getUploadDateString = (QnA: QnA) => {
    const date = new Date(QnA.uploadDate);
    if (!date.getMonth()) {
      return "Unknown";
    }
    const MonthStr = toTitleCase(`${intToMonth(date.getMonth())}`);
    return `${MonthStr.substring(
      0,
      3
    )} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (res) {
    const qnaRaw = res.data;
    for (const QnA of qnaRaw) {
      if (isValidQnA(QnA)) {
        const UploadDateString = getUploadDateString(QnA);
        validEntries.push({
          date: QnA.uploadDate,
          description: QnA.descriptionShort,
          header: QnA.videoName,
          imageSrc: QnA.thumbnail
            ? `${TryGetImageFormatUrl(QnA.thumbnail, 'medium')}`
            : undefined,
          imageAlt: QnA.thumbnail?.alternativeText,
          style: undefined,
          subheader: `Guest: ${QnA.featuredGuests}`,
          subheaderTwo: UploadDateString,
          CallToAction: (
            <div
              className="BodyLarge"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <ShareButton
                copyText={`${QnA.videoLink}`}
                replaceTextOnCopyString="Copied!"
              />
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                href={`${QnA.videoLink}`}
                target="_blank"
              >
                <span style={{ fontWeight: 500 }}>Watch QnA</span>
                <DefaultOpenInNewTab
                  fontSize={"inherit"}
                  // style={{ marginRight: "-0.25rem" }}
                  // strokeWidth={"0.025rem"}
                />
              </Button>
            </div>
          ),
        });
      }
    }
  }

  return (
    <EntrySearchTool
      entries={validEntries}
      entryTypePlural="QnAs"
      entryTypeSingular="QnA"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}
