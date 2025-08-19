// import Image from "next/image";
import styles from "./CoolImage.module.css";

interface CoolImageProps {
  src: string;
  style?: React.CSSProperties;
  alt?: string;
  // width?: number;
  // height?: number;
}

export default function CoolImage({
  src,
  style,
  alt = "",
}: // width = "100%",
// height = "100%",
CoolImageProps) {
  return (
    <div style={{...style, position: 'relative'}}>
      <img
        src={src}
        alt={alt}
        className={`${styles.CoolImage}`}
      />
      {/* <div className={`${styles.CoolBorderPulse}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
        <div className={`${styles.CoolBorder} ${styles['CoolBorder--TopLeft']}`} />
        <div className={`${styles.CoolBorder} ${styles['CoolBorder--BottomRight']}`} />
      </div> */}
    </div>
  );
}
