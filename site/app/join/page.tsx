import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import Button from "../_components/Button/Button";

export default async function Page() {
  // const data = await fetchAPI("sisters", { populate: "*" });
  // console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="JOIN"
        title={`Join the Computing\nMovement at UHD`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Join our Discord`}
        titleClassName="FontH1"
        subtitle={`We post a lot on Discord and stuff.\n Announcements, emails, events, and more.\n\nJoin our discord NOW!`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/discord3d.webp" />}
        bottomContent={
          <Button
            style={{ marginTop: "0.5rem" }}
            href="https://discord.com/invite/362vxfy7SE"
            target="_blank"
          >
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Join Our Discord</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
      />
      <MainHeroSection
        title={`Join our CampusGroups\nGet our emails!`}
        titleClassName="FontH1"
        subtitle={`Something about campus groups bro. Idk, I don’t really care about campus groups bru`}
        reverseOrder={false}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
        bottomContent={
          <Button
            style={{ marginTop: "0.5rem" }}
            href="https://uhd.campusgroups.com/ACM/club_signup"
            target="_blank"
          >
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Join Campus Groups</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
      />
      <MainHeroSection
        title={`Become an Officer\nof UHD ACM`}
        titleClassName="FontH1"
        subtitle={`One of us, one of us, one of us. One of us, one of us, one of us. One of us, one of us, one of us.`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      {/* <CallToActionSection
        title={`Want to be\nan officer?`}
        subtitle="Your leadership journey starts here"
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
              <span style={{ fontWeight: 500 }}>Become an Officer</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
      /> */}
    </div>
  );
}
