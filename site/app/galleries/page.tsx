import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
// import FeaturedEventSection from "../_sections/FeaturedEventSection/FeaturedEvent";
import EntrySearchTool from "../_components/EntrySearchTool/EntrySearchTool";
import Button from "../_components/Button/Button";
import { fetchCMS } from "../_utils/cms";
import { isValidEvent } from "../_utils/validation";
import { Suspense } from "react";
import { EntryTileProps } from "../_components/EntryTile/EntryTile";
import { EventToEntry } from "../_utils/tsxTools";

export default async function Page() {
  const res = await fetchCMS("events", {
    "populate[0]": "PreviewImage",
    "populate[1]": "Gallery",
  });
  const eventsRaw = res ? res.data : [];
  const validEntries: EntryTileProps[] = [];
  for (const event of eventsRaw) {
    if (isValidEvent(event) && event.Gallery) {
      const entry = EventToEntry(event);
      entry.CallToAction = (
        <div className="BodyLarge" style={{ display: "flex", gap: "0.5rem" }}>
          <Button>
            <DefaultEllipsis />
          </Button>
          <Button href={`/galleries/${event.UrlSlug}`}>
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="GALLERIES"
        title={`Something Catchy\nN'Stuff Here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        addNavbarPadding={true}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      {/* <FeaturedEventSection /> */}
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "95vw",
            maxWidth: "var(--page-max-width)",
            padding: "6rem 1rem",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <h1
            className="H1"
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            Search Galleries
          </h1>
          <Suspense>
            <EntrySearchTool
              entries={validEntries}
              entryTypePlural="Galleries"
              entryTypeSingular="Gallery"
              defaultListingMode="before"
              defaultSortingMode="descending"
            />
          </Suspense>
        </div>
      </div>
      <CallToActionSection
        title={`Want to collaborate\nwith UHDACM?`}
        subtitle="We'd love to hear from u or sumn"
        actionComponent={
          <Button>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Collab with UHD ACM</span>
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
