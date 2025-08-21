import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import PersonTile from "../_components/PersonTile/PersonTile";
import Button from "../_components/Button/Button";
import { fetchAPI } from "../_utils/cms";
import { isPerson } from "../_utils/validation";
import { Person, SocialObj } from "../_utils/types";

export default async function Page() {
  const res = await fetchAPI("leadership", {
    "populate[people][populate]": "*",
  });
  const { people } = res.data;

  const validPeople: Person[] = people.filter((person: any) => {
    if (!isPerson(person)) {
      return false;
    }
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MainHeroSection
        spanText="ABOUT"
        title={`UHD's home for all things computing`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        topLevelStyle={{
          paddingTop: '2.5rem'
        }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`We are UHD ACM`}
        titleClassName="H1"
        subtitle={`The University of Houston-Downtown’s Chapter of the Association for Computing Machinery.\nFostering community, learning, and innovation through events, projects, and collaboration for students of all skill levels at UHD.`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <div
        style={{
          width: "95vw",
          maxWidth: "var(--page-max-width)",
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
        <h1 className={`H1`} style={{ whiteSpace: "pre-line" }}>
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
          {validPeople.map((person, idx) => (
            <PersonTile
              key={idx}
              imgCoverOrContain="cover"
              img={`${process.env.NEXT_PUBLIC_STRAPI_URL}${person.Picture?.url}`}
              previewTitle={person.NameShort}
              fullTitle={person.Name}
              previewSubTitle={person.RoleShort}
              fullSubtitle={person.Role}
              fullDescription={person.Description}
              socials={person.Socials.map((social: SocialObj) => ({
                icon: social.type,
                href: social.url,
              }))}
            />
          ))}
        </div>
      </div>
      <CallToActionSection
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
      />
    </div>
  );
}
