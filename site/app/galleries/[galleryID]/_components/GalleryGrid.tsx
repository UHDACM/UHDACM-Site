"use client";

import { setPopupCarousel } from "@/app/_features/popupCarousel/popupCarouselSlice";
import { AppDispatch } from "@/app/_features/store";
import { useDispatch } from "react-redux";
import { CarouselFullScreenImage } from "./CarouselFullScreenImage";
import { CarouselThumbnail } from "./CarouselThumbnail";
import { StrapiPicture } from "@/app/_utils/types";

import styles from './GalleryGrid.module.css';
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";

export default function GalleryGrid({ media }: { media: StrapiPicture[] }) {
  const dispatch = useDispatch<AppDispatch>();
  
  const mediaArray = media;

  // const mediaArray = [...media, ...media, ...media];

  const onImageClick = (index: number) => {
    dispatch(
      setPopupCarousel({
        items: mediaArray.map((img, i) => (
          <CarouselFullScreenImage
            key={img.id || i}
            src={`${TryGetImageFormatUrl(img, 'large')}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
            caption={img.caption}
          />
        )),
        thumbnails: mediaArray.map((img, i) => (
          <CarouselThumbnail
            key={img.id || i}
            src={`${TryGetImageFormatUrl(img, 'thumbnail')}`}
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
      className="SectionRoot"
      style={{margin: '2rem 0 4rem 0'}}
    >
      <div
        className={`SectionInner ${styles.galleryGrid}`}
      >
        {mediaArray.map((img, i) => (
          <img
            key={i}
            src={`${TryGetImageFormatUrl(img, 'small')}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
            style={{
              width: "100%",
              aspectRatio: 1,
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
