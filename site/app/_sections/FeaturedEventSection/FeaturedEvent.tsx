import { DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from "@/app/_components/FeaturedEvent/FeaturedEvent";

export default function FeaturedEventSection() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <div
        style={{
          width: "95vw",
          maxWidth: 'var(--page-max-width)',
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          gap: "0.5rem",
          boxSizing: "border-box",
        }}
      >
        <h1 className="H1">Featured Event</h1>
        <div style={{ width: "100%", height: "25rem" }}>
          <FeaturedEvent
            title="Hello"
            largeHeavy="Happening soon"
            smallHeavy="Nuh uh, what?"
            caption="So this is what we finna do at this party broo"
            leftButtonProps={{
              children: <DefaultEllipsis />,
              href: "/left",
            }}
            rightButtonProps={{
              children: "Right Button",
              // onClick: () => alert("Right button clicked!"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
