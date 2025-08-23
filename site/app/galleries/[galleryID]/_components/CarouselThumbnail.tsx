import React from "react";
import styles from './CarouselThumbnail.module.css'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CarouselThumbnail(props: ImageProps) {
  return (
    <img
      {...props}
      className={styles.carouselThumbnail}
    />
  );
}
