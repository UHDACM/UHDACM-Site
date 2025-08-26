"use client";
import { SearchBar } from "@/app/_components/SearchBar/SearchBar";
import Calendar from "@/app/_components/Calendar/Calendar";
import { useState } from "react";
import { getTodayYMD, intToMonth, toTitleCase } from "@/app/_utils/tools";
import { EntrySortMode, ListingMode, SiteEvent } from "@/app/_utils/types";
import { DefaultClose } from "@/app/_icons/Icons";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import { EntryTileProps } from "../EntryTile/EntryTile";
import { EntryListing } from "./EntryListing";

import styles from "./EntryListing.module.css";

export default function EntrySearchTool({
  entryTypePlural,
  entryTypeSingular,
  entries,
  defaultListingMode,
  defaultSortingMode,
}: {
  entryTypePlural: string;
  entryTypeSingular: string;
  entries: EntryTileProps[];
  defaultListingMode: ListingMode;
  defaultSortingMode?: EntrySortMode;
}) {
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();
  const [nowYear, nowMonth, nowDay] = getTodayYMD();
  const [day, setDay] = useState(nowDay);
  const [month, setMonth] = useState<string>(
    toTitleCase(intToMonth(nowMonth) || "january")
  );
  const [year, setYear] = useState<string>(`${nowYear}`);
  const [search, setSearch] = useState("");
  const [calendarActive, setCalendarActive] = useState(false);

  const handleSetCalendarActive = (state: boolean) => {
    setCalendarActive(state);
    if (!state) {
      enableOverflowY();
    } else {
      disableOverflowY();
    }
  };

  const SearchBarComp = (
    <SearchBar inputValue={search} onInputValueChange={(v) => setSearch(v)} />
  );

  const CalendarComp = (
    <Calendar
      day={day}
      month={month}
      year={year}
      setDay={setDay}
      setMonth={setMonth}
      setYear={setYear}
      dotsOnDates={entries.filter((e) => e.date).map((e) => new Date(e.date!))}
    />
  );

  const EntryListingComp = (
    <EntryListing
      entries={entries}
      day={day}
      month={month}
      year={year}
      entryTypePlural={entryTypePlural}
      entryTypeSingular={entryTypeSingular}
      search={search}
      defaultListingMode={defaultListingMode}
      defaultSortingMode={defaultSortingMode}
      onDatePress={() => handleSetCalendarActive(true)}
    />
  );

  return (
    <>
      <div style={{ width: "100%" }} className={styles.hideOnDesktop}>
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1rem",
            boxSizing: "border-box",
          }}
        >
          {EntryListingComp}
          {calendarActive && (
            <div
              style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                backgroundColor: "rgba(var(--color-neutral-1000), 0.75)",
                top: 0,
                left: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "95vw",
                  maxWidth: "25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span className="H3">Select A Date</span>
                {CalendarComp}
              </div>
              <DefaultClose
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
                color={"rgb(var(--color-font-default))"}
                size={"2.5rem"}
                onClick={() => handleSetCalendarActive(false)}
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ width: "100%" }} className={styles.hideOnMobile}>
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1rem",
            boxSizing: "border-box",
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
                // maxWidth: "25rem",
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {SearchBarComp}
              {CalendarComp}
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
            }}
          >
            {EntryListingComp}
          </div>
        </div>
      </div>
    </>
  );
}
