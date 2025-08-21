"use client";
import { SearchBar } from "@/app/_components/SearchBar/SearchBar";
import Calendar from "@/app/_components/Calendar/Calendar";
import { EntrySortMode, EventListing } from "./EntryListing";
import { useEffect, useState } from "react";
import { intToMonth, toTitleCase } from "@/app/_utils/tools";
import { ListingMode, SiteEvent } from "@/app/_utils/types";
import { DefaultClose } from "@/app/_icons/Icons";
import { useDispatch } from "react-redux";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";

export default function EntrySearchTool({
  entryTypePlural,
  entryTypeSingular,
  events,
  defaultListingMode,
  defaultSortingMode,
}: {
  entryTypePlural: string;
  entryTypeSingular: string;
  events: SiteEvent[];
  defaultListingMode: ListingMode;
  defaultSortingMode?: EntrySortMode;
}) {
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState<string>(
    toTitleCase(intToMonth(now.getMonth()) || "january")
  );
  const [year, setYear] = useState<string>(`${now.getFullYear()}`);
  const [search, setSearch] = useState("");
  const [calendarActive, setCalendarActive] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 992 : false
  );

  const handleSetCalendarActive = (state: boolean) => {
    setCalendarActive(state);
    if (!state) {
      enableOverflowY();
    } else {
      disableOverflowY();
    }
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 992) {
        setIsMobile(true);
        setSearch(""); // no search on mobile
      } else {
        setIsMobile(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      dotsOnDates={events.map((e) => new Date(e.DateStart))}
    />
  );

  const EventListingComp = (
    <EventListing
      events={events}
      day={day}
      month={month}
      year={year}
      entryTypePlural={entryTypePlural}
      entryTypeSingular={entryTypeSingular}
      search={search}
      defaultListingMode={defaultListingMode}
      defaultSortingMode={defaultSortingMode}
      onDatePress={() => setCalendarActive(true)}
    />
  );

  if (isMobile) {
    return (
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
        {EventListingComp}
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
                gap: '0.5rem'
              }}
            >
              <span className="H3">Select A Date</span>
              {CalendarComp}
            </div>
            <DefaultClose
              style={{ position: "absolute", top: "1rem", right: "1rem" }}
              color={"rgb(var(--color-font-default))"}
              size={"2.5rem"}
              onClick={() => setCalendarActive(false)}
            />
          </div>
        )}
      </div>
    );
  } else {
    return (
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
          {EventListingComp}
        </div>
      </div>
    );
  }
}
