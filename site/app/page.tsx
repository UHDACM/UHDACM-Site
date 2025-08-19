import MainHeroSection from "./_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "./_components/CoolImage/CoolImage";
import CallToActionSection from "./_sections/CallToActionSection/CallToActionSection";
import FeaturedEventSection from "./_sections/FeaturedEventSection/FeaturedEvent";

export default async function Page() {
  // const data = await fetchAPI("sisters", { populate: "*" });
  // console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="UHD ACM"
        title={`Rise above the noise,\nOne step at a time.`}
        subtitle="Together, we push past doubts and distractions, amplifying each other’s strengths every step of the way."
        // reverseOrder={true}
        buttonProps={{
          children: (
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
          ),
        }}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Meet Our People,\nLearn Our Purpose.`}
        titleClassName="FontH1"
        subtitle="Find out who we are, and what it means to be part of UHD ACM."
        reverseOrder={true}
        buttonProps={{
          children: (
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
          ),
        }}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Be at the Right Place,\nAt the Right Time.`}
        titleClassName="FontH1"
        subtitle="View our calendar and find what stuff we have planned soon."
        // reverseOrder={true}
        buttonProps={{
          children: (
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
          ),
        }}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <FeaturedEventSection />
      <CallToActionSection
        title={`UHD ACM\nJoin Today!`}
        subtitle="We await your arrival or something"
        buttonProps={{
          children: (
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
          ),
        }}
      />
    </div>
  );
}
