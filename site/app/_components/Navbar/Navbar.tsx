"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../Button/Button";
import { NavigationTree } from "@/app/_utils/globals";
import styles from "./Navbar.module.css";
import { DefaultClose, DefaultMenu } from "@/app/_icons/Icons";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import Transition from "../Transition/Transition";
import Logo from "../Logo/Logo";

export default function Navbar({ logoURL }: { logoURL?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32); // 2rem = 32px
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <NavbarDesktop logoURL={logoURL} scrolled={scrolled} />
      <NavbarMobile logoURL={logoURL} scrolled={scrolled} />
    </>
  );
}

function NavbarMobile({ logoURL, scrolled }: { logoURL?: string; scrolled: boolean }) {
  const [active, setActive] = useState(false);
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();

  const handleSetActive = (value: boolean) => {
    setActive(value);
    if (value) {
      disableOverflowY();
    } else {
      enableOverflowY();
    }
  };

  return (
    <nav
      className={`${styles.NavbarMobile} ${scrolled ? styles.scrolled : ""} ${
        styles.ShowMobile
      }`}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: "2rem",
          color: "rgb(var(--color-font-default))",
          rotate: active ? "90deg" : "0deg",
          transition: "rotate 100ms ease-in-out",
        }}
        onClick={() => handleSetActive(!active)}
      >
        <DefaultMenu
          size={"2.5rem"}
          style={{
            position: "absolute",
            opacity: active ? 0 : 1,
            transition: "opacity 100ms ease-in-out",
          }}
        />
        <DefaultClose
          size={"3.5rem"}
          style={{
            position: "absolute",
            opacity: !active ? 0 : 1,
            transition: "opacity 100ms ease-in-out",
          }}
        />
        {/* <DefaultMenu color={'rgb(var(--color-font-default))'} size={'2.5rem'} style={{position: 'absolute', top: 0 }} /> */}
      </div>
      <NavbarLogo logoURL={logoURL} onClick={() => handleSetActive(false)} />
      <Transition
        forceStyle={{
          width: "100%",
          height: "100%",
          top: 0,
          position: "fixed",
          zIndex: -1,
          backgroundColor: "rgba(var(--color-neutral-1000), 0.975)",
        }}
        type="wipe"
        easing="inOutQuart"
        direction="right"
        transitionSpeedMS={500}
        toggle={active}
      >
        <div
          className={`${styles.navLinks}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0rem",
            marginTop: "4rem",
            padding: "1rem",
          }}
        >
          {NavigationTree.map((entry) => (
            <Link
              key={entry.path}
              href={entry.path}
              className={`H1 ${styles.navButton}`}
              onClick={() => handleSetActive(false)}
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </Transition>
    </nav>
  );
}

function NavbarDesktop({ logoURL, scrolled }: { logoURL?: string; scrolled: boolean }) {
  return (
    <nav
      className={`${styles.Navbar} ${scrolled ? styles.scrolled : ""} ${
        styles.ShowDesktop
      }`}
    >
      <NavbarLogo logoURL={logoURL} />
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
        <Button href="/join">Join the Club</Button>
      </div>
    </nav>
  );
}

export function NavbarLogo({ logoURL, onClick }: { logoURL: string | undefined; onClick?: () => void }) {
  return (
    <Link href="/" className={styles.logoLink} onClick={onClick}>
      <Logo src={logoURL} />
    </Link>
  );
}

