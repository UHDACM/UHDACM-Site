"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuArrowRight,
  LuCalendar,
  LuClock,
  LuCode,
  LuHeart,
  LuImage,
  LuImages,
  LuMapPin,
  LuTarget,
  LuUsers,
  LuUsersRound,
} from "react-icons/lu";
import styles from "./SearchTileV2.module.css";

export type SearchTileMetaIcon =
  | "calendar"
  | "clock"
  | "location-pin"
  | "users"
  | "people"
  | "target"
  | "code"
  | "heart";

export type SearchTileMetaColor =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral";

export type SearchTileMeta = {
  icon: SearchTileMetaIcon;
  color?: SearchTileMetaColor;
  text: string;
};

const META_ICONS: Record<
  SearchTileMetaIcon,
  React.ComponentType<{ size?: number | string; className?: string }>
> = {
  calendar: LuCalendar,
  clock: LuClock,
  "location-pin": LuMapPin,
  users: LuUsersRound,
  people: LuUsers,
  target: LuTarget,
  code: LuCode,
  heart: LuHeart,
};

function metaIconColor(color?: SearchTileMetaColor) {
  switch (color) {
    case "secondary":
      return "rgb(var(--color-secondary-500))";
    case "accent":
      return "rgb(var(--color-accent-500))";
    case "neutral":
      return "rgb(var(--color-neutral-300))";
    case "primary":
    default:
      return "rgb(var(--color-primary-500))";
  }
}

export type SearchTileV2Props = {
  compact?: boolean;
  image?: { src?: string; alt?: string };
  title: string;
  subtitle?: string;
  meta?: SearchTileMeta[];
  href: string;
  entryTypeLabel?: string;
  hasGallery?: boolean;
  isUpcoming?: boolean;
  upcomingLabel?: string;
};

function isRelativeHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

const SearchTileV2: React.FC<SearchTileV2Props> = ({
  compact,
  image,
  title,
  subtitle,
  meta,
  href,
  entryTypeLabel,
  hasGallery,
  isUpcoming,
  upcomingLabel,
}) => {
  const router = useRouter();
  const internal = isRelativeHref(href);

  const rootClass = `${styles.tile} ${compact ? styles.compact : ""}`;

  const galleryHref = href.includes("#")
    ? href.replace(/#.*$/, "#gallery")
    : `${href}#gallery`;

  const handleGalleryClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (internal) {
      router.push(galleryHref);
    } else {
      window.open(galleryHref, "_blank", "noopener,noreferrer");
    }
  };

  const content = (
    <>
      <div className={styles.imageWrap}>
        {image?.src ? (
          <img
            src={image.src}
            alt={image.alt ?? title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <LuImage size={40} />
          </div>
        )}
        {hasGallery && (
          <button
            type="button"
            className={styles.galleryBadge}
            onClick={handleGalleryClick}
            aria-label="View gallery"
            title="View gallery"
          >
            <LuImages size={15} />
            <span className={`BodySmall ${styles.galleryBadgeText}`}>
              Gallery
            </span>
          </button>
        )}
        {isUpcoming && upcomingLabel && (
          <div
            className={styles.upcomingBadge}
            aria-label={`Upcoming: ${upcomingLabel}`}
          >
            <LuCalendar size={14} />
            <span className={`BodySmall ${styles.upcomingBadgeText}`}>
              {upcomingLabel}
            </span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={`H5 ${styles.title}`}>{title}</h3>
        {meta && meta.length > 0 && (
          <div className={`BodySmall ${styles.metaRow}`}>
            {meta.map((m, i) => {
              const Icon = META_ICONS[m.icon];
              if (!m.text) return null;
              return (
                <span key={i} className={styles.metaItem}>
                  <span
                    className={styles.metaIcon}
                    style={{ color: metaIconColor(m.color) }}
                  >
                    <Icon size={14} />
                  </span>
                  <span className={styles.metaText}>{m.text}</span>
                </span>
              );
            })}
          </div>
        )}
        {subtitle && (
          <p className={`BodyRegular ${styles.subtitle}`}>{subtitle}</p>
        )}
        <div className={`BodySmall ${styles.ctaRow}`}>
          <span className={styles.ctaLabel}>
            View {entryTypeLabel ?? "details"}
          </span>
          <span className={styles.ctaArrow}>
            <LuArrowRight size={18} />
          </span>
        </div>
      </div>
    </>
  );

  if (internal) {
    return (
      <Link href={href} className={rootClass}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={rootClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
};

export default SearchTileV2;
