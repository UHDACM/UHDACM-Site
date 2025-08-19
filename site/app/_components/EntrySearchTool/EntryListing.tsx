"use client";

import Select from "@/app/_components/Select/Select";
import { useState } from "react";
import EntryTile from "../EntryTile/EntryTile";
import Button from "../Button/Button";
import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";

// TODO: Maybe migrate this to types?
const ListingModes = ["on", "after", "before"];
interface EventListingProps {
  day: number;
  month: string;
  year: string;
}

export function EventListing({ day, month, year }: EventListingProps) {
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
        <h3 className={`FontH2`} style={{ margin: 0, userSelect: "none" }}>
          Events
        </h3>
        <div style={{ width: `6.5rem` }} className="FontH4">
          <Select
            inputStyling={{
              backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
              padding: "0.5rem 0.4rem",
            }}
            selected={listingMode}
            onSelect={setListingMode}
            options={ListingModes}
          />
        </div>
        <h3
          className={`FontH2`}
          style={{
            margin: 0,
            color: "rgb(var(--color-font-secondary))",
            userSelect: "none",
          }}
        >
          {`${month} ${day}, ${year}`}
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "100%", height: "12rem" }}>
          <EntryTile
            header={"Event Name"}
            subheader={`1234 Location Place, 77498 | Room A123\nOctober 3rd, 2025 | 8:00 am - 6:00 pm`}
            description="We can talk about the event and stuff right now? You know the only thing we can really do about life is to make the most of it."
            CallToAction={
              <div className='BodyLarge' style={{display: 'flex', gap: '0.5rem'}}>
                <Button>
                  <DefaultEllipsis />
                </Button>
                <Button>
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
      </div>
    </div>
  );
}
