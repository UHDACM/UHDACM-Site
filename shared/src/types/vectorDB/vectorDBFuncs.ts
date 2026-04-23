import { TryGetImageFormatPath } from "../cms/CMSFuncs";
import { SiteEvent, SiteProject } from "../cms/CMSTypes";
import { ObjectUnknown } from "../general/generalTypes";
import { checkVectorDBBaseMetadata } from "./vectorDBCheck";
import { PartialSiteEvent, PartialSiteProject, SafeMetadata, VectorDBBaseMetadata } from "./vectorDBTypes";

export const convertSiteEventToPartialSiteEvent = (
  event: SiteEvent,
  cmsURL: string,
  siteURL: string
) => {
  const partialSiteEvent: PartialSiteEvent = {
    name: event.name,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    descriptionShort: event.descriptionShort,
    hasGallery: event.gallery != undefined,
    location: event.location,
    organizationNames: (event.organizations || []).map((v) => v.name),
    url: siteURL+'/events/'+event.urlSlug,
  };

  const previewImageUrl = event.previewImage
    ? TryGetImageFormatPath(event.previewImage, "thumbnail", cmsURL)
    : undefined;
  if (previewImageUrl) {
    partialSiteEvent.previewImageUrl = previewImageUrl;
  }
  return partialSiteEvent;
};

export const convertSiteProjectToPartialSiteProject = (
  project: SiteProject,
  cmsURL: string,
  siteURL: string
) => {
  const partialSiteProject: PartialSiteProject = {
    name: project.name,
    dateStart: project.dateStart,
    descriptionShort: project.descriptionShort,
    // Keep this the single place project URLs are built, the same way the
    // event converter above is the only place event URLs are built.
    url: siteURL+'/projects/'+project.urlSlug,
  };

  if (project.dateEnd) {
    partialSiteProject.dateEnd = project.dateEnd;
  }
  if (project.repoUrl) {
    partialSiteProject.repoUrl = project.repoUrl;
  }
  if (project.demoUrl) {
    partialSiteProject.demoUrl = project.demoUrl;
  }
  if (project.people && project.people.length > 0) {
    partialSiteProject.participantNames = project.people.map((p) => p.name);
  }

  const previewImageUrl = project.previewImage
    ? TryGetImageFormatPath(project.previewImage, "thumbnail", cmsURL)
    : undefined;
  if (previewImageUrl) {
    partialSiteProject.previewImageUrl = previewImageUrl;
  }
  return partialSiteProject;
};

export const convertVectorDBMetadataToSafeMetadata = (obj: VectorDBBaseMetadata): SafeMetadata => {
  const newObject: SafeMetadata = {};

  for (const [key, val] of Object.entries(obj)) {
    if (typeof(val) != 'object') {
      // if value is not an object (or array) store as normal
      newObject[key] = val;
      continue;
    }
    newObject[key] = JSON.stringify(val);
  }

  return newObject;
}

/**
 * Converts safe metadata to vectorDB metadata obj.
 * 
 * Note: takes in regular object, as ChromaDB metadata is not compatible with safe metadata
 * 
 * @throws error if object is not a valid vectorDB metadata object. see `vectorDBTypes` for more
 * 
 * @param obj 
 * @returns 
 */
export const convertSafeMetadataToVectorDBMetadata = (obj: Object): VectorDBBaseMetadata => {
  const newObject: ObjectUnknown = {};

  for (const [key, val] of Object.entries(obj)) {
    try {
      // Attempt to parse the value as JSON
      const parsedValue = JSON.parse(val as string);
      newObject[key] = parsedValue;
    } catch {
      // If parsing fails, keep the value as is
      newObject[key] = val;
    }
  }

  checkVectorDBBaseMetadata(newObject);
  return newObject;
};

