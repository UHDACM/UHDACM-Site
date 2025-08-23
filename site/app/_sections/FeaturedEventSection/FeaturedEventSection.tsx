import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from "@/app/_components/FeaturedEvent/FeaturedEvent";
import { fetchCMS } from "@/app/_utils/cms";
import { isStrapiPicture, isValidEvent } from "@/app/_utils/validation";

import styles from "./FeaturedEventSection.module.css";
import Button from "@/app/_components/Button/Button";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "@/app/_components/Button/Variants/AddToCalendarButton";

export default async function FeaturedEventSection() {
  const res = await fetchCMS("featured-event", {
    "populate[event][populate]": "*",
    populate: "PreviewImageHD",
  });

  if (!res) {
    return;
  }

  const { event, PreviewImageHD } = res.data;

  if (!event || !isValidEvent(event)) {
    return undefined;
  }

  const imgUrl = isStrapiPicture(PreviewImageHD)
    ? `${process.env.NEXT_PUBLIC_CMS_URL}${PreviewImageHD.url}`
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
    <div className={styles.SectionRoot}>
      <div className={styles.SectionInner}>
        <h1 className="H1">Featured Event</h1>
        <div className={styles.featuredEventWrapper}>
          <FeaturedEvent
            title={event.Name}
            largeHeavy={subheader}
            smallHeavy={event.Location}
            caption={event.DescriptionShort}
            BottomComponent={
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: 'wrap'
                }}
              >
                <ShareButton
                  copyText={`${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.UrlSlug}`}
                  replaceTextOnCopyString="Link Copied"
                />
                <AddToCalendarButton
                  title={event.Name}
                  details={event.DescriptionShort}
                  location={event.Location}
                  start={event.DateStart}
                  end={event.DateEnd}
                />
                <Button
                  href={`/events/${event.UrlSlug}`}
                  // onClick: () => alert("Right button clicked!"),
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span className="BodyLargeHeavy">View Event</span>
                    <DefaultChevronRight
                      fontSize={"inherit"}
                      style={{ marginRight: "-0.25rem" }}
                      strokeWidth={"0.20rem"}
                    />
                  </div>
                </Button>
              </div>
            }
            img={`${imgUrl}`}
          />
        </div>
      </div>
    </div>
  );
}
