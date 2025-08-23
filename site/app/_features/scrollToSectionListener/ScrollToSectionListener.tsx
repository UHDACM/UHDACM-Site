"use client";

import React, { useEffect, ReactNode } from "react";


interface ScrollToSectionListenerProps {
  children: ReactNode;
}

const scrollToHash = () => {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (hash) {
    const id = hash.substring(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

const ScrollToSectionListener: React.FC<ScrollToSectionListenerProps> = ({ children }) => {
  useEffect(() => {
    // Scroll on initial load
    scrollToHash();

    // Scroll on hash change
    const onHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return <>{children}</>;
};

export default ScrollToSectionListener;