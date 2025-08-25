import styles from './HeroForm.module.css'

export default function HeroForm({ iFrameUrl }: { iFrameUrl: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <iframe
          src={iFrameUrl}
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "8px" }}
          title={iFrameUrl}
        />
      </div>
    </div>
  );
}
