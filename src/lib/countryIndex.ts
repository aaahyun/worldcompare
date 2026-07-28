import "server-only";
import { getAllCountries } from "./countries";
import { routing } from "@/i18n/routing";

export interface CountryIndexEntry {
  slug: string;
  iso2: string;
  names: Record<string, string>;
}

/** Small static index (slug, iso2, per-locale names) for client-side search/pickers. */
export function getCountryIndex(): CountryIndexEntry[] {
  return getAllCountries().map((c) => ({
    slug: c.slug,
    iso2: c.iso2,
    names: Object.fromEntries(routing.locales.map((l) => [l, c.names[l] ?? c.names.en])),
  }));
}
