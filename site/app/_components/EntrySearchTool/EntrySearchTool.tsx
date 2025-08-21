"use client";
import { SearchBar } from "@/app/_components/SearchBar/SearchBar";
import Calendar from "@/app/_components/Calendar/Calendar";
import { EventListing } from "./EntryListing";
import { useState } from "react";
import { intToMonth, toTitleCase } from "@/app/_utils/tools";
import { SiteEvent } from "@/app/_utils/types";

export default function EntrySearchTool({ entryName, events }: { entryName: string, events: SiteEvent[] }) {
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState<string>(
    toTitleCase(intToMonth(now.getMonth()) || "january")
  );
  const [year, setYear] = useState<string>(`${now.getFullYear()}`);
  const [search, setSearch] = useState('');

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        padding: "0rem 1rem",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div
        style={{
          width: "95vw",
          maxWidth: "var(--page-max-width)",
          height: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "25rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <SearchBar
              inputValue={search}
              onInputValueChange={(v) => setSearch(v)}
            />
            <Calendar
              day={day}
              month={month}
              year={year}
              setDay={setDay}
              setMonth={setMonth}
              setYear={setYear}
              dotsOnDates={events.map((e)  => new Date(e.DateStart))}
            />
          </div>
        </div>
        <div
          style={{
            flex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            boxSizing: "border-box",
            paddingRight: "1rem",
          }}
        >
          <EventListing events={events} day={day} month={month} year={year} entryName={entryName} />
        </div>
      </div>
    </div>
  );
}
