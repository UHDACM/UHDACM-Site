import Button from "@/app/_components/Button/Button";

interface CallToActionSectionProps {
  title: string;
  subtitle: string;
  buttonProps: React.ComponentProps<typeof Button>;
}

export default function CallToActionSection({
  title,
  subtitle,
  buttonProps,
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
      <Button {...buttonProps} />
    </div>
  );
}
