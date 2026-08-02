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
  precipMm?: number[];
  /** Simplified real border outline, normalized to viewBox "0 0 100 100". */
  geometryPath?: string;
  medianAge?: number;
  lifeExpectancy?: number;
  urbanizationPct?: number;
  happinessIndex?: { score: number; rank: number; outOf: number };
  livabilityRank?: { rank: number; outOf: number };
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
    precipMm: c.climate?.precip_mm,
    geometryPath: c.geometry_svg,
    medianAge: c.median_age,
    lifeExpectancy: c.life_expectancy,
    urbanizationPct: c.urbanization_pct,
    happinessIndex: c.happiness_index
      ? { score: c.happiness_index.score, rank: c.happiness_index.rank, outOf: c.happiness_index.out_of }
      : undefined,
    livabilityRank: c.livability_rank
      ? { rank: c.livability_rank.rank, outOf: c.livability_rank.out_of }
      : undefined,
  }));
}
