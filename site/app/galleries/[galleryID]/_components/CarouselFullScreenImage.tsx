import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  caption?: string;
};

export function CarouselFullScreenImage({ caption, ...props }: ImageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <img
        {...props}
        style={{
          width: "75vw",
          maxWidth: "40rem",
          maxHeight: "60vh",
          borderRadius: "0.5rem",
          objectFit: "contain",
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {caption && (
        <span
          style={{
            maxWidth: "90vw",
            textAlign: "center",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            boxSizing: "border-box",
            backgroundColor: "rgb(var(--color-background-primary))",
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          className="BodyRegular"
        >
          {caption}
        </span>
      )}
    </div>
  );
}
