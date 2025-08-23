"use client";

import { setPopupCarousel } from "@/app/_features/popupCarousel/popupCarouselSlice";
import { AppDispatch } from "@/app/_features/store";
import { useDispatch } from "react-redux";
import { CarouselFullScreenImage } from "./CarouselFullScreenImage";
import { CarouselThumbnail } from "./CarouselThumbnail";
import { StrapiPicture } from "@/app/_utils/types";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";


export default function GalleryGrid({ media }: { media: StrapiPicture[] }) {
  const dispatch = useDispatch<AppDispatch>();
  
  const mediaArray = media;


  const onImageClick = (index: number) => {
    dispatch(
      setPopupCarousel({
        items: mediaArray.map((img, i) => (
          <CarouselFullScreenImage
            key={img.id || i}
            src={`${ProduceCMSResourceURL(img.url)}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
            caption={img.caption}
          />
        )),
        thumbnails: mediaArray.map((img, i) => (
          <CarouselThumbnail
            key={img.id || i}
            src={`${ProduceCMSResourceURL(img.url)}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
          />
        )),
        showArrows: true,
        showThumbnails: true,
        activeIndex: index,
      })
    );
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
        {mediaArray.map((img, i) => (
          <img
            key={img.id || i}
            src={`${ProduceCMSResourceURL(img.url)}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              objectFit: "cover",
              cursor: "pointer",
            }}
            className="dimOnHover"
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
