import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import { StrapiPicture } from "@/app/_utils/types";
import styles from "./HeroSingleImage.module.css";

export default function HeroSingleImage({
  image,
}: {
  image: StrapiPicture;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={ProduceCMSResourceURL(image.url)}
          alt={image.alternativeText}
          className={styles.image}
        />
      </div>
    </div>
  );
}