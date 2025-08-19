import React from "react";
import styles from "./EntryTile.module.css";

interface EntryTileProps {
  imageSrc?: string;
  header?: string;
  subheader?: string;
  description?: string;
  CallToAction?: React.ReactNode;
  style?: React.CSSProperties;
  imageAlt?: string;
}

const EntryTile: React.FC<EntryTileProps> = ({
  imageSrc,
  header,
  subheader,
  description,
  CallToAction,
  style = {},
  imageAlt = "Entry image",
}) => {
  return (
    <div className={styles.EntryTile} style={style}>
      <div className={styles.imageContainer}>
        <img src={imageSrc||'sjd.JPG'} alt={imageAlt} className={styles.image} />
      </div>
      <div className={styles.contentContainer}>
        <h2 className="FontH2">{header}</h2>
        <h5 className="FontH5" style={{ color: "rgb(var(--color-font-secondary))", whiteSpace: 'pre-wrap' }}>{subheader}</h5>
        <div className="BodyLarge">{description}</div>
        <div className={styles.ctaRow}>{CallToAction}</div>
      </div>
    </div>
  );
};

export default EntryTile;
