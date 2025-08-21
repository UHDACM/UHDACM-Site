import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CarouselFullScreenImage(props: ImageProps) {
  return (
    <img
      {...props}
      style={{
        width: "75vw",
        maxWidth: "40rem",
        maxHeight: "60vh",
        borderRadius: "0.5rem",
        objectFit: "contain",
        overflow: 'hidden',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    />
  );
}
