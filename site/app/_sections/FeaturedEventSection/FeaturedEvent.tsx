import { DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from '@/app/_components/FeaturedEvent/FeaturedEvent';

export default function FeaturedEventSection() {
  return <div
    style={{
      width: "100%",
      height: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6vw",
      boxSizing: "border-box",
    }}
  >
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
  </div>;
}
