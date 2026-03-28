"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AnnouncementObj,
  AnnouncementColorTheme,
  CMSAnnouncementIcon,
  CMSButton,
} from "@shared/types/cms/CMSTypes";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import {
  DefaultCalendar,
  DefaultClock,
  DefaultLocation,
} from "@/app/_icons/Icons";
import { getDefaultIconForCMSButton } from "@/app/_utils/types/cms/cmsTypeToolsTsx";
import Button from "@/app/_components/Button/Button";
import styles from "./AnnouncementCarousel.module.css";

const ANIM_MS = 250;

const themeClass: Record<AnnouncementColorTheme, string> = {
  primary: styles.themePrimary,
  secondary: styles.themeSecondary,
  accent: styles.themeAccent,
  background: styles.themeBackground,
};

const INTERVAL_MS = 10000;
const INTERVAL_AFTER_CLICK_MS = 20000;

// ── Sub-components ────────────────────────────────────────────────────────────

function AnnouncementIcon({ icon }: { icon: CMSAnnouncementIcon }) {
  switch (icon) {
    case "calendar":
      return <DefaultCalendar />;
    case "clock":
      return <DefaultClock />;
    case "location-pin":
      return <DefaultLocation />;
  }
}

function AnnouncementButton({
  btn,
  filled,
  theme,
}: {
  btn: CMSButton;
  filled?: boolean;
  theme: AnnouncementColorTheme;
}) {
  const IconComp = btn.icon ? getDefaultIconForCMSButton(btn.icon) : undefined;
  return (
    <Button
      href={btn.href}
      target={btn.target}
      color={theme}
      className={filled ? undefined : "Button--Hallow"}
      shape='round'
      style={{ flex: 1, alignSelf: "stretch", fontSize: "0.85rem", display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', height: '2rem' }}
    >
      {!btn.isIconOnRightSide && IconComp && (
        <span className={styles.buttonIcon}>{IconComp}</span>
      )}
      <span className="BodyRegularHeavy" style={{lineHeight: 0}}>{btn.text}</span>
      {btn.isIconOnRightSide && IconComp && (
        <span className={styles.buttonIcon}>{IconComp}</span>
      )}
    </Button>
  );
}

function AnnouncementCard({
  announcement,
  className,
}: {
  announcement: AnnouncementObj;
  className?: string;
}) {
  const public_env = usePublicEnv();
  const imageUrl = TryGetImageFormatUrl(
    announcement.image,
    "medium",
    public_env.NEXT_PUBLIC_CMS_URL,
  );
  const theme: AnnouncementColorTheme = announcement.colorTheme ?? "primary";

  return (
    <div className={`${styles.content} ${themeClass[theme]} ${className ?? ""}`}>
      {imageUrl && (
        <div className={styles.cardImageWrapper}>
          <img
            className={styles.cardImage}
            src={imageUrl}
            alt={announcement.image.alternativeText ?? announcement.title}
          />
        </div>
      )}

      <h2 className="H2">{announcement.title}</h2>

      {announcement.subheader && announcement.subheader.length > 0 && (
        <div className={styles.metadata}>
          {announcement.subheader.map((item, i) => (
            <div key={i} className={styles.metadataItem}>
              {item.icon && (
                <span className={styles.metadataIcon}>
                  <AnnouncementIcon icon={item.icon} />
                </span>
              )}
              <span className="BodyRegular" style={{lineHeight: 0}}>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {announcement.badge && (
        <div className={styles.badges}>
          {announcement.badge.split("\n").map((b, i) => (
            <span key={i} className={`${styles.badge} BodyRegular`}>
              {b.trim()}
            </span>
          ))}
        </div>
      )}

      {announcement.body && (
        <p className={`BodyLarge ${styles.body}`}>{announcement.body}</p>
      )}

      {announcement.buttons.length > 0 && (
        <div className={styles.buttons}>
          {announcement.buttons.map((btn, i) => (
            <AnnouncementButton key={i} btn={btn} filled={i === 0} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function NavTab({
  label,
  isActive,
  theme,
  intervalMs,
  onClick,
  showProgress,
}: {
  label: string;
  isActive: boolean;
  theme: AnnouncementColorTheme;
  intervalMs: number;
  onClick: () => void;
  showProgress: boolean;
}) {
  return (
    <button
      className={`${styles.navTab} ${themeClass[theme]} ${isActive ? styles.navTabActive : ""} BodyLarge`}
      onClick={onClick}
    >
      <span className={styles.navTabLabel}>{label}</span>
      <div className={styles.progressTrack}>
        {isActive && showProgress && (
          <div
            key={label + "-progress"}
            className={styles.progressBar}
            style={{ animationDuration: `${intervalMs}ms` }}
          />
        )}
      </div>
    </button>
  );
}

// ── Main carousel ─────────────────────────────────────────────────────────────

interface AnnouncementCarouselProps {
  announcements: AnnouncementObj[];
}

export default function AnnouncementCarousel({
  announcements,
}: AnnouncementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shownIndex, setShownIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const [timerKey, setTimerKey] = useState(0);
  const [activeIntervalMs, setActiveIntervalMs] = useState(INTERVAL_MS);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"idle" | "exit" | "enter">("idle");
  const pendingRef = useRef(0);
  const currentIndexRef = useRef(0);
  const intervalMsRef = useRef(INTERVAL_MS);
  const goToRef = useRef<(index: number) => void>(() => {});

  const goTo = useCallback((index: number, fromClick = false) => {
    if (phaseRef.current !== "idle") return;
    if (fromClick) intervalMsRef.current = INTERVAL_AFTER_CLICK_MS;
    phaseRef.current = "exit";
    pendingRef.current = index;
    currentIndexRef.current = index;
    setCurrentIndex(index);
    setTimerKey((k) => k + 1);
    setPhase("exit");
  }, []);

  goToRef.current = goTo;

  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => {
      setShownIndex(pendingRef.current);
      phaseRef.current = "enter";
      setPhase("enter");
    }, ANIM_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "enter") return;
    const t = setTimeout(() => {
      phaseRef.current = "idle";
      setPhase("idle");
    }, ANIM_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasEnteredView) return;
    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px 0px -50px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (announcements.length <= 1) return;
    if (!hasEnteredView) return;
    const delay = intervalMsRef.current;
    intervalMsRef.current = INTERVAL_MS;
    setActiveIntervalMs(delay);
    const timer = setInterval(() => {
      const next = (currentIndexRef.current + 1) % announcements.length;
      goToRef.current(next);
    }, delay);
    return () => clearInterval(timer);
  }, [timerKey, announcements.length, hasEnteredView]);

  if (!announcements.length) return null;

  const containerTheme: AnnouncementColorTheme =
    announcements[shownIndex].colorTheme ?? "primary";

  const cardAnimClass =
    phase === "exit"
      ? styles.cardExit
      : phase === "enter"
        ? styles.cardEnter
        : "";

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${themeClass[containerTheme]}`}
    >
      <AnnouncementCard
        announcement={announcements[shownIndex]}
        className={cardAnimClass}
      />

      {announcements.length > 1 && (
        <div className={styles.nav}>
          {announcements.map((ann, i) => (
            <NavTab
              key={i}
              label={ann.title}
              isActive={i === currentIndex}
              theme={ann.colorTheme ?? "primary"}
              intervalMs={activeIntervalMs}
              onClick={() => goTo(i, true)}
              showProgress={hasEnteredView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
