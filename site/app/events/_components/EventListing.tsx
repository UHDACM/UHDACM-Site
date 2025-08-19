'use client'

import Select from "@/app/_components/Select/Select";
import { useState } from "react";

const ListingModes = ["on", "after", "before"];
interface EventListingProps {
  day: number;
  month: string;
  year: string;
}

export function EventListing({ day, month, year }: EventListingProps) {
  const [listingMode, setListingMode] = useState("after");
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <h3 className={`FontH2`} style={{ margin: 0, userSelect: 'none' }}>
        Events
      </h3>
      <div style={{width: `${5+listingMode.length*0.2}rem`}} className='FontH4'>
        <Select inputStyling={{ backgroundColor: 'rgba(var(--color-neutral-1000), 0.5)', padding: '0.5rem 0.4rem' }} selected={listingMode} onSelect={setListingMode} options={ListingModes} />
      </div>
      <h3
        className={`FontH2`}
        style={{ margin: 0, color: "rgb(var(--color-font-secondary))", userSelect: 'none' }}
      >
        {`${month} ${day}, ${year}`}
      </h3>
    </div>
  );
}