'use server'

import PersonTileCarousel from "@/app/_components/PersonTileCarousel/PersonTileCarousel";
import { fetchCMS } from "@/app/_utils/cms";
import { Person } from "@shared/types/cms/CMSTypes";
import { isValidLeadership } from "@shared/types/cms/CMSCheck";
import { isPerson } from "@shared/types/cms/CMSCheck";
import { public_env_vars } from "@/app/_utils/public_env_vars";

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

  // const people = [...leadership.people, ...leadership.people, ...leadership.people, ...leadership.people];
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
        <h1 className={`H1`} style={{ whiteSpace: "pre-line", marginBottom: '0.5rem', textAlign: 'center' }}>
          Meet our Leadership
        </h1>
        <PersonTileCarousel
          people={validPeople}
          cmsBaseUrl={public_env_vars.NEXT_PUBLIC_CMS_URL}
        />
      </div>
    </div>
  );
}
