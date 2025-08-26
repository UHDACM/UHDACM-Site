
import { StrapiPicture } from "../../types";
import { ProduceCMSResourceURL } from "../../tools";



/**
 * Given strapi picture, try to get the URL for a specific format
 * auto formats the url using `ProduceCMSResourceURL`.
 * @param img 
 * @param format 
 * @returns 
 */
export function TryGetImageFormatUrl(img: StrapiPicture, format: keyof StrapiPicture["formats"]) {
  let url: string = '';
  if (!img) return undefined;
  if (img.formats && img.formats[format]) {
    url = img.formats[format].url;
  } else {
    url = img.url;
  }

  const resourceURL = ProduceCMSResourceURL(url) || undefined;
  return resourceURL;
}
