import Button from "@/app/_components/Button/Button";
import CoolImage from "@/app/_components/CoolImage/CoolImage";
import {
  DefaultChevronRight,
  DefaultShareOutline,
} from "@/app/_icons/Icons";

// function ShareButton() {
//   return (
//     <Button>
//       <div
//         style={{
//           display: "flex",
//           gap: "0.25rem",
//           alignItems: "center",
//           fontWeight: 800,
//         }}
//       >
//         <span style={{ fontWeight: 500 }}>Share</span>
//         <DefaultShareOutline fontSize={"inherit"} strokeWidth={"0.15rem"} />
//       </div>
//     </Button>
//   );
// }
import CallToActionSection from "@/app/_sections/CallToActionSection/CallToActionSection";
import MainHeroSection from "@/app/_sections/MainHeroSection/MainHeroSection";
import GalleryGrid from "./_components/GalleryGrid";
import { fetchCMS } from "@/app/_utils/cms";
import { isStrapiPicture, isValidSiteEvent } from "@/app/_utils/validation";
import { StrapiPicture } from "@/app/_utils/types";
import Page404 from "@/app/not-found";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import { NavbarPadding } from "@/app/_pageRenderer/PageRenderer";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";

type EventPageParams = Promise<{
  galleryID: string;
}>;

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { galleryID } = await params;
  const res = await fetchCMS("events", {
    "populate[0]": "previewImage",
    "populate[1]": "gallery.media",
    "filters[urlSlug][$eq]": galleryID,
  });

  if (!res) {
    return <Galleries404 />;
  }

  const event = res.data[0];
  if (!isValidSiteEvent(event) || !event.gallery) {
    return <Galleries404 />;
  }

  const media = event.gallery.media || [];

  const validMedia: StrapiPicture[] = [];
  for (const pic of media) {
    if (isStrapiPicture(pic)) {
      validMedia.push(pic);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        position: "relative",
      }}
    >
      <NavbarPadding />
      <MainHeroSection
        spanText="GALLERY"
        title={`${event.name}`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={
          <CoolImage
            src={`${ProduceCMSResourceURL(event.previewImage?.url)}`}
          />
        }
        bottomContent={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ShareButton copyText={`${process.env.NEXT_PUBLIC_SELF_URL}/galleries/${event.urlSlug}`} replaceTextOnCopyString="Copied Gallery URL" />
          </div>
        }
      />

      <GalleryGrid media={validMedia} />

      <CallToActionSection
        title={`Show up, Schedule, Share`}
        subtitle="Your next step is your best step. Be sure to make it count!"
        actionComponent={
          <Button style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                fontWeight: 800,
              }}
            >
              <span style={{ fontWeight: 500 }}>Contact Us</span>
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

function Galleries404() {
  return (
    <Page404
      customMessage={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            gap: "0.5rem",
          }}
        >
          <h1 className="H4">Gallery not found</h1>
          <Button href="/galleries#search">Back to Galleries</Button>
        </div>
      }
    />
  );
}
