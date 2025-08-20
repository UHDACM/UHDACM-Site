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
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({
  title,
  largeHeavy,
  smallHeavy,
  caption,
  leftButtonProps,
  rightButtonProps,
  containerStyle = {},
  contentStyle = {},
}) => {
  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.content} style={contentStyle}>
        <div className="Title">{title}</div>
        <div className="BodyLargeHeavy">{largeHeavy}</div>
        <div className="BodySmallHeavy">{smallHeavy}</div>
        <div className="BodyCaption">{caption}</div>
        <div className={styles.buttonRow}>
          <Button {...leftButtonProps}>{leftButtonProps.children}</Button>
          <Button {...rightButtonProps}>{rightButtonProps.children}</Button>
        </div>
      </div>
      <img style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }} src='/sjd.JPG' />
    </div>
  );
};

export default FeaturedEvent;
