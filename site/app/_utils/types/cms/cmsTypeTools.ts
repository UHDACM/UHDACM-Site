
import { QnA, SiteEvent, SiteProject, StrapiPicture } from "@shared/types/cms/CMSTypes";
import { ProduceCMSResourceURL } from "../../tools";



/**
 * Given strapi picture, try to get the URL for a specific format
 * auto formats the url using `ProduceCMSResourceURL`.
 * @param img 
 * @param format 
 * @returns 
 */
export function TryGetImageFormatUrl(img: StrapiPicture, format: keyof StrapiPicture["formats"], cmsUrl: string) {
  let url: string = '';
  if (!img) return undefined;
  if (img.formats && img.formats[format]) {
    url = img.formats[format].url;
  } else {
    url = img.url;
  }

  const resourceURL = ProduceCMSResourceURL(cmsUrl, url) || undefined;
  return resourceURL;
}

export function ProduceDateRangeText(dateStartStr: string, dateEndStr: string) {
  const dateStart = new Date(dateStartStr);
  const dateEnd = new Date(dateEndStr);
  
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

  let dateRangeStr = "";
  if (!sameDay) {
    dateRangeStr = `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
  } else if (!sameTime) {
    dateRangeStr = `${formatDate(dateStart)}, ${formatTime(
      dateStart
    )} - ${formatTime(dateEnd)}`;
  } else {
    dateRangeStr = `${formatDate(dateStart)}, ${formatTime(dateStart)}`;
  }
  return dateRangeStr;
}

/**
 * Date text for a project.
 *
 * Separate from ProduceDateRangeText because that helper always appends a clock
 * time, which reads wrong for something that ran over weeks. Projects are shown
 * at month granularity, and a missing end date means "still running".
 */
export function ProduceProjectDateText(dateStartStr: string, dateEndStr?: string) {
  const formatMonth = (date: Date) =>
    date.toLocaleDateString(undefined, { year: "numeric", month: "short" });

  const dateStart = new Date(dateStartStr);
  if (!dateEndStr) {
    return `${formatMonth(dateStart)} - Ongoing`;
  }

  const dateEnd = new Date(dateEndStr);
  const sameMonth =
    dateStart.getFullYear() === dateEnd.getFullYear() &&
    dateStart.getMonth() === dateEnd.getMonth();

  return sameMonth
    ? formatMonth(dateStart)
    : `${formatMonth(dateStart)} - ${formatMonth(dateEnd)}`;
}

/**
 * Generates a shareable project text with the project URL.
 */
export function generateProjectShareText(project: SiteProject, selfUrl: string): string {
  const dateStr = ProduceProjectDateText(project.dateStart, project.dateEnd);
  return `UHDACM Project: ${project.name}\n\nDate: ${dateStr}\n\nDescription: ${project.descriptionShort}\n\n${selfUrl}/projects/${project.urlSlug}`;
}

/**
 * Generates a shareable event text with the event URL.
 * @param event SiteEvent
 * @returns string
 */
export function generateEventShareText(event: SiteEvent, selfUrl: string): string {
  const dateRangeStr = ProduceDateRangeText(event.dateStart, event.dateEnd);
  return `UHDACM Event: ${event.name}\n\nDate: ${dateRangeStr}\nLocation: ${event.location}\n\nDescription: ${event.descriptionShort}\n\n${selfUrl}/events/${event.urlSlug}`;
}

export function generateGalleryShareText(galleryEvent: SiteEvent, selfUrl: string): string {
  const dateRangeStr = ProduceDateRangeText(galleryEvent.dateStart, galleryEvent.dateEnd);
  return `UHDACM Gallery: ${galleryEvent.name}\n\nDate: ${dateRangeStr}\nLocation: ${galleryEvent.location}\n\nDescription: ${galleryEvent.descriptionShort}\n\n${selfUrl}/galleries/${galleryEvent.urlSlug}`;
}

export function generateQnAShareText(QnA: QnA): string {
  const dateRangeStr = ProduceDateRangeText(QnA.uploadDate, QnA.uploadDate);
  return `UHDACM QnA: ${QnA.videoName}\n\nDate: ${dateRangeStr}\nFeaturing: ${QnA.featuredGuests}\n\nDescription: ${QnA.descriptionShort}\n\n${QnA.videoLink}`;
}
