import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import FeaturedEventSection from "../_sections/FeaturedEventSection/FeaturedEvent";
import EntrySearchTool from "../_components/EntrySearchTool/EntrySearchTool";
import Button from "../_components/Button/Button";

export default async function Page() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="EVENTS"
        title={`Something Catchy\nN'Stuff Here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <FeaturedEventSection />
      <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '100%', maxWidth: '80rem'}}>
          <EntrySearchTool />
        </div>
      </div>
      <CallToActionSection
        title={`Want to collaborate\nwith UHDACM?`}
        subtitle="We'd love to hear from u or sumn"
        
        actionComponent={
          <Button>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Collab with UHD ACM</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
      />
    </div>
  );
}


