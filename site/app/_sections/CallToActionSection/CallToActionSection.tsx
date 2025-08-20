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
        flexDirection: "column",
        gap: "0.8rem",
      }}
    >
      <h1
        className="FontTitle"
        style={{ whiteSpace: "pre-wrap", textAlign: "center" }}
      >
        {title}
      </h1>
      <span className="SubtitleRegular">{subtitle}</span>
      {actionComponent}
    </div>
  );
}