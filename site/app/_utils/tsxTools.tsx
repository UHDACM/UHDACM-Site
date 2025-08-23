import Button from "../_components/Button/Button";
import ShareButton from "../_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "../_components/Button/Variants/AddToCalendarButton";
import { EntryTileProps } from "../_components/EntryTile/EntryTile";
import { DefaultChevronRight } from "../_icons/Icons";
import { ProduceCMSResourceURL } from "./tools";
import { SiteEvent } from "./types";
import { isStrapiPicture } from "./validation";

export function EventToEntry(event: SiteEvent): EntryTileProps {
  const imgUrl = isStrapiPicture(event.PreviewImage)
    ? `${ProduceCMSResourceURL(event.PreviewImage.url)}`
    : undefined;

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
  return {
    date: event.DateStart,
    dateEnd: event.DateEnd,
    CallToAction: (
      <div
        className="BodyLarge"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "end",
        }}
      >
        <AddToCalendarButton
          title={event.Name}
          details={event.DescriptionShort}
          location={event.Location}
          start={event.DateStart}
          end={event.DateEnd}
          // menuLeft={true}
        />
        <ShareButton
          copyText={`${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.UrlSlug}`}
          replaceTextOnCopyString="Link Copied"
        />
        <Button href={`/events/${event.UrlSlug}`}>
          <span style={{ fontWeight: 500 }}>View</span>
          <DefaultChevronRight
            fontSize={"inherit"}
            style={{ marginRight: "-0.25rem" }}
            strokeWidth={"0.20rem"}
          />
        </Button>
      </div>
    ),
    description: event.DescriptionShort,
    header: event.Name,
    imageSrc: imgUrl,
    imageAlt: event.PreviewImage?.alternativeText,
    style: undefined,
    subheader: subheader,
    subheaderTwo: event.Location,
  };
}