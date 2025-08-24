import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from "@/app/_components/FeaturedEvent/FeaturedEvent";
import { fetchCMS } from "@/app/_utils/cms";
import { isStrapiPicture, isValidSiteEvent } from "@/app/_utils/validation";

import styles from "./FeaturedEventSection.module.css";
import Button from "@/app/_components/Button/Button";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "@/app/_components/Button/Variants/AddToCalendarButton";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import { isValidFeaturedEvent } from "@/app/_utils/types/cms/cmsTypes";

export default async function FeaturedEventSection() {
  const res = await fetchCMS("featured-event", {
    "populate[event][populate]": "*",
    populate: "previewImageHD",
  });

  if (!res) {
    return;
  }

  const featuredEvent = res.data;
  if (!isValidFeaturedEvent(featuredEvent)) {
    return;
  }

  const { event, previewImageHD } = featuredEvent;

  if (!event || !isValidSiteEvent(event)) {
    return undefined;
  }

  const imgUrl = isStrapiPicture(previewImageHD)
    ? `${ProduceCMSResourceURL(previewImageHD.url)}`
    : undefined;

  const dateStart = new Date(event.dateStart);
  const dateEnd = new Date(event.dateEnd);

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
            title={event.name}
            largeHeavy={subheader}
            smallHeavy={event.location}
            caption={event.descriptionShort}
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
                  copyText={`${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.urlSlug}`}
                  replaceTextOnCopyString="Link Copied"
                />
                <AddToCalendarButton
                  title={event.name}
                  details={event.descriptionShort}
                  location={event.location}
                  start={event.dateStart}
                  end={event.dateEnd}
                />
                <Button
                  href={`/events/${event.urlSlug}`}
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
