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

type EventPageParams = Promise<{
  galleryID: string;
}>;

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { galleryID } = await params;

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
        title={`Gallery Name`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
        bottomContent={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ShareButton />
          </div>
        }
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "95vw",
            maxWidth: "var(--page-max-width)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.5rem",
            padding: "2rem 1rem",
            boxSizing: "border-box",
          }}
        >
          {/* Example images, replace src with your gallery images */}
          <img
            src="/sjd.JPG"
            alt="Gallery image 1"
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              objectFit: "cover",
            }}
          />
          <img
            src="/sjd.JPG"
            alt="Gallery image 2"
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              objectFit: "cover",
            }}
          />
          <img
            src="/sjd.JPG"
            alt="Gallery image 3"
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              objectFit: "cover",
            }}
          />
          <img
            src="/sjd.JPG"
            alt="Gallery image 4"
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      <CallToActionSection
        title={`Show up, Schedule, Share`}
        subtitle="Your next step is your best step. Be sure to make it count!"
        actionComponent={
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <AddToCalendarButton />
            <ShareButton />
          </div>
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
