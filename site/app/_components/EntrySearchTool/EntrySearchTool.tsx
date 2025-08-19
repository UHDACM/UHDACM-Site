"use client";
import { SearchBar } from "@/app/_components/SearchBar/SearchBar";
import Calendar from "@/app/_components/Calendar/Calendar";
import { EventListing } from "./EntryListing";
import { useState } from "react";
import { intToMonth, toTitleCase } from "@/app/_utils/tools";

export default function EntrySearchTool() {
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState<string>(
    toTitleCase(intToMonth(now.getMonth()) || "january")
  );
  const [year, setYear] = useState<string>(`${now.getFullYear()}`);

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        padding: "12rem 0",
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
          <SearchBar />
          <Calendar
            day={day}
            month={month}
            year={year}
            setDay={setDay}
            setMonth={setMonth}
            setYear={setYear}
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
          paddingRight: '3rem',
          boxSizing: 'border-box'
        }}
      >
        <EventListing day={day} month={month} year={year} />
      </div>
    </div>
  );
}
