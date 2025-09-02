"use client";
import styles from "./AddToCalendarButton.module.css";

import {
  DefaultCalendar,
  DefaultGoogleCalendar,
  DefaultOutlook,
} from "@/app/_icons/Icons";
import Button from "../Button";
import { useState } from "react";
import { buildICS, CalendarLinkGoogle, CalendarLinkOutlook, CalendarPayload, downloadICS } from "@/app/_utils/tools";

type CalendarOption = "Google" | "Outlook" | "Apple" | "Other";


interface AddToCalendarButtonProps extends CalendarPayload {
  menuLeft?: boolean
};
export default function AddToCalendarButton(AddToCalendarProps: AddToCalendarButtonProps) {
  const [active, setActive] = useState<boolean>(false);

  const date = new Date(AddToCalendarProps.start);
  if (isNaN(date.getTime())) {
    return null;
  }

  const handleAddToCalendar = (calendar: CalendarOption) => {
    setActive(false);
    if (calendar === "Google") {
      const link = CalendarLinkGoogle(AddToCalendarProps);
      if (!link) {
      return;
      }
      window.open(link, "_blank");
    } else if (calendar == "Other") {
      downloadICS(buildICS(AddToCalendarProps), `Event: ${AddToCalendarProps.title}.ics`);
    }
    // else if (calendar === "Outlook") {
    //   const link = CalendarLinkOutlook(AddToCalendarProps);
    //   if (!link) {
    //   return;
    //   }
    //   window.open(link, "_blank");
    // } 
    // else if (calendar === "Apple") {
    //   // Add Apple Calendar integration
    // }
  };

  const leftMenu = AddToCalendarProps.menuLeft;

  return (
    <div
      style={{ display: "flex", position: "relative" }}
      // onBlur={() => setActive(false)}
    >
      <Button
        className={`${active ? "Button--Hallow" : ""}`}
        style={{ position: "relative" }}
        onClick={() => setActive(!active)}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            fontWeight: 800,
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {active ? "Select" : "Add"}
          </span>
          {!active && (
            <DefaultCalendar fontSize={"inherit"} strokeWidth={"0.15rem"} />
          )}
        </div>
      </Button>
      {active && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            translate: "0 110%",
            left: !leftMenu ? 0 : 'none',
            right: leftMenu ? 0 : 'none',
            borderRadius: "0.5rem",
            border: "1px solid rgb(var(--color-font-secondary))",
            zIndex: 1,
            overflow: "hidden",
          }}
          className="BodyLargeHeavy"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.CalendarOption}
            onClick={() => handleAddToCalendar("Google")}
          >
            <DefaultGoogleCalendar size={"1rem"} />{" "}
            <span
              style={{ textWrap: "nowrap", backgroundColor: "transparent" }}
            >
              Google Calendar
            </span>
          </div>
          <div className={styles.CalendarOption}
            onClick={() => handleAddToCalendar("Other")}
          >
            <DefaultCalendar size={"1rem"} />{" "}
            <span
              style={{ textWrap: "nowrap", backgroundColor: "transparent" }}
            >
              Other
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
