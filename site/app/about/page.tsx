import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
import PersonTile from "../_components/PersonTile/PersonTile";
import Button from "../_components/Button/Button";
import { fetchCMS } from "../_utils/cms";
import { isPerson } from "../_utils/validation";
import { Person, SocialObj } from "../_utils/types";
import { ProduceCMSResourceURL } from "../_utils/tools";
import { isValidLeadership } from "../_utils/types/cms/cmsTypeValidation";

export default async function Page() {
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
        addNavbarPadding={true}
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
      <Leadership />
      <CallToActionSection
        title={`Want to be\nan officer?`}
        subtitle="Your leadership journey starts here"
        actionComponent={
          <Button href='/join#become-an-officer'>
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

async function Leadership() {
  const res = await fetchCMS("leadership", {
    "populate[people][populate]": "*",
  });

  if (!res) {
    return;
  }

  const leadership = res.data;

  if (!isValidLeadership(leadership)) {
    return;
  }

  const people = leadership.people;

  const validPeople: Person[] = people.filter((person: any) => {
    if (!isPerson(person)) {
      return false;
    }
    return true;
  });

  return (
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
      id={'leadership'}
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
            img={`${ProduceCMSResourceURL(person.picture?.url)}`}
            previewTitle={person.nameShort}
            fullTitle={person.name}
            previewSubTitle={person.roleShort}
            fullSubtitle={person.role}
            fullDescription={person.description}
            socials={person.socials.map((social: SocialObj) => ({
              icon: social.type,
              href: social.url,
            }))}
          />
        ))}
      </div>
    </div>
  );
}
