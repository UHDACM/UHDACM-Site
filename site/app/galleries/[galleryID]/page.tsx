import Button from "@/app/_components/Button/Button";
import CoolImage from "@/app/_components/CoolImage/CoolImage";
import {
  DefaultCalendar,
  DefaultChevronLeft,
  DefaultChevronRight,
  DefaultClock,
  DefaultLocation,
  DefaultPeople,
  DefaultShareOutline,
} from "@/app/_icons/Icons";
function AddToCalendarButton() {
  return (
    <Button>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          alignItems: "center",
          fontWeight: 800,
        }}
      >
        <span style={{ fontWeight: 500 }}>Add to Calendar</span>
        <DefaultCalendar fontSize={"inherit"} strokeWidth={"0.15rem"} />
      </div>
    </Button>
  );
}

function ShareButton() {
  return (
    <Button>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          alignItems: "center",
          fontWeight: 800,
        }}
      >
        <span style={{ fontWeight: 500 }}>Share</span>
        <DefaultShareOutline fontSize={"inherit"} strokeWidth={"0.15rem"} />
      </div>
    </Button>
  );
}
import CallToActionSection from "@/app/_sections/CallToActionSection/CallToActionSection";
import MainHeroSection from "@/app/_sections/MainHeroSection/MainHeroSection";
import GalleryGrid from "./_components/GalleryGrid";
import { fetchAPI } from "@/app/_utils/cms";
import { isStrapiPicture, isValidEvent } from "@/app/_utils/validation";
import { StrapiPicture } from "@/app/_utils/types";

type EventPageParams = Promise<{
  galleryID: string;
}>;

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { galleryID } = await params;
  const res = await fetchAPI("events", {
    "populate[0]": "PreviewImage",
    "populate[1]": "Gallery.media",
    "filters[UrlSlug][$eq]": galleryID,
  });

  const event = res.data[0];
  if (!isValidEvent(event) || !event.Gallery) {
    return <div>404 - Event Not Found</div>;
  }
  
  const { media } = event.Gallery;
  console.log("saihud", media);
  if (!media) {
    return <div>No media</div>;
  }

  const validMedia: StrapiPicture[] = [];
  for (let pic of media) {
    if (isStrapiPicture(pic)) {
      validMedia.push(pic);
    }
  }
  // TODO: add 404 page

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        position: "relative",
      }}
    >
      {/* <Button
        className="Button--Hallow"
        href='/events'
      >
        <DefaultChevronLeft strokeWidth={'0.2rem'} style={{ marginLeft: "-0.25rem" }} /> Back
      </Button> */}
      <MainHeroSection
        spanText="GALLERY"
        title={`${event.Name}`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        topLevelStyle={{
          paddingTop: '2.5rem',
        }}
        rightContent={
          <CoolImage
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${event.PreviewImage?.url}`}
          />
        }
        bottomContent={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ShareButton />
          </div>
        }
      />

      <GalleryGrid media={validMedia} />

      <CallToActionSection
        title={`Show up, Schedule, Share`}
        subtitle="Your next step is your best step. Be sure to make it count!"
        actionComponent={
          <Button style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Contact Us</span>
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

type EventDetailsProps = {
  icon: "clock" | "location" | "people";
  header: string;
  body: string;
  bodyColor?: string;
};

function EventDetails({ icon, header, body, bodyColor }: EventDetailsProps) {
  let IconComponent;
  let strokeWidth;
  switch (icon) {
    case "clock":
      IconComponent = DefaultClock;
      strokeWidth = "0.1rem";
      break;
    case "location":
      IconComponent = DefaultLocation;
      strokeWidth = "0.04rem";
      break;
    case "people":
      IconComponent = DefaultPeople;
      strokeWidth = "0.1rem";
      break;
    default:
      IconComponent = DefaultClock;
      strokeWidth = "0.15rem";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "center",
        width: "12rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <IconComponent
          size={"2rem"}
          color={"rgb(var(--color-font-default))"}
          strokeWidth={strokeWidth}
        />
        <h2 className="H2">{header}</h2>
      </div>
      <span
        className="BodyRegular"
        style={{
          textAlign: "center",
          whiteSpace: "pre-line",
          ...(bodyColor ? { color: bodyColor } : {}),
        }}
      >
        {body}
      </span>
    </div>
  );
}
