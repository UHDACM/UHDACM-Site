"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./FilterTab.module.css";

export type FilterTabOption = { label: string; value: string };
export type FilterTabColor = "primary" | "secondary" | "accent" | "neutral";

interface FilterTabProps {
  options: FilterTabOption[];
  value: string;
  onChange: (value: string) => void;
  color?: FilterTabColor;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const FilterTab: React.FC<FilterTabProps> = ({
  options,
  value,
  onChange,
  color = "primary",
  compact = false,
  className,
  style,
}) => {
  const themeClass = styles[`FilterTab--color-${color}`];
  const rootClasses = [
    styles.FilterTab,
    themeClass,
    className ? styles[className] ?? className : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (compact) {
    return (
      <CompactFilterTab
        options={options}
        value={value}
        onChange={onChange}
        themeClass={themeClass}
        className={className}
        style={style}
      />
    );
  }

  return (
    <TabRowFilterTab
      options={options}
      value={value}
      onChange={onChange}
      rootClasses={rootClasses}
      style={style}
    />
  );
};

export default FilterTab;

/* ---------- Tab row variant ---------- */

interface TabRowProps {
  options: FilterTabOption[];
  value: string;
  onChange: (value: string) => void;
  rootClasses: string;
  style?: React.CSSProperties;
}

const TabRowFilterTab: React.FC<TabRowProps> = ({
  options,
  value,
  onChange,
  rootClasses,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeIndex = options.findIndex((o) => o.value === value);

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    if (activeIndex < 0) {
      setIndicator((s) => ({ ...s, ready: false }));
      return;
    }
    const target = optionRefs.current[activeIndex];
    if (!target) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    setIndicator({
      left: tRect.left - cRect.left,
      width: tRect.width,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    options.forEach((_, i) => {
      const el = optionRefs.current[i];
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length]);

  return (
    <div ref={containerRef} className={rootClasses} style={style} role="tablist">
      <div
        className={styles.indicator}
        style={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.ready ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {options.map((opt, i) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.option} BodyRegular`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

/* ---------- Compact (dropdown) variant ---------- */

interface CompactProps {
  options: FilterTabOption[];
  value: string;
  onChange: (value: string) => void;
  themeClass: string;
  className?: string;
  style?: React.CSSProperties;
}

const CompactFilterTab: React.FC<CompactProps> = ({
  options,
  value,
  onChange,
  themeClass,
  className,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number>(-1);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const wrapClasses = [
    styles.compactWrap,
    themeClass,
    className ? styles[className] ?? className : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setHovered(-1);
  };

  return (
    <div ref={wrapRef} className={wrapClasses} style={style}>
      <button
        type="button"
        className={`${styles.trigger} BodyRegular`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected ? selected.label : ""}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          <FaChevronDown size={12} />
        </span>
      </button>
      {open && (
        <div className={styles.menu} role="listbox">
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHovered = hovered === i;
            const itemClasses = [
              styles.menuItem,
              "BodyRegular",
              isSelected ? styles.menuItemSelected : undefined,
              isHovered ? styles.menuItemHover : undefined,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={itemClasses}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? -1 : h))}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt.value);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
