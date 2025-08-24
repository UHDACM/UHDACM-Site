import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
import { DefaultChevronRight, DefaultSearch } from "@/app/_icons/Icons";
import CoolImage from "../_components/CoolImage/CoolImage";
import Button from "../_components/Button/Button";
import FloatingImages from "../_components/FloatingImages/FloatingImages";
import styles from "./media.module.css";
import { fetchCMS } from "../_utils/cms";
import { isValidQnA } from "../_utils/validation";
import { ProduceCMSResourceURL } from "../_utils/tools";

export default async function Page() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="MEDIA"
        title={`Something about\nmedia here`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        addNavbarPadding={true}
        rightContent={<CoolImage src="/sjd.JPG" />}
      />
      <MainHeroSection
        title={`Our Memories in HD 4K IMAX`}
        titleClassName="H1"
        subtitle={`Something about our gallery and stuff like that.`}
        reverseOrder={true}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1, width: "100%" }}
        rightContent={
          <div className={`${styles.floatingImagesWrapper}`}>
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
          <Button style={{ marginTop: "0.5rem" }} href="/galleries">
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
      <MostRecentQnAHero />
      <MainHeroSection
        title={`Something about Newsletters`}
        titleClassName="H1"
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

async function MostRecentQnAHero() {
  const res = await fetchCMS("qnas", {
    sort: "UploadDate:desc",
    "pagination[limit]": 1,
    'populate[0]': 'Thumbnail'
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
    reverseOrder={false}
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
