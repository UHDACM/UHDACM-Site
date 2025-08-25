import {
  DefaultChevronLeft,
  DefaultChevronRight,
  DefaultShareOutline,
  DefaultCalendar,
  DefaultSearch,
} from "@/app/_icons/Icons";
import { CMSButtonIcon } from "./cmsTypes";

export function getDefaultIconForCMSButton(icon: CMSButtonIcon) {
  const iconMap: Record<CMSButtonIcon, React.ElementType> = {
    "chevron-left": DefaultChevronLeft,
    "chevron-right": DefaultChevronRight,
    "share": DefaultShareOutline,
    "calendar": DefaultCalendar,
    "search": DefaultSearch,
  };

  return iconMap[icon] || null;
}