import type { Site, SiteInput } from "./types";

export function toSiteInput(site: Site): SiteInput {
  return {
    code: site.code,
    name: site.name,
    manager: site.manager,
    phone: site.phone,
    address: site.address,
    note: site.note,
  };
}
