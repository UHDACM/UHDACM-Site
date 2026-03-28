"use client";

import React, { InputHTMLAttributes, useRef } from "react";
import { DefaultSearch } from "@/app/_icons/Icons";
import styles from "./SearchBarV2.module.css";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  onFocusInput?: () => void;
  onBlurInput?: () => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onFocusInput,
  onBlurInput,
  inputValue,
  onInputValueChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`${styles.wrap} SubtitleRegular`} {...props}>
      <DefaultSearch
        className={styles.icon}
        strokeWidth={"0.15rem"}
        size={20}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
        value={inputValue}
        onChange={(e) => onInputValueChange?.(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};
