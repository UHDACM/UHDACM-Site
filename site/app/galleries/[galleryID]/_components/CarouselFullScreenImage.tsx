
import React from "react";
import styles from "./CarouselFullScreenImage.module.css";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  caption?: string;
};

export function CarouselFullScreenImage({ caption, ...props }: ImageProps) {
  return (
    <div className={styles.carouselFullScreenRoot}>
      <img
        {...props}
        className={styles.carouselFullScreenImg}
      />
      {caption && (
        <span className={`BodyRegular ${styles.carouselFullScreenCaption}`}>
          {caption}
        </span>
      )}
    </div>
  );
}
