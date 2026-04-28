// Guards the produceDocumentObject dispatch order documented in vectorDBCheck:
// the checks are tried in sequence, and a loose one swallows everything after it.
import { describe, expect, it } from "vitest";
import {
  checkVectorDBPageMetadata,
  checkVectorDBProjectMetadata,
  checkVectorDBEventMetadata,
} from "./vectorDBCheck";
import {
  convertSiteProjectToPartialSiteProject,
  convertVectorDBMetadataToSafeMetadata,
  convertSafeMetadataToVectorDBMetadata,
} from "./vectorDBFuncs";
import { VectorDBProjectMetadata } from "./vectorDBTypes";
import { SiteProject } from "../cms/CMSTypes";

const project = {
  id: 1,
  urlSlug: "acm-site",
  name: "ACM Site",
  previewImage: undefined,
  dateStart: "2026-01-05T00:00:00.000Z",
  descriptionShort: "The club website.",
  descriptionFull: [] as any,
  repoUrl: "https://github.com/UHDACM/site",
  people: [{ name: "Ada" }, { name: "Grace" }],
} as unknown as SiteProject;

const meta: VectorDBProjectMetadata = {
  collection: "project",
  project: convertSiteProjectToPartialSiteProject(
    project,
    "https://cms.example",
    "https://uhdacm.org",
  ),
};

describe("project vector metadata", () => {
  it("builds the project url in one place", () => {
    expect(meta.project.url).toBe("https://uhdacm.org/projects/acm-site");
    expect(meta.project.participantNames).toEqual(["Ada", "Grace"]);
    // ongoing project: no end date emitted at all
    expect("dateEnd" in meta.project).toBe(false);
  });

  it("is NOT swallowed by the page check that runs first", () => {
    expect(() => checkVectorDBPageMetadata(meta)).toThrow();
    expect(() => checkVectorDBEventMetadata(meta)).toThrow();
    expect(() => checkVectorDBProjectMetadata(meta)).not.toThrow();
  });

  it("does not swallow other collections", () => {
    expect(() =>
      checkVectorDBProjectMetadata({ collection: "qna", project: meta.project }),
    ).toThrow();
  });

  it("survives the chroma safe-metadata round trip", () => {
    const safe = convertVectorDBMetadataToSafeMetadata(meta);
    expect(typeof safe.project).toBe("string");
    const back = convertSafeMetadataToVectorDBMetadata(safe);
    expect(() => checkVectorDBProjectMetadata(back)).not.toThrow();
  });

  it("page-projects metadata still reads as a page", () => {
    expect(() =>
      checkVectorDBPageMetadata({
        collection: "page-projects",
        url: "https://uhdacm.org/projects",
        actions: [{ label: "Join Projects", href: "https://forms.example" }],
      }),
    ).not.toThrow();
  });
});
