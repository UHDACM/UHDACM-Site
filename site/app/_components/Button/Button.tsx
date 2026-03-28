"use client";

import React from "react";
import Link from "next/link";
import { FunctionUnknown } from "@shared/types/general/generalTypes";
import styles from "./Button.module.css";

type ButtonShape = "square" | "round";
type ButtonColor = "primary" | "secondary" | "accent" | "background";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: FunctionUnknown;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  shape?: ButtonShape;
  color?: ButtonColor;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  target,
  children,
  style,
  className,
  shape = "square",
  color = "primary",
  ...props
}) => {
  const classes = [
    styles.Button,
    styles.LinkStyle,
    styles[`Button--${shape}`],
    styles[`Button--color-${color}`],
    className ? styles[className] ?? className : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        onClick={onClick}
        href={href}
        style={style}
        className={classes}
        target={target}
        tabIndex={0}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      className={classes}
      tabIndex={0}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
