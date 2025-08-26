import PersonTile from "@/app/_components/PersonTile/PersonTile";
import { fetchCMS } from "@/app/_utils/cms";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import { Person, SocialObj } from "@/app/_utils/types";
import { isValidLeadership } from "@/app/_utils/types/cms/cmsTypeValidation";
import { isPerson } from "@/app/_utils/validation";

export default async function LeadershipSection({ sectionID }: { sectionID?: string }) {
  const res = await fetchCMS("leadership", {
    "populate[people][populate]": "*",
  }, ['people']);

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
    <div className={"SectionRoot"} style={{margin: '4rem 0rem'}} id={sectionID}>
      <div className={"SectionInner"}>
        <h1 className={`H1`} style={{ whiteSpace: "pre-line", marginBottom: '0.5rem' }}>
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
    </div>
  );
}
