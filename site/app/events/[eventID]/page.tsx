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
  eventID: string;
}>;

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { eventID } = await params;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        position: "relative",
      }}
    >
      <Button
        className="Button--Hallow"
        style={{ position: "absolute", top: "1rem", left: "1rem" }}
        href='/events'
      >
        <DefaultChevronLeft strokeWidth={'0.2rem'} style={{ marginLeft: "-0.25rem" }} /> Back
      </Button>
      <MainHeroSection
        spanText="EVENT"
        title={`Event Name`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
        bottomContent={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <AddToCalendarButton />
            <ShareButton />
          </div>
        }
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "start",
          gap: "2rem",
          margin: "2rem 0rem",
        }}
      >
        <EventDetails
          icon="clock"
          header="When"
          body="Saturday, December 7th, 2024 from 2:00 PM to 5:00 PM CST"
          bodyColor="rgb(var(--color-font-primary))"
        />
        <EventDetails
          icon="location"
          header="Where"
          body="Room 123, One Main Building, UHD"
          bodyColor="rgb(var(--color-font-secondary))"
        />
        <EventDetails
          icon="people"
          header="Host"
          body={`UHD ACM\nGirl Genius`}
          bodyColor="rgb(var(--color-font-accent))"
        />
      </div>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "4rem 1rem",
          marginTop: "4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "50rem",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}
        >
          <h1 className="FontH1">Event Description</h1>
          <span
            style={{
              width: "100%",
            }}
            className="BodyLarge"
          >
            {/* Add your rich text here... */}
            This is a rich text area for the event description.
          </span>
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
        <h2 className="FontH2">{header}</h2>
      </div>
      <span
        className="BodyLarge"
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
