import styles from './Footer.module.css'

import Link from "next/link";
import { Logo } from "../Navbar/Navbar";
import { NavigationTree } from "@/app/_utils/globals";
import {
  DefaultDiscord,
  DefaultGithub,
  DefaultInstagram,
  DefaultLinkedin,
  DefaultYoutube,
} from "@/app/_icons/Icons";
import { getTodayYMD } from "@/app/_utils/tools";

export default function Footer() {
  return (
    <div className={`SectionRoot ${styles.footerRoot}`}>
      <div className={`SectionInner ${styles.footerInner}`}>
        <div className={styles.footerRow}>
          <Link href="/" className={styles.logoLink}>
            <Logo />
          </Link>
          <div className={styles.navLinks}>
            {NavigationTree.map((entry) => (
              <Link
                key={entry.path}
                href={entry.path}
                className={`BodyLargeHeavy`}
              >
                {entry.title}
              </Link>
            ))}
          </div>
          <div className={styles.socialsCol}>
            <div className={`H3 ${styles.socialsRow}`}>
              <Link href="https://github.com/UHDACM" target="_blank">
                <DefaultGithub color="rgb(var(--color-font-default))" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/uhd-acm/"
                target="_blank"
              >
                <DefaultLinkedin color="rgb(var(--color-font-default))" />
              </Link>
              <Link href="https://www.youtube.com/@uhdacm" target="_blank">
                <DefaultYoutube color="rgb(var(--color-font-default))" />
              </Link>
              <Link href="https://www.instagram.com/uhdacm" target="_blank">
                <DefaultInstagram color="rgb(var(--color-font-default))" />
              </Link>
              <Link
                href="https://discord.com/invite/362vxfy7SE"
                target="_blank"
              >
                <DefaultDiscord color="rgb(var(--color-font-default))" />
              </Link>
            </div>
          </div>
        </div>
        <span className={`BodySmall ${styles.copyright}`}>
          UHD ACM © {getTodayYMD()[0]}. All rights reserved.
        </span>
      </div>
    </div>
  );
}
