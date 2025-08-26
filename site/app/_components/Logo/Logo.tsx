import styles from "./Logo.module.css";

const defaultLogoURL = "/Logo.png";
export default function Logo({
  src,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={`${styles.logo}`}
      src={src || defaultLogoURL}
      alt="NavbarLogo"
      {...props}
    />
  );
}
