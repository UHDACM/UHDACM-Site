import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import PersonTile from "../_components/PersonTile/PersonTile";

export default async function Page() {
  // const data = await fetchAPI("sisters", { populate: "*" });
  // console.log(data);

  const persontilecomp = (key: string) => {
    return <PersonTile
      key={key}
      imgCoverOrContain="cover"
      img="/Arbaz.jpeg"
      // img="/white.png"
      previewTitle="Arbaz K."
      fullTitle="Arbaz Khan"
      previewSubTitle="Official Cheer-leader"
      fullSubtitle="Official UHD ACM Cheer-leader"
      fullDescription="IBM Software Developer with a strong computer science foundation, specializing in enterprise storage, large-scale software, and data-driven solutions. Magna Cum Laude graduate from UHD, now pursuing a Master’s in Data Analytics to deepen expertise in scalable system design."
      socials={[
        {
          icon: "linkedin",
          href: "https://www.linkedin.com/in/akhan-/",
        },
      ]}
    />;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="ABOUT"
        title={`UHD's home for all things computing`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`We are UHD ACM`}
        titleClassName="FontH1"
        subtitle={`The University of Houston-Downtown’s Chapter of the Association for Computing Machinery.\nFostering community, learning, and innovation through events, projects, and collaboration for students of all skill levels at UHD.`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <div
        style={{
          width: "100%",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6vw",
          boxSizing: "border-box",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <h1 className={`FontH1`} style={{ whiteSpace: "pre-line" }}>
          Meet our Leadership
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {Array.from({ length: 11 }).map((_, i) => {
            return persontilecomp(`${i}`)
          })}
        </div>
      </div>
      <CallToActionSection
        title={`Want to be\nan officer?`}
        subtitle="Your leadership journey starts here"
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
              <span style={{ fontWeight: 500 }}>Become an Officer</span>
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
