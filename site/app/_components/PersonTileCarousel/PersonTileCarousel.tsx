"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Person } from "@shared/types/cms/CMSTypes";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import {
  DefaultChevronLeft,
  DefaultChevronRight,
} from "@/app/_icons/Icons";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import styles from "./PersonTileCarousel.module.css";
import Transition from "../Transition/Transition";
import PersonTile, {
  PersonTileExpanded,
  PersonTilePreview,
  PersonTileSocial,
} from "../PersonTile/PersonTile";

type PersonTileCarouselProps = {
  people: Person[];
  cmsBaseUrl?: string;
};

function getPersonImage(person: Person, cmsBaseUrl?: string): string {
  if (!person.picture) return "";
  return TryGetImageFormatUrl(person.picture, "medium", cmsBaseUrl ?? "") ?? "";
}

function getPersonSocials(person: Person): PersonTileSocial[] {
  return person.socials.map((social) => ({
    icon: social.type,
    href: social.url,
  }));
}

export default function PersonTileCarousel({
  people,
  cmsBaseUrl,
}: PersonTileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Holds the last opened index so the overlay keeps rendering its content
  // while it fades out (activeIndex becomes null the moment we close).
  const [displayIndex, setDisplayIndex] = useState(0);
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (activeIndex !== null) setDisplayIndex(activeIndex);
  }, [activeIndex]);

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

  const active = people[displayIndex];

  return (
    <>
      <div className={styles.grid}>
        {people.map((person, i) => (
          <PersonTilePreview
            key={i}
            img={getPersonImage(person, cmsBaseUrl)}
            title={person.nameShort}
            subtitle={person.roleShort}
            ariaLabel={`Open ${person.nameShort || person.name}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <Transition
        type="fade"
        toggle={isOpen}
        transitionSpeedMS={250}
        forceStyle={{ position: "fixed", inset: 0, zIndex: 1000 }}
      >
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
                const isActive = i === displayIndex;
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
      </Transition>
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

  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <Transition
      type="wipe"
      direction="right"
      transitionSpeedMS={500}
      easing="inOutQuart"
      toggle={active}
      hideOnToggleOff={false}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <PersonTileExpanded
          title={person.name}
          subtitle={person.role}
          description={person.description}
          img={img}
          socials={getPersonSocials(person)}
          onClose={handleClose}
        />
      </div>
    </Transition>
  );
}

// Keep PersonTile imported so consumers re-exporting from here stay valid.
export { PersonTile };
