import MainHeroSection from "./_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "./_components/CoolImage/CoolImage";
import CallToActionSection from "./_sections/CallToActionSection/CallToActionSection";
import FeaturedEventSection from "./_sections/FeaturedEventSection/FeaturedEvent";
import Button from "./_components/Button/Button";
import { fetchAPI } from "./_utils/cms";
import HomeHeroSection from "./_sections/HomeHeroSection/HomeHeroSection";

export default async function Page() {
  // const data = await fetchAPI("brothers", { populate: "*" });
  // console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <HomeHeroSection
        spanText="UHD ACM"
        title={`Rise above the noise\nOne step at a time`}
        subtitle={`Together, we push past doubts and distractions\namplifying each other’s strengths every step of the way.`}
        // reverseOrder={true}
        bottomContent={
          <Button style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Join the Club</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
        leftStyle={{ flex: 1 }}
      />
      <MainHeroSection
        title={`Meet Our People,\nLearn Our Purpose.`}
        titleClassName="H1"
        subtitle="Find out who we are, and what it means to be part of UHD ACM."
        reverseOrder={true}
        bottomContent={
          <Button style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>More About Us</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
        leftStyle={{ flex: 4 }}
        rightStyle={{ flex: 5 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Be at the Right Place,\nAt the Right Time.`}
        titleClassName="H1"
        subtitle="View our calendar and find what stuff we have planned soon."
        // reverseOrder={true}
        bottomContent={
          <Button style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Upcoming Events</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
        leftStyle={{ flex: 4 }}
        rightStyle={{ flex: 5 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <FeaturedEventSection />
      <CallToActionSection
        title={`UHD ACM\nJoin Today!`}
        subtitle="We await your arrival or something"
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
              <span style={{ fontWeight: 500 }}>Join UHDACM Today</span>
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
