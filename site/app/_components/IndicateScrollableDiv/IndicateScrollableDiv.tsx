import React, { useRef, useEffect, useState, HTMLAttributes } from "react";
import styles from "./IndicateScrollableDiv.module.css";

interface IndicateScrollableDivProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function IndicateScrollableDiv({ children, className, ...rest }: IndicateScrollableDivProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = divRef.current;
      if (!el) return;
      setAtTop(el.scrollTop === 0);
      setAtBottom(el.scrollHeight - el.scrollTop  === el.clientHeight);
    };
    const el = divRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);


  let borderClass = "";
  if (!atBottom) borderClass = styles.glowBottom;
  // else if (atBottom && !atTop) borderClass = styles.glowTop;

  return (
    <div ref={divRef} className={`${className} ${styles.IndicateScrollableDiv} ${borderClass}`} {...rest}>
      {children}
    </div>
  );
}
