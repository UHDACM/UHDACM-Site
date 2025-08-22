import styles from "./event.module.css";
import Button from "@/app/_components/Button/Button";
import CoolImage from "@/app/_components/CoolImage/CoolImage";
import StrapiRichTextRenderer from "@/app/_components/StrapiRichTextRenderer/StrapiRichTextRenderer";
import {
  DefaultCalendar,
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
import { fetchCMS } from "@/app/_utils/cms";
import { isValidEvent } from "@/app/_utils/validation";
import Page404 from "@/app/not-found";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

type EventPageParams = Promise<{
  eventID: string;
}>;

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { eventID } = await params;
  const res = await fetchCMS("events", {
    populate: "*",
    "filters[UrlSlug][$eq]": eventID,
  });

  const event = res.data[0]; // Assuming the API returns an array of events

  if (!event || !isValidEvent(event)) {
    return (
      <Page404
        customMessage={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              gap: '0.5rem'
            }}
          >
            <h1 className="H4">Event not found</h1>
            <Button href="/events">Back to Events</Button>
          </div>
        }
      />
    );
  }

  const dateStart = new Date(event.DateStart);
  const dateEnd = new Date(event.DateEnd);

  // Format date as "MMM D, YYYY"
  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Format time as "h:mm AM/PM"
  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const sameDay =
    dateStart.getFullYear() === dateEnd.getFullYear() &&
    dateStart.getMonth() === dateEnd.getMonth() &&
    dateStart.getDate() === dateEnd.getDate();

  const sameTime =
    dateStart.getHours() === dateEnd.getHours() &&
    dateStart.getMinutes() === dateEnd.getMinutes();

  let subheader = "";
  if (!sameDay) {
    subheader = `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
  } else if (!sameTime) {
    subheader = `${formatDate(dateStart)}, ${formatTime(
      dateStart
    )} - ${formatTime(dateEnd)}`;
  } else {
    subheader = `${formatDate(dateStart)}, ${formatTime(dateStart)}`;
  }

  console.log(event);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <MainHeroSection
        spanText="EVENT"
        title={event.Name}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        addNavbarPadding={true}
        rightContent={
          <CoolImage
            style={{ height: "24rem", overflow: "hidden" }}
            src={
              `${process.env.NEXT_PUBLIC_STRAPI_URL}${event.PreviewImage?.url}` ||
              "/sjd.JPG"
            }
          />
        }
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
          width: "95vw",
          maxWidth: "var(--page-max-width)",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "start",
          gap: "1rem",
          margin: "2rem 0rem",
          boxSizing: "border-box",
        }}
      >
        <EventDetails
          icon="clock"
          header="When"
          body={`${subheader}`}
          bodyColor="rgb(var(--color-font-primary))"
        />
        <EventDetails
          icon="location"
          header="Where"
          body={event.Location || "Location not specified"}
          bodyColor="rgb(var(--color-font-secondary))"
        />
        <EventDetails
          icon="people"
          header="Host"
          body={
            event.Organizations?.map((org) => org.Name).join(", ") ||
            "No host specified"
          }
          bodyColor="rgb(var(--color-font-accent))"
        />
      </div>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "2rem 1rem",
          marginTop: "4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className={styles.eventDescription}>
          <h1 className="H1">Event Description</h1>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {event.DescriptionFull && (
              <StrapiRichTextRenderer content={event.DescriptionFull} />
            )}
          </div>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
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
