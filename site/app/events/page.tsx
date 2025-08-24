import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import FeaturedEventSection from "../_sections/FeaturedEventSection/FeaturedEventSection";
import EntrySearchTool from "../_components/EntrySearchTool/EntrySearchTool";
import Button from "../_components/Button/Button";
import { fetchCMS } from "../_utils/cms";
import { isValidSiteEvent } from "../_utils/validation";
import { Suspense } from "react";
import styles from "./eventsPage.module.css";
import { EntryTileProps } from "../_components/EntryTile/EntryTile";
import { EventToEntry } from "../_utils/tsxTools";

export default async function Page() {
  return (
    <div className={styles.pageRoot}>
      <MainHeroSection
        spanText="EVENTS"
        title={`Something Catchy\nN'Stuff Here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        addNavbarPadding={true}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <FeaturedEventSection />
      <SearchEvents />
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

async function SearchEvents() {
  const res = await fetchCMS("events", { populate: "PreviewImage" });

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
    <Suspense>
      <div className={styles.searchEventsRoot}>
        <div className={styles.searchEventsInner}>
          <h1 className={`H1 ${styles.searchEventsTitle}`}>Search Events</h1>
          <EntrySearchTool
            entries={validEntries}
            entryTypePlural="Events"
            entryTypeSingular="Event"
            defaultListingMode="after"
            defaultSortingMode="ascending"
          />
        </div>
      </div>
    </Suspense>
  );
}


