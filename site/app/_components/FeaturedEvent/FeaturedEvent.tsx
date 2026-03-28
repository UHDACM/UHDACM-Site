import React from "react";
import styles from "./FeaturedEvent.module.css";
import { DefaultClock, DefaultLocation } from "@/app/_icons/Icons";

interface FeaturedEventProps {
  title: string;
  largeHeavy: string;
  smallHeavy: string;
  caption: string;
  BottomComponent?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  img?: string;
}


const FeaturedEvent: React.FC<FeaturedEventProps> = ({
  title,
  largeHeavy,
  smallHeavy,
  caption,
  BottomComponent,
  containerStyle = {},
  contentStyle = {},
  img
}) => {
  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.imagePanel}>
        <img className={styles.image} src={img || '/sjd.JPG'} />
      </div>
      <div className={styles.textPanel}>
        <div className={styles.blurTopLeft} />
        <div className={styles.blurBottomRight} />
        <div className={styles.content} style={contentStyle}>
          <div className="H2">{title}</div>
          <div className="BodyLargeHeavy" style={{
            color: 'rgb(var(--color-font-primary))'
          }}>{largeHeavy}</div>
          <div className="BodyLargeHeavy" style={{
            color: 'rgb(var(--color-font-secondary))'
          }}>{smallHeavy}</div>
          <div className="BodyRegular" style={{marginTop: '0.25rem'}}>{caption}</div>
          {BottomComponent && (
            <div className={styles.buttonRow}>{BottomComponent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
