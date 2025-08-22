"use client";

import Select from "@/app/_components/Select/Select";
import { useState } from "react";
import EntryTile from "../EntryTile/EntryTile";
import Button from "../Button/Button";
import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import { ListingMode, ListingModes, SiteEvent } from "@/app/_utils/types";
import { toTitleCase } from "@/app/_utils/tools";

import styles from "./EntryListing.module.css";

export type EntrySortMode = "ascending" | "descending";
export const EntrySortModes: EntrySortMode[] = ["ascending", "descending"];

// TODO: Maybe migrate this to types?
interface EventListingProps {
  day: number;
  month: string;
  year: string;
  entryTypePlural: string;
  entryTypeSingular: string;
  events: SiteEvent[];
  search?: string;
  defaultListingMode?: ListingMode;
  defaultSortingMode?: EntrySortMode;
  onDatePress?: () => void;
}

export function EventListing({
  day,
  month,
  year,
  entryTypePlural,
  events,
  entryTypeSingular,
  search,
  defaultListingMode,
  defaultSortingMode,
  onDatePress,
}: EventListingProps) {
  const [listingMode, setListingMode] = useState<ListingMode>(
    defaultListingMode || "after"
  );
  const [sortingMode, setSortingMode] = useState<EntrySortMode>(
    defaultSortingMode || "ascending"
  );

  const remainingEventSet = new Set<number>();
  events.forEach((event) => {
    if (!event.Name.toLowerCase().includes(search?.toLowerCase() || "")) {
      return;
    }
    // const eventID = event.id.toString();
    const eventDate = new Date(event.DateStart);
    const selectedDate = new Date(`${year}-${month}-${day}`);

    // Zero out the time for both dates to compare only year, month, day
    eventDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (listingMode.toLowerCase() === "on") {
      if (
        !(
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        )
      ) {
        return;
      }
    } else if (listingMode.toLowerCase() === "before") {
      if (!(eventDate <= selectedDate)) {
        return;
      }
    } else {
      // "after"
      if (!(eventDate >= selectedDate)) {
        return;
      }
    }
    remainingEventSet.add(event.id);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <h3 className={`H5`} style={{ margin: 0, userSelect: "none" }}>
            {entryTypePlural}
          </h3>
          <div className={`BodyLargeHeavy ${styles.selectWrapper}`}>
            <Select
              inputStyling={{
                backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
              }}
              selected={toTitleCase(listingMode)}
              onSelect={(v) => setListingMode(v as ListingMode)}
              options={ListingModes}
            />
          </div>
          <h3
            className={`H5 ${styles.underlineOnMobile}`}
            style={{
              margin: 0,
              color: "rgb(var(--color-font-secondary))",
              userSelect: "none",
            }}
            onClick={onDatePress}
          >
            {`${month} ${day}, ${year}`}
          </h3>
        </div>
        <div style={{ marginLeft: 'auto', display: "flex", justifyContent: "end" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span className="BodyRegular">{entryTypeSingular} Order</span>
            <div
              className="BodyLarge"
              style={{
                width: "8.5rem",
                display: "flex",
                alignItems: "end",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <Select
                onSelect={(v) =>
                  setSortingMode(v.toLowerCase() as EntrySortMode)
                }
                selected={toTitleCase(sortingMode)}
                options={EntrySortModes}
                inputStyling={{
                  backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 className="H5" style={{ opacity: "0.75" }}>
          {remainingEventSet.size === 0
            ? `No ${entryTypePlural.toLowerCase()} found`
            : `${
                remainingEventSet.size
              } ${entryTypePlural.toLowerCase()} found`}
        </h5>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxHeight: "80vh",
          overflowY: remainingEventSet.size != 0 ? "auto" : "hidden",
        }}
      >
        {events
          .sort((a, b) => {
            const diff =
              new Date(a.DateStart).getTime() - new Date(b.DateStart).getTime();
            if (sortingMode == "ascending") {
              return diff;
            } else {
              return -diff;
            }
          })
          .map((event, idx) => {
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
                key={event.id}
                className={`${styles["CardContainer"]} ${
                  !remainingEventSet.has(event.id) ? styles["hide"] : ""
                }`}
              >
                <EntryTile
                  imageSrc={`${process.env.NEXT_PUBLIC_STRAPI_URL}${event.PreviewImage?.url}`}
                  header={event.Name}
                  subheader={subheader}
                  subheaderTwo={event.Location}
                  description={event.DescriptionShort}
                  CallToAction={
                    <div
                      className="BodyLarge"
                      style={{ display: "flex", gap: "0.5rem" }}
                    >
                      <Button>
                        <DefaultEllipsis />
                      </Button>
                      <Button
                        href={
                          "./" +
                          entryTypePlural.toLowerCase() +
                          "/" +
                          event.UrlSlug
                        }
                      >
                        <span style={{ fontWeight: 500 }}>
                          View {entryTypeSingular}
                        </span>
                        <DefaultChevronRight
                          fontSize={"inherit"}
                          style={{ marginRight: "-0.25rem" }}
                          strokeWidth={"0.20rem"}
                        />
                      </Button>
                    </div>
                  }
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
