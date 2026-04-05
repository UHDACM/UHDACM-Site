"use client";

import { useRef, useEffect, useState } from "react";
import { SiteSectionVerticalTimeline, VerticalTimelineEntry } from "@shared/types/cms/CMSTypes";
import { extractRichText } from "../SplitHeroSection/HeroTextBlock/HeroTextBlock";
import { LuExternalLink, LuLink } from "react-icons/lu";
import Link from "next/link";
import styles from "./VerticalTimelineSection.module.css";

function isRelativeUrl(url: string): boolean {
  return !url.includes("://") && !url.startsWith("//");
}

type Props = Omit<SiteSectionVerticalTimeline, "__component" | "id">;

function TimelineEntry({ entry, index }: { entry: VerticalTimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const isLeft = index % 2 === 0;
  const isRelative = entry.href ? isRelativeUrl(entry.href) : false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsActive(true);
        } else {
          const rootTop = e.rootBounds?.top ?? 0;
          setIsActive(e.boundingClientRect.top < rootTop);
        }
      },
      { rootMargin: "-50% 0px -30% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardClass = `${styles.card} ${entry.href ? styles.cardLinked : ""} ${isActive ? styles.cardActive : ""}`;
  const cardContent = (
    <>
      <span className={`BodyRegular ${styles.entryDate}`}>{entry.date}</span>
      <div className={`H5 ${styles.entryTitle}`}>{extractRichText(entry.title, "H5")}</div>
      <div className={`BodyRegular ${styles.entrySubtitle}`}>{extractRichText(entry.subtitle, "BodyRegular")}</div>
      {entry.description && (
        <div className={styles.expandable}>
          <div className={styles.separator} />
          <p className={`BodyRegular ${styles.entryDescription}`}>{extractRichText(entry.description, "BodyRegular")}</p>
        </div>
      )}
      {entry.href && (
        <span className={`${styles.linkIndicator} ${isRelative ? styles.linkIndicatorInternal : ""}`}>
          {isRelative ? <LuLink size={13} /> : <LuExternalLink size={13} />}
        </span>
      )}
    </>
  );

  const card = entry.href ? (
    isRelative ? (
      <Link href={entry.href} className={cardClass}>
        {cardContent}
      </Link>
    ) : (
      <a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {cardContent}
      </a>
    )
  ) : (
    <div className={cardClass}>{cardContent}</div>
  );

  return (
    <div ref={ref} className={`${styles.entry} ${isLeft ? styles.entryLeft : styles.entryRight}`}>
      <div className={styles.leftSlot}>{isLeft ? card : null}</div>
      <div className={styles.circleWrapper}>
        <div className={styles.circle} />
      </div>
      <div className={styles.rightSlot}>{!isLeft ? card : null}</div>
    </div>
  );
}

export default function VerticalTimelineSection({ sectionID, title, subtitle, entries }: Props) {
  return (
    <div className="SectionRoot" style={{ margin: "4rem 0" }} id={sectionID}>
      <div className="SectionInner">
        <div className={styles.header}>
          <div className="H2" style={{ textAlign: "center" }}>
            {extractRichText(title, "H2")}
          </div>
          {subtitle && (
            <div className={`SubtitleRegular ${styles.headerSubtitle}`}>{extractRichText(subtitle, "SubtitleRegular")}</div>
          )}
        </div>
        <div className={styles.timeline}>
          {entries.map((entry, i) => (
            <TimelineEntry key={i} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
