"use client";

import { useEffect, useRef, useState } from "react";
import { LuHeart, LuTarget, LuCode, LuUsersRound, LuUsers, LuCalendar, LuClock } from "react-icons/lu";
import styles from "./CardSection.module.css";
import { CardSectionItem, SiteSectionCardSection } from "@shared/types/cms/CMSTypes";
import { extractRichText } from "../SplitHeroSection/HeroTextBlock/HeroTextBlock";

const icons = {
  heart: LuHeart,
  target: LuTarget,
  code: LuCode,
  users: LuUsersRound,
  people: LuUsers,
  calendar: LuCalendar,
  clock: LuClock,
};

function CardItem({
  icon, title, subtitle, href, rotation, index, colorVariant,
}: CardSectionItem & { rotation: number; index: number; colorVariant: "primary" | "secondary" }) {
  const Icon = icons[icon];
  const translateY = 5*Math.abs(rotation); // outer cards (-5°/+5°) → -5px; inner cards (0°) → 0px
  const style = {
    "--rotation": `${rotation}deg`,
    "--translate-y": `${translateY}px`,
    "--card-index": index,
  } as React.CSSProperties;

  const colorClass = colorVariant === "primary" ? styles.cardPrimary : styles.cardSecondary;

  const inner = (
    <>
      <div className={`${styles.iconBox} ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className={styles.cardContent}>
        <span className={`${styles.cardTitle} H4`}>{extractRichText(title, "H4")}</span>
        <span className={`${styles.cardSubtitle} BodyRegular`}>{extractRichText(subtitle, "BodyRegular")}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${styles.card} ${colorClass}`} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <div className={`${styles.card} ${colorClass}`} style={style}>
      {inner}
    </div>
  );
}

type CardSectionProps = Omit<SiteSectionCardSection, "__component" | "id">;

export default function CardSection({ title, subtitle, cards, sectionID }: CardSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [wideGrid, setWideGrid] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setWideGrid(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-300px' },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rotation = (i: number) =>
    wideGrid && cards.length > 1 ? -10 + (20 * i) / (cards.length - 1) : 0;

  const showScroll = cards.length > 1;

  return (
    <div className="SectionRoot" style={{margin: '4rem 0'}} id={sectionID} ref={sectionRef}>
      <div className="SectionInner">
        <div className={styles.header}>
          <div className="H2" style={{ textAlign: "center" }}>
            {extractRichText(title, "H2")}
          </div>
          {subtitle && (
            <div className={`SubtitleRegular ${styles.subtitle}`}>
              {extractRichText(subtitle, "SubtitleRegular")}
            </div>
          )}
        </div>

        {/* Desktop / tablet grid */}
        <div className={`${styles.cardsGrid} ${inView ? "" : styles.hidden}`}>
          {cards.map((card, i) => (
            <CardItem
              key={i}
              {...card}
              rotation={rotation(i)}
              index={i}
              colorVariant={i % 2 === 0 ? "primary" : "secondary"}
            />
          ))}
        </div>

        {/* Mobile manual scroll */}
        {showScroll && (
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollTrack}>
              {cards.map((card, i) => (
                <CardItem
                  key={i}
                  {...card}
                  rotation={0}
                  index={0}
                  colorVariant={i % 2 === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
