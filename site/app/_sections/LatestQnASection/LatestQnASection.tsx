import { fetchCMS } from "@/app/_utils/cms";
import { isValidQnA } from "@/app/_utils/validation";
import MainHeroSection from "../MainHeroSection/MainHeroSection";
import CoolImage from "@/app/_components/CoolImage/CoolImage";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import Button from "@/app/_components/Button/Button";
import { DefaultChevronRight, DefaultSearch } from "@/app/_icons/Icons";

export default async function LatestQnASection({ reverseOnDesktop }: { reverseOnDesktop?: boolean }) {
  const res = await fetchCMS("qnas", {
    sort: "uploadDate:desc",
    "pagination[limit]": 1,
    'populate[0]': 'thumbnail'
  });

  if (!res || !res.data || res.data.length === 0) {
    return null;
  }

  const qna = res?.data[0];

  if (!qna || !isValidQnA(qna)) {
    return null;
  }

  return <MainHeroSection
    title={`Watch our QnA\nwith ${qna.featuredGuests}`}
    titleClassName="H1"
    subtitle={`${qna.descriptionShort}`}
    reverseOrder={reverseOnDesktop}
    leftStyle={{ flex: 1 }}
    rightStyle={{ flex: 1 }}
    rightContent={<CoolImage src={`${ProduceCMSResourceURL(qna.thumbnail?.url)}`} />}
    bottomContent={
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "0.5rem",
          marginTop: "0.5rem",
          flexWrap: 'wrap'
        }}
      >
        <Button href="/qnas">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              fontWeight: 800,
            }}
          >
            <DefaultSearch fontSize={"inherit"} strokeWidth={"0.20rem"} />
            <span style={{ fontWeight: 500 }}>View all QnAs</span>
          </div>
        </Button>
        <Button
          href={qna.videoLink}
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
            <span style={{ fontWeight: 500 }}>Watch Recent QnA</span>
            <DefaultChevronRight
              fontSize={"inherit"}
              style={{ marginRight: "-0.25rem" }}
              strokeWidth={"0.20rem"}
            />
          </div>
        </Button>
      </div>
    }
  />;
}