"use client";

import { DefaultChevronLeft, DefaultChevronRight } from "@/app/_icons/Icons";
import React, { useState } from "react";
import Select from "../Select/Select";
import { Month, Months } from "@/app/_utils/types";
import { intToMonth, toTitleCase } from "@/app/_utils/tools";
import styles from "./Calendar.module.css";

const gridColors = [
  "#FFB300",
  "#FF7043",
  "#29B6F6",
  "#66BB6A",
  "#AB47BC",
  "#EC407A",
  "#FFA726",
  "#8D6E63",
  "#789262",
  "#D4E157",
  "#FF8A65",
  "#BA68C8",
  "#4DD0E1",
  "#FFD54F",
  "#A1887F",
  "#90A4AE",
  "#AED581",
  "#FFCCBC",
  "#B39DDB",
  "#80CBC4",
  "#FFF176",
];

const startingYear = new Date().getFullYear() + 1;
const Years = Array.from({ length: 3 }, (_, i) => `${startingYear - i}`);

type CalendarProps = {
  day: number;
  setDay: React.Dispatch<React.SetStateAction<number>>;
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
};

export default function Calendar({
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
}: CalendarProps) {
  const CalendarDate = new Date(
    parseInt(year),
    Months.indexOf(month.toLowerCase() as Month),
    1
  );

  const firstDayOfWeek = CalendarDate.getDay();

  const daysInMonth = new Date(
    CalendarDate.getFullYear(),
    CalendarDate.getMonth() + 1,
    0
  ).getDate();

  function handleSetDay(newDay: number) {
    if (newDay < 1 || newDay > daysInMonth) return;
    setDay(newDay);
  }

  return (
    <div
      style={{
        background: "rgb(var(--color-neutral-800))",
        borderRadius: "0.5rem",
        padding: "1rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
          className="FontH5"
        >
          {/* Left controls */}
          <div style={{ display: "flex", gap: "0.5rem", width: "60%" }}>
            <div style={{ flex: 6 }}>
              <Select
                options={Months}
                selected={month}
                onSelect={(v) => setMonth(v)}
                placeholder="Month"
              />
            </div>
            <div style={{ flex: 4 }}>
              <Select
                options={Years}
                selected={year}
                onSelect={(v) => setYear(v)}
                placeholder="Year"
              />
            </div>
          </div>
          {/* Right chevrons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <DefaultChevronLeft
              className={`${styles["Chevron"]} ${
                day === 1 ? styles["disabled"] : ""
              }`}
              size="1.5rem"
              strokeWidth={"0.175rem"}
              onClick={() => handleSetDay(day - 1)}
            />
            <DefaultChevronRight
              className={`${styles["Chevron"]} ${
                day === daysInMonth ? styles["disabled"] : ""
              }`}
              size="1.5rem"
              strokeWidth={"0.175rem"}
              onClick={() => handleSetDay(day + 1)}
              style={{
                cursor: "pointer",
                opacity: day === daysInMonth ? 0 : 1,
                pointerEvents: day === daysInMonth ? "none" : "auto",
              }}
            />
          </div>
        </div>
      </div>
      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
          width: "100%",
        }}
        className={`BodyLarge`}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
          <div
            key={d}
            className={"FontH5"}
            style={{
              background: "transparent",
              width: "100%",
              padding: "0.5rem 0rem",
              display: "flex",
              justifyContent: "center",
              userSelect: "none",
              color:
                i == 0 || i == 6 ? "rgb(var(--color-font-accent))" : "inherit",
            }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => {
          return (
            <div
              key={`buffer${i}`}
              className={`${styles["CalendarDay"]} ${styles["buffer"]}`}
            />
          );
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div
            key={i}
            className={`${styles["CalendarDay"]} ${
              i + 1 == day ? styles["active"] : ""
            }`}
            onClick={() => setDay(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
