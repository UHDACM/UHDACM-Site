import React from "react";
import Button from "../Button/Button";
import styles from "./FeaturedEvent.module.css";

interface FeaturedEventProps {
  title: string;
  largeHeavy: string;
  smallHeavy: string;
  caption: string;
  leftButtonProps: React.ComponentProps<typeof Button>;
  rightButtonProps: React.ComponentProps<typeof Button>;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  img?: string;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = async ({
  title,
  largeHeavy,
  smallHeavy,
  caption,
  leftButtonProps,
  rightButtonProps,
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
        <div className={styles.buttonRow}>
          <Button {...leftButtonProps}>{leftButtonProps.children}</Button>
          <Button {...rightButtonProps}>{rightButtonProps.children}</Button>
        </div>
      </div>
      <img style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }} src={img||'/sjd.JPG'} />
    </div>
  );
};

export default FeaturedEvent;
