import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CarouselThumbnail(props: ImageProps) {
  return (
    <img
      {...props}
      style={{
        width: "5rem",
        height: '5rem',
        objectFit: 'contain'
      }}
    />
  );
}
