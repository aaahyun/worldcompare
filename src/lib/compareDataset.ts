import "server-only";
import { getAllCountries } from "./countries";
import { routing } from "@/i18n/routing";

export interface CompareDatum {
  slug: string;
  iso2: string;
  names: Record<string, string>;
  population: number;
  areaKm2: number;
  gdpPerCapitaUsd: number;
  tempHighC?: number[];
}

/**
 * Trimmed, client-shippable dataset for home-country personalization —
 * only the fields comparison math/templates need, not full country records
 * (sources, religions, etc. stay server-only and out of the client bundle).
 */
export function getCompareDataset(): CompareDatum[] {
  return getAllCountries().map((c) => ({
    slug: c.slug,
    iso2: c.iso2,
    names: Object.fromEntries(routing.locales.map((l) => [l, c.names[l] ?? c.names.en])),
    population: c.population.value,
    areaKm2: c.area_km2,
    gdpPerCapitaUsd: c.gdp_per_capita_usd.value,
    tempHighC: c.climate?.temp_high_c,
  }));
}
