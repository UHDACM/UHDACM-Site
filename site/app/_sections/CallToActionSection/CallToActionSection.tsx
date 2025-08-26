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
      className={'SectionRoot'}
      style={{
        margin: '12rem 0'
      }}
    >
      <div
        className="SectionInner"
        style={{gap: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}
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
