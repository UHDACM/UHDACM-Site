import { DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from "@/app/_components/FeaturedEvent/FeaturedEvent";
import { fetchAPI } from "@/app/_utils/cms";
import { isStrapiPicture, isValidEvent } from "@/app/_utils/validation";

export default async function FeaturedEventSection() {
  const res = await fetchAPI("featured-event", {
    "populate[event][populate]": "*",
    populate: "PreviewImageHD",
  });

  const { event, PreviewImageHD } = res.data;

  if (!event || !isValidEvent(event)) {
    return undefined;
  }

  const imgUrl = isStrapiPicture(PreviewImageHD)
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${PreviewImageHD.url}`
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "90vw",
          maxWidth: "var(--page-max-width)",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0rem 1rem",
          boxSizing: "border-box",
        }}
      >
        <h1 className="H1">Featured Event</h1>
        <div style={{ width: "100%", height: "25rem" }}>
          <FeaturedEvent
            title={event.Name}
            largeHeavy={subheader}
            smallHeavy={event.Location}
            caption={event.DescriptionShort}
            leftButtonProps={{
              children: <DefaultEllipsis />,
              href: "/left",
            }}
            rightButtonProps={{
              children: "View Event",
              href: `/events/${event.UrlSlug}`,
              // onClick: () => alert("Right button clicked!"),
            }}
            img={`${imgUrl}`}
          />
        </div>
      </div>
    </div>
  );
}
