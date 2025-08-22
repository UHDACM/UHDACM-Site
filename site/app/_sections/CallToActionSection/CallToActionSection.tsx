import { ReactNode } from "react";

interface CallToActionSectionProps {
  title: string;
  subtitle: string;
  actionComponent: ReactNode;
}

export default function CallToActionSection({
  title,
  subtitle,
  actionComponent,
}: CallToActionSectionProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "var(--page-max-width)",
          width: "95vw",
          padding: "2rem 1rem",
          boxSizing: "border-box",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.8rem",
          textAlign: "center",
        }}
      >
        <h1
          className="Title"
          style={{ whiteSpace: "pre-wrap", textAlign: "center" }}
        >
          {title}
        </h1>
        <span className="SubtitleRegular">{subtitle}</span>
        {actionComponent}
      </div>
    </div>
  );
}
