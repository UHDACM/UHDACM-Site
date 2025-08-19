'use client'

import React from "react";
import Link from "next/link";
import { FunctionUnknown } from "@/app/_utils/types";
import styles from "./Button.module.css";

interface ButtonProps {
  onClick?: FunctionUnknown;
  href?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const defaultProps = {
  className: [styles.Button, styles['LinkStyle']].join(' '),
  tabIndex: 0,
};

const Button: React.FC<ButtonProps> = ({ onClick, href, children, style, className }) => {
  const classes = [defaultProps.className, styles[className||'']].filter(Boolean).join(' ');
  if (href) {
    return (
      <Link {...defaultProps} href={href} style={style} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...defaultProps} onClick={onClick} style={style} className={classes}>
      {children}
    </button>
  );
};

export default Button;
