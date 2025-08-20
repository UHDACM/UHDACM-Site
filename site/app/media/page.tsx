import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import Button from "../_components/Button/Button";
import FloatingImages from "../_components/FloatingImages/FloatingImages";

export default async function Page() {
  // const data = await fetchAPI("sisters", { populate: "*" });
  // console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="MEDIA"
        title={`Something about\nmedia here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Our Memories in HD 4K IMAX`}
        titleClassName="FontH1"
        subtitle={`Something about our gallery and stuff like that.`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={
          <div style={{ width: "100%", height: "60vh" }}>
            <FloatingImages
              imgs={[
                "/discord3d.webp",
                "Arbaz.jpeg",
                "/sjd.JPG",
                "/discord3d.webp",
                "Arbaz.jpeg",
                "/sjd.JPG",
                "/discord3d.webp",
                "Arbaz.jpeg",
                "/sjd.JPG",
                "/discord3d.webp",
                "Arbaz.jpeg",
                "/sjd.JPG",
                "/discord3d.webp",
                        "Arbaz.jpeg",
                "/sjd.JPG",
              ]}
            />
          </div>
        }
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
              <span style={{ fontWeight: 500 }}>View Gallaries</span>
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
        title={`Watch our QnA\nwith Andy Berrios`}
        titleClassName="FontH1"
        subtitle={`We asked: \nHow do you get better DS? Should I learn React.js? Do you think AI is a threat?\n\nAnd much more!`}
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
        title={`Something about Newsletters`}
        titleClassName="FontH1"
        subtitle={`One of us, one of us, one of us. One of us, one of us, one of us. One of us, one of us, one of us.`}
        reverseOrder={true}
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
              <span style={{ fontWeight: 500 }}>View Newsletters</span>
              <DefaultChevronRight
                fontSize={"inherit"}
                style={{ marginRight: "-0.25rem" }}
                strokeWidth={"0.20rem"}
              />
            </div>
          </Button>
        }
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
