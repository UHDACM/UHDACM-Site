"use client";

import React, { InputHTMLAttributes, useRef } from "react";
import { DefaultSearch } from "@/app/_icons/Icons";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  onFocusInput?: () => void;
  onBlurInput?: () => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onFocusInput,
  onBlurInput,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      className="SubtitleRegular"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
        style={{
          paddingLeft: '2.25rem'
        }}
        {...props}
      />
      <DefaultSearch
        style={{
          position: "absolute",
          left: "0.6rem",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          opacity: 0.7,
          color: "inherit",
        }}
        strokeWidth={'0.15rem'}
        size={20}
      />
    </div>
  );
};
