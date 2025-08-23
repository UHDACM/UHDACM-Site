import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/_features/store";
import { closePopup } from "@/app/_features/popupCarousel/popupCarouselSlice";
import styles from "./popupCarousel.module.css";
import {
  DefaultChevronLeft,
  DefaultChevronRight,
  DefaultClose,
} from "@/app/_icons/Icons";

export default function PopupCarousel() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items = [],
    thumbnails = [],
    activeIndex = 0,
    showThumbnails,
    showArrows,
    isActive,
  } = useSelector((state: RootState) => state.popupCarousel);

  const [index, setIndex] = React.useState(activeIndex);

  React.useEffect(() => {
    if (isActive) setIndex(activeIndex ?? 0);
  }, [isActive, activeIndex]);

  if (!isActive || !items || items.length === 0) return null;

  const canGoLeft = showArrows && index > 0;
  const canGoRight = showArrows && index < items.length - 1;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.centerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main item */}
        <div className={styles.itemContainer}>{items[index]}</div>
        {/* Thumbnails */}
        {showThumbnails && thumbnails && thumbnails.length > 0 && (
          <div className={styles.thumbnailsRow}>
            {thumbnails.map((thumb, i) => (
              <div
                key={i}
                className={
                  styles.thumbnail +
                  (i === index ? " " + styles.activeThumbnail : "")
                }
                onClick={() => setIndex(i)}
              >
                {thumb}
              </div>
            ))}
          </div>
        )}
        <div
          className={styles.xContainer}
          onClick={() => dispatch(closePopup())}
        >
          <DefaultClose
            strokeWidth={"0.05rem"}
            size={"2.5rem"}
            color={"rgb(var(--color-font-default))"}
          />
        </div>
        {/* Left Chevron */}
        <div
          className={styles.chevronLeft}
          style={{
            opacity: canGoLeft ? 1 : 0.3,
            pointerEvents: canGoLeft ? 'auto' : 'none',
          }}
          onClick={() => canGoLeft && setIndex((i) => Math.max(0, i - 1))}
        >
          <DefaultChevronLeft
            size={'3rem'}
            color={"rgb(var(--color-font-default))"}
          />
        </div>
        {/* Right Chevron */}
        <div
          className={styles.chevronRight}
          style={{
            opacity: canGoRight ? 1 : 0.3,
            pointerEvents: canGoRight ? 'auto' : 'none',
          }}
          onClick={() => canGoRight && setIndex((i) => Math.min(items.length - 1, i + 1))}
        >
          <DefaultChevronRight
            size={'3rem'}
            color={"rgb(var(--color-font-default))"}
          />
        </div>
      </div>
    </div>
  );
}
