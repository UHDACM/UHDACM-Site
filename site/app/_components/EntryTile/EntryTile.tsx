import React from "react";
import styles from "./EntryTile.module.css";

interface EntryTileProps {
  imageSrc?: string;
  header?: string;
  subheader?: string;
  subheaderTwo?: string;
  description?: string;
  CallToAction?: React.ReactNode;
  style?: React.CSSProperties;
  imageAlt?: string;
}

const maxDescriptionLength = 200;
const EntryTile: React.FC<EntryTileProps> = ({
  imageSrc,
  header,
  subheader,
  subheaderTwo,
  description,
  CallToAction,
  style = {},
  imageAlt = "Entry image",
}) => {
  return (
    <div className={styles.EntryTile} style={style}>
      <div className={styles.imageContainer}>
        <img src={imageSrc || 'sjd.JPG'} alt={imageAlt} className={styles.image} />
      </div>
      <div className={styles.contentContainer}>
        <h2 className="H3">{header}</h2>
        <h4
          className="H5"
          style={{
            color: "rgb(var(--color-font-primary))",
            whiteSpace: "pre-wrap",
          }}
        >
          {subheader}
        </h4>
        <h5
          className="BodyLarge"
          style={{
            color: "rgb(var(--color-font-secondary))",
            whiteSpace: "pre-wrap",
          }}
        >
          {subheaderTwo}
        </h5>
        <div className="BodyRegular">{description?.slice(0, maxDescriptionLength)}{(description?.length || 0) > maxDescriptionLength && "..."}</div>
        <div className={styles.ctaRow}>{CallToAction}</div>
      </div>
    </div>
  );
};

export default EntryTile;
