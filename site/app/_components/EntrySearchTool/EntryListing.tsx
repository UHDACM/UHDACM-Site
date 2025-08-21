"use client";

import Select from "@/app/_components/Select/Select";
import { useState } from "react";
import EntryTile from "../EntryTile/EntryTile";
import Button from "../Button/Button";
import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
import { SiteEvent } from "@/app/_utils/types";

// TODO: Maybe migrate this to types?
const ListingModes = ["on", "after", "before"];
interface EventListingProps {
  day: number;
  month: string;
  year: string;
  entryName: string;
  events: SiteEvent[];
}

export function EventListing({ day, month, year, entryName, events }: EventListingProps) {
  const [listingMode, setListingMode] = useState("After");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <h3 className={`H2`} style={{ margin: 0, userSelect: "none" }}>
          {entryName}
        </h3>
        <div style={{ width: `7.5rem` }} className="H4">
          <Select
            inputStyling={{
              backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
            }}
            selected={listingMode}
            onSelect={setListingMode}
            options={ListingModes}
          />
        </div>
        <h3
          className={`H2`}
          style={{
            margin: 0,
            color: "rgb(var(--color-font-secondary))",
            userSelect: "none",
          }}
        >
          {`${month} ${day}, ${year}`}
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: '80vh', overflowY: 'auto' }}>
        {events.filter(event => {
            const eventDate = new Date(event.DateStart);
            const selectedDate = new Date(`${year}-${month}-${day}`);
            if (listingMode.toLowerCase() === "on") {
            return (
              eventDate.getFullYear() === selectedDate.getFullYear() &&
              eventDate.getMonth() === selectedDate.getMonth() &&
              eventDate.getDate() === selectedDate.getDate()
            );
            } else if (listingMode.toLowerCase() === "before") {
            return eventDate < selectedDate;
            } else {
            // "after"
            return eventDate > selectedDate;
            }
        }).sort((a, b) => new Date(a.DateStart).getTime() - new Date(b.DateStart).getTime()).map((event, idx) => {
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
            subheader = `${formatDate(dateStart)}, ${formatTime(dateStart)} - ${formatTime(dateEnd)}`;
          } else {
            subheader = `${formatDate(dateStart)}, ${formatTime(dateStart)}`;
          }

          return (
            <div key={event.UrlSlug || idx} style={{ width: "100%", height: "13rem" }}>
              <EntryTile
                imageSrc={`${process.env.NEXT_PUBLIC_STRAPI_URL}${event.PreviewImage?.url}`}
                header={event.Name}
                subheader={subheader}
                subheaderTwo={event.Location}
                description={event.DescriptionShort}
                CallToAction={
                  <div className='BodyLarge' style={{display: 'flex', gap: '0.5rem'}}>
                    <Button>
                      <DefaultEllipsis />
                    </Button>
                    <Button href={'./events/'+event.UrlSlug}>
                      <span style={{ fontWeight: 500 }}>View Event</span>
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
