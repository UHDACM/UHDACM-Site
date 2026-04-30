"use client";

import Button from "@/app/_components/Button/Button";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import PersonTileCarousel from "@/app/_components/PersonTileCarousel/PersonTileCarousel";
import StrapiRichTextRenderer from "@/app/_components/StrapiRichTextRenderer/StrapiRichTextRenderer";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";
import { DefaultCode, DefaultOpenInNewTab } from "@/app/_icons/Icons";
import useAnalytics from "@/app/_hooks/useAnalytics";
import MainHeroSection from "@/app/_sections/MainHeroSection/MainHeroSection";
import HeroSingleImage from "@/app/_sections/SplitHeroSection/HeroSingleImage/HeroSingleImage";
import {
  ProduceProjectDateText,
  generateProjectShareText,
} from "@/app/_utils/types/cms/cmsTypeTools";
import { isStrapiPicture } from "@shared/types/cms/CMSCheck";
import { SiteProject } from "@shared/types/cms/CMSTypes";
import styles from "./project.module.css";

function ShareProjectButton({ project }: { project: SiteProject }) {
  const public_env = usePublicEnv();
  return (
    <ShareButton
      copyText={generateProjectShareText(
        project,
        public_env.NEXT_PUBLIC_SELF_URL,
      )}
      replaceTextOnCopyString={"Copied Link"}
    />
  );
}

function ProjectLinkButton({
  href,
  label,
  event,
  slug,
  icon,
}: {
  href: string;
  label: string;
  event: "project_repo_click" | "project_demo_click";
  slug: string;
  icon: React.ReactNode;
}) {
  const { posthog } = useAnalytics();
  return (
    <Button
      href={href}
      target="_blank"
      onClick={() => posthog?.capture(event, { project: slug, href })}
      className={styles.linkButtonContent}
    >
      <span>{label}</span>
      {icon}
    </Button>
  );
}

export default function ProjectPageClientComponent({
  project,
}: {
  project: SiteProject;
}) {
  const people = project.people ?? [];
  const public_env = usePublicEnv();

  const buttons = (
    <div className={styles.buttonRow}>
      {project.repoUrl && (
        <ProjectLinkButton
          href={project.repoUrl}
          label="View Code"
          event="project_repo_click"
          slug={project.urlSlug}
          icon={<DefaultCode fontSize={"inherit"} />}
        />
      )}
      {project.demoUrl && (
        <ProjectLinkButton
          href={project.demoUrl}
          label="Live Demo"
          event="project_demo_click"
          slug={project.urlSlug}
          icon={<DefaultOpenInNewTab fontSize={"inherit"} />}
        />
      )}
      <ShareProjectButton project={project} />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <MainHeroSection
        spanText="PROJECT"
        title={project.name}
        subtitle={ProduceProjectDateText(project.dateStart, project.dateEnd)}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={
          isStrapiPicture(project.previewImage) ? (
            <HeroSingleImage image={project.previewImage} />
          ) : undefined
        }
        bottomContent={buttons}
      />

      <div className="SectionRoot">
        <div className="SectionInner">
          <div className={styles.projectDescription}>
            <h1 className="H1">About this Project</h1>
            {project.descriptionFull && (
              <StrapiRichTextRenderer content={project.descriptionFull} />
            )}
          </div>
        </div>
      </div>
      <div style={{ height: "6rem" }} />
      {people.length > 0 && (
        <div className={`SectionRoot ${styles.peopleSection}`}>
          <div className="SectionInner">
            <h1
              className="H1"
              style={{ textAlign: "center", marginBottom: "0.5rem" }}
            >
              The Builders
            </h1>
            <PersonTileCarousel
              people={people}
              cmsBaseUrl={public_env.NEXT_PUBLIC_CMS_URL}
            />
          </div>
        </div>
      )}
    </div>
  );
}
