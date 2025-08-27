import React from "react";
import styles from "./FeaturedEvent.module.css";

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
      <div className={styles.content} style={contentStyle}>
        <div className="H2">{title}</div>
        <div className="BodyLargeHeavy">{largeHeavy}</div>
        <div className="BodyLargeHeavy">{smallHeavy}</div>
        <div className="BodyRegular">{caption}</div>
        {BottomComponent && (
          <div className={styles.buttonRow}>{BottomComponent}</div>
        )}
      </div>
      <img style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1, borderRadius: '0.5rem' }} src={img||'/sjd.JPG'} />
    </div>
  );
};

export default FeaturedEvent;
