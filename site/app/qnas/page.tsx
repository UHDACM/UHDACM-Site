import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import EntrySearchTool from "../_components/EntrySearchTool/EntrySearchTool";
import Button from "../_components/Button/Button";
import { fetchCMS } from "../_utils/cms";
import { isValidQnA } from "../_utils/validation";
import { Suspense } from "react";
import styles from "./eventsPage.module.css";
import { EntryTileProps } from "../_components/EntryTile/EntryTile";
import { intToMonth, toTitleCase } from "../_utils/tools";

export default async function Page() {
  return (
    <div className={styles.pageRoot}>
      <MainHeroSection
        spanText="QnAs"
        title={`Something About\nQnAs Here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        addNavbarPadding={true}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <SearchQnAs />
      <CallToActionSection
        title={`Want to collaborate\nwith UHDACM?`}
        subtitle="We'd love to hear from u or sumn"
        actionComponent={
          <Button>
            <div className={styles.collabButtonContent}>
              <span className={styles.collabButtonText}>
                Collab with UHD ACM
              </span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
      />
    </div>
  );
}

async function SearchQnAs() {
  const res = await fetchCMS("qnas", { populate: "Thumbnail" });

  const validEntries: EntryTileProps[] = [];

  if (res) {
    const qnaRaw = res.data;
    for (const QnA of qnaRaw) {
      const UploadDateString = (() => {
        const date = new Date(QnA.UploadDate);
        if (!date.getMonth()) {
          return "Unknown";
        }
        const MonthStr = toTitleCase(`${intToMonth(date.getMonth())}`);
        return `${MonthStr.substring(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
      })();
      if (isValidQnA(QnA)) {
        validEntries.push({
          date: QnA.UploadDate,
          description: QnA.DescriptionShort,
          header: QnA.VideoName,
          imageSrc: QnA.Thumbnail
            ? `${process.env.NEXT_PUBLIC_CMS_URL}${QnA.Thumbnail.url}`
            : undefined,
          imageAlt: QnA.Thumbnail?.alternativeText,
          style: undefined,
          subheader: `Guest: ${QnA.FeaturedGuests}`,
          subheaderTwo: UploadDateString,
          CallToAction: (
            <div
              className="BodyLarge"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button>
                <DefaultEllipsis />
              </Button>
              <Button href={`${QnA.VideoLink}`}>
                <span style={{ fontWeight: 500 }}>View Event</span>
                <DefaultChevronRight
                  fontSize={"inherit"}
                  style={{ marginRight: "-0.25rem" }}
                  strokeWidth={"0.20rem"}
                />
              </Button>
            </div>
          ),
        });
      }
    }
  }
  return (
    <Suspense>
      <div className={styles.searchEventsRoot}>
        <div className={styles.searchEventsInner}>
          <h1 className={`H1 ${styles.searchEventsTitle}`}>Search QnAs</h1>
          <EntrySearchTool
            entries={validEntries}
            entryTypePlural="QnAs"
            entryTypeSingular="QnA"
            defaultListingMode="before"
            defaultSortingMode="descending"
          />
        </div>
      </div>
    </Suspense>
  );
}
