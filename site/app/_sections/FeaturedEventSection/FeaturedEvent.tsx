import { DefaultEllipsis } from "@/app/_icons/Icons";
import FeaturedEvent from '@/app/_components/FeaturedEvent/FeaturedEvent';

export default function FeaturedEventSection() {
  return <div
    style={{
      width: "100%",
      height: "80vh",
      display: "flex",
      flexDirection: 'column',
      alignItems: "start",
      justifyContent: "center",
      padding: "6vw",
      gap: '0.5rem',
      boxSizing: "border-box",
    }}
  >
    <h1 className='FontH1'>Featured Event</h1>
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
