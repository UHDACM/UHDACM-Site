'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../Button/Button";
import { NavigationTree } from "@/app/_utils/globals";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32); // 2rem = 32px
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`${styles.Navbar} ${scrolled ? styles.scrolled : ""}`}
    >
      <Link href="/" className={styles.logoLink}>
        <img src="/Logo.png" alt="Logo" className={styles.logo} />
      </Link>
      <div className={styles.navLinks}>
        {NavigationTree.map((entry) => (
          <Link
            key={entry.path}
            href={entry.path}
            className={`BodyLargeHeavy ${styles.navButton}`}
          >
            {entry.title}
          </Link>
        ))}
      </div>
      <div className={styles.joinButton}>
        <Button href="/join">
          Join the Club
        </Button>
      </div>
    </nav>
  );
}
