"use client";

import {
  HTMLAttributeAnchorTarget,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Person, SocialSite, SocialObj } from "@shared/types/cms/CMSTypes";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import {
  DefaultChevronLeft,
  DefaultChevronRight,
  DefaultClose,
  DefaultFacebook,
  DefaultGithub,
  DefaultGlobe,
  DefaultLinkedin,
  DefaultInstagram,
  DefaultTwitter,
  DefaultYoutube,
  DefaultDiscord,
} from "@/app/_icons/Icons";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import IndicateScrollableDiv from "../IndicateScrollableDiv/IndicateScrollableDiv";
import styles from "./PersonTileCarousel.module.css";
import Transition from "../Transition/Transition";

const iconMap: Record<SocialSite, React.ElementType> = {
  personal_site: DefaultGlobe,
  facebook: DefaultFacebook,
  instagram: DefaultInstagram,
  linkedin: DefaultLinkedin,
  x: DefaultTwitter,
  github: DefaultGithub,
  youtube: DefaultYoutube,
  discord: DefaultDiscord,
};

const socialIconStyle: React.CSSProperties = {
  margin: 0,
  padding: 3,
  borderRadius: 10,
  cursor: "pointer",
  color: "rgb(var(--color-font-default))",
};

type PersonTileCarouselProps = {
  people: Person[];
  cmsBaseUrl?: string;
};

function getPersonImage(person: Person, cmsBaseUrl?: string): string {
  if (!person.picture) return "";
  return TryGetImageFormatUrl(person.picture, "medium", cmsBaseUrl ?? "") ?? "";
}

export default function PersonTileCarousel({
  people,
  cmsBaseUrl,
}: PersonTileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isOpen = activeIndex !== null;

  const goPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + people.length) % people.length,
    );
  }, [people.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % people.length));
  }, [people.length]);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (isOpen) {
      disableOverflowY();
    } else {
      enableOverflowY();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, goPrev, goNext, close]);

  useEffect(() => {
    if (activeIndex === null) return;
    const el = thumbRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  if (!people.length) return null;

  const active = activeIndex !== null ? people[activeIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {people.map((person, i) => {
          const img = getPersonImage(person, cmsBaseUrl);
          return (
            <button
              key={i}
              type="button"
              className={styles.previewTile}
              onClick={() => setActiveIndex(i)}
              aria-label={`Open ${person.nameShort || person.name}`}
            >
              <div className={styles.previewTextBox}>
                <p className="BodyLargeHeavy">{person.nameShort || "Title"}</p>
                <p className="BodySmall">{person.roleShort || "Subtitle"}</p>
              </div>
              <div className={styles.previewOverlay} />
              {img && (
                <img
                  src={img}
                  alt={person.nameShort || person.name}
                  style={{ objectFit: "cover" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {isOpen && active && (
        <div
          className={styles.lightboxBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className={styles.lightboxRow}>
            {people.length > 1 && (
              <button
                type="button"
                className={styles.chevronBtn}
                onClick={goPrev}
                aria-label="Previous person"
              >
                <DefaultChevronLeft size={"1.5rem"} />
              </button>
            )}

            <ExpandedCard
              person={active}
              img={getPersonImage(active, cmsBaseUrl)}
              onClose={close}
            />

            {people.length > 1 && (
              <button
                type="button"
                className={styles.chevronBtn}
                onClick={goNext}
                aria-label="Next person"
              >
                <DefaultChevronRight size={"1.5rem"} />
              </button>
            )}
          </div>

          {people.length > 1 && (
            <div
              className={styles.strip}
              role="tablist"
              aria-label="People"
              onClick={(e) => e.stopPropagation()}
            >
              {people.map((person, i) => {
                const img = getPersonImage(person, cmsBaseUrl);
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    className={`${styles.thumb} ${isActive ? styles.thumbActive : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={person.nameShort || person.name}
                    aria-selected={isActive}
                    role="tab"
                  >
                    {img && (
                      <img src={img} alt={person.nameShort || person.name} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function ExpandedCard({
  person,
  img,
  onClose,
}: {
  person: Person;
  img: string;
  onClose: () => void;
}) {
  const [active, setActive] = useState(false);
  function handleSocialClick(
    href?: string,
    target?: HTMLAttributeAnchorTarget,
  ) {
    if (href) window.open(href, target || "_blank");
  }
  
  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 800);
  }

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <Transition type='wipe' direction='right' transitionSpeedMS={500} easing='inOutQuart' toggle={active} hideOnToggleOff={false}>
      <div className={styles.expandedCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.expandedImg}>
          {img && (
            <img src={img} alt={person.name} style={{ objectFit: "cover" }} />
          )}
        </div>
        <div className={styles.expandedDescriptionCard}>
          <div className={styles.expandedDescription}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
              }}
            >
              <p className={`${styles.expandedTitle} H3`}>
                {person.name || "Title"}
              </p>
              <p className={`${styles.expandedSubtitle} H5`}>
                {person.role || "Subtitle"}
              </p>
            </div>
            <IndicateScrollableDiv
              className={`${styles.expandedFullDescription} BodyLarge`}
            >
              {person.description || "Description"}
            </IndicateScrollableDiv>
          </div>
          <div className={styles.iconRow}>
            {person.socials.map((social: SocialObj, index) => {
              const IconComponent = iconMap[social.type];
              if (!IconComponent) return null;
              return (
                <IconComponent
                  key={`social_${index}`}
                  size={"2rem"}
                  style={socialIconStyle}
                  onClick={() => handleSocialClick(social.url)}
                />
              );
            })}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close"
          >
            <DefaultClose size={"2rem"} />
          </button>
        </div>
      </div>
    </Transition>
  );
}
