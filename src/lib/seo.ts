import { routing } from "@/i18n/routing";
import { siteUrl } from "./site";

/** hreflang alternates (+x-default) for a path that excludes the locale segment, e.g. "/country/iceland". */
export function buildAlternateLanguages(pathWithoutLocale: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteUrl}/${l}${pathWithoutLocale}`;
  }
  languages["x-default"] = `${siteUrl}/${routing.defaultLocale}${pathWithoutLocale}`;
  return languages;
}

export function canonicalUrl(locale: string, pathWithoutLocale: string): string {
  return `${siteUrl}/${locale}${pathWithoutLocale}`;
}
