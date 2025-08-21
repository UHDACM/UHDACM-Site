"use client";

import { setPopupCarousel } from "@/app/_features/popupCarousel/popupCarouselSlice";
import { AppDispatch, RootState } from "@/app/_features/store";
import { useDispatch, useSelector } from "react-redux";
import { CarouselFullScreenImage } from "./CarouselFullScreenImage";
import { CarouselThumbnail } from "./CarouselThumbnail";

export default function GalleryGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const onImageClick = (index: number) => {
    dispatch(setPopupCarousel({
      items: [
        <CarouselFullScreenImage
          key={index}
          src={`/sjd.JPG`}
          alt={`Gallery image ${index + 1}`}
        />,
        <CarouselFullScreenImage
          key={index}
          src={`/Arbaz.jpeg`}
          alt={`Gallery image ${index + 1}`}
        />,
        <CarouselFullScreenImage
          key={index}
          src={`/sjd.JPG`}
          alt={`Gallery image ${index + 1}`}
        />,
      ],
      thumbnails: [
        <CarouselThumbnail
          key={index}
          src={`/sjd.JPG`}
          alt={`Gallery image ${index + 1}`}
        />,
        <CarouselThumbnail
          key={index}
          src={`/Arbaz.jpeg`}
          alt={`Gallery image ${index + 1}`}
        />,
        <CarouselThumbnail
          key={index}
          src={`/sjd.JPG`}
          alt={`Gallery image ${index + 1}`}
        />,
      ],
      showArrows: true,
      showThumbnails: true,
      activeIndex: 0,
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "0 auto",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "95vw",
          maxWidth: "var(--page-max-width)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.5rem",
          padding: "2rem 1rem",
          boxSizing: "border-box",
        }}
      >
        <img
          src="/sjd.JPG"
          alt="Gallery image 1"
          style={{
            width: "100%",
            borderRadius: "0.5rem",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => onImageClick(0)}
        />
        <img
          src="/sjd.JPG"
          alt="Gallery image 2"
          style={{
            width: "100%",
            borderRadius: "0.5rem",
            objectFit: "cover",
          }}
        />
        <img
          src="/sjd.JPG"
          alt="Gallery image 3"
          style={{
            width: "100%",
            borderRadius: "0.5rem",
            objectFit: "cover",
          }}
        />
        <img
          src="/sjd.JPG"
          alt="Gallery image 4"
          style={{
            width: "100%",
            borderRadius: "0.5rem",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
