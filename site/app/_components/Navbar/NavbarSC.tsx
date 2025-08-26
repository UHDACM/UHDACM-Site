// server component. Used to render logo and pass it in

import { fetchCMS } from "@/app/_utils/cms";
import { ProduceCMSResourceURL } from "@/app/_utils/tools";
import { isValidSiteInfo } from "@/app/_utils/types/cms/cmsTypeValidation";
import Navbar from "./Navbar";

export default async function NavbarSC() {
  let logoURL: string | undefined = undefined;
  const res = await fetchCMS("site-info", { populate: "*" });
  if (res) {
    const data = res.data;
    if (isValidSiteInfo(data)) {
      logoURL = ProduceCMSResourceURL(data.logo.url);
    }
  }

  console.log('its the navbar');

  return <Navbar logoURL={logoURL} />;
}
