"use client";

import React, { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./Select.module.css";
import { toTitleCase } from "@/app/_utils/tools";

type SelectProps = {
  options: string[];
  onSelect?: (value: string) => void;
  selected?: string;
  placeholder?: string;
  inputStyling?: React.CSSProperties;
};

export default function Select({
  options,
  onSelect,
  selected,
  placeholder,
  inputStyling,
}: SelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  ).map((v) => toTitleCase(v));

  const handleSelect = (value: string) => {
    setSearch("");
    setOpen(false);
    onSelect?.(value);
    inputRef.current?.blur();
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length == 0) {
      return;
    }

    if (e.key == "Enter") {
      handleSelect(filtered[0]);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setHighlighted(0);
  };

  return (
    <div
      style={{ position: "relative", boxSizing: "border-box" }}
    >
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          value={search}
          placeholder={selected||placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          style={inputStyling}
          className={`${styles["select"]} ${styles["bright_placeholder"]}`}
          onKeyDown={handleInputEnter}
        />
        <div
          style={{
            transform: open ? "scaleY(-100%)" : "scaleY(100%)",
            transition: "transform ease-in-out 200ms",
            position: "absolute",
            right: "0.5rem",
            top: "20%",
          }}
        >
          <FaChevronDown
            style={{
              transform: "translateY(15%)",
              pointerEvents: "none",
              color: "#888",
            }}
          />
        </div>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            minWidth: "100%",
            width: 'auto',
            left: 0,
            right: 0,
            marginTop: '1.75%',
            background: "rgb(var(--color-neutral-900))",
            outline: "1px solid rgb(var(--color-neutral-800))",
            borderTop: "none",
            borderRadius: "0 0 0.5rem 0.5rem",
            zIndex: 10,
            maxHeight: "12rem",
            overflowY: "auto",
            color: "rgba(var(--color-font-default), 1)"
          }}
          className="no-scrollbar"
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 8 }}>No options</div>
          ) : (
            filtered.map((opt, i) => (
              <div
                key={opt}
                onMouseDown={() => handleSelect(opt)}
                style={{
                  padding: 8,
                  cursor: "pointer",
                  background:
                    highlighted === i
                      ? "rgba(var(--color-font-secondary), 0.5)"
                      : "transparent",
                }}
                onMouseEnter={() => setHighlighted(i)}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
