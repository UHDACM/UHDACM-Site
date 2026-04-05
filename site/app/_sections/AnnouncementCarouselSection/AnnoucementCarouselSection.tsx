import AnnouncementCarousel from "@/app/_components/AnnouncementCarousel/AnnouncementCarousel";
import styles from "./AnnouncementCarouselSection.module.css";
import { fetchCMS } from "@/app/_utils/cms";
import {
  isValidAnnouncement,
  isValidSiteSectionAnnouncement,
} from "@shared/types/cms/CMSCheck";
import { AnnouncementObj } from "@shared/types/cms/CMSTypes";

export default async function AnnouncementSection({
  sectionID,
}: {
  sectionID?: string;
}) {
  const res = await fetchCMS(
    "announcement",
    {
      // populate: "*",
      "populate[announcements][populate]": "*"
    },
    ["announcement"],
  );
  const validAnnouncements: AnnouncementObj[] = [];

  console.log("announcement res", res);
  if (
    !res ||
    !res.data ||
    !res.data.announcements ||
    !res.data.announcements.length
  )
    return null;

  console.log("announcement res", res.data.announcements);
  for (const announcement of res.data.announcements) {
    if (!isValidAnnouncement(announcement)) {
      continue;
    }
    validAnnouncements.push(announcement);
  }

  console.log('announcement things', validAnnouncements);
  
  return (
    <div id={sectionID} className={styles.outer}>
      <div className={styles.inner}>
        <AnnouncementCarousel announcements={validAnnouncements} />
      </div>
    </div>
  );
}
