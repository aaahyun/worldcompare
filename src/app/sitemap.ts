import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs().sort();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({ url: `${siteUrl}/${locale}` });
    entries.push({ url: `${siteUrl}/${locale}/countries` });
    for (const slug of slugs) {
      entries.push({ url: `${siteUrl}/${locale}/country/${slug}` });
    }
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        entries.push({ url: `${siteUrl}/${locale}/compare/${slugs[i]}-vs-${slugs[j]}` });
      }
    }
  }

  return entries;
}
