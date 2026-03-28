"use client";

import React, { useState } from "react";
import FilterTab, { FilterTabColor, FilterTabOption } from "../_components/FilterTab/FilterTab";

const options: FilterTabOption[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "Archived", value: "archived" },
];

const themes: FilterTabColor[] = ["primary", "secondary", "accent", "neutral"];

export default function FilterTabDemo() {
  const [primaryVal, setPrimaryVal] = useState("all");
  const [secondaryVal, setSecondaryVal] = useState("upcoming");
  const [accentVal, setAccentVal] = useState("past");
  const [neutralVal, setNeutralVal] = useState("archived");
  const [compactVal, setCompactVal] = useState("upcoming");

  const values: Record<FilterTabColor, [string, (v: string) => void]> = {
    primary: [primaryVal, setPrimaryVal],
    secondary: [secondaryVal, setSecondaryVal],
    accent: [accentVal, setAccentVal],
    neutral: [neutralVal, setNeutralVal],
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "flex-start",
        padding: "2rem 0",
      }}
    >
      <h2 className="H3">FilterTab — tab row</h2>
      {themes.map((theme) => {
        const [val, setVal] = values[theme];
        return (
          <div
            key={theme}
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <span className="BodyRegular" style={{ minWidth: "6rem" }}>
              {theme}
            </span>
            <FilterTab
              options={options}
              value={val}
              onChange={setVal}
              color={theme}
            />
          </div>
        );
      })}

      <h2 className="H3" style={{ marginTop: "1.5rem" }}>
        FilterTab — compact (dropdown)
      </h2>
      {themes.map((theme) => (
        <div
          key={`compact-${theme}`}
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <span className="BodyRegular" style={{ minWidth: "6rem" }}>
            {theme}
          </span>
          <FilterTab
            options={options}
            value={compactVal}
            onChange={setCompactVal}
            color={theme}
            compact
          />
        </div>
      ))}
    </div>
  );
}
