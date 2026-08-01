import "server-only";
import fs from "node:fs";
import path from "node:path";
import { countrySchema, type Country } from "./schema";
import type { ComparableCountry } from "./compare";

const DATA_DIR = path.join(process.cwd(), "data", "countries");

let cache: Map<string, Country> | null = null;

function loadAll(): Map<string, Country> {
  if (cache) return cache;

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const map = new Map<string, Country>();

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
    const result = countrySchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`Invalid country data in ${file}: ${result.error.message}`);
    }
    map.set(result.data.slug, result.data);
  }

  cache = map;
  return map;
}

export function getAllCountries(): Country[] {
  return Array.from(loadAll().values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getCountry(slug: string): Country | undefined {
  return loadAll().get(slug);
}

export function getAllSlugs(): string[] {
  return Array.from(loadAll().keys());
}

/** Picks countries to surface as "compare with" links on a country page: closest by
 * population within the same continent first, filled out with the closest by
 * population overall. Keeps suggestions relevant while guaranteeing `count` results
 * even for continents with very few covered countries (e.g. Oceania). */
export function getRelatedCompareSlugs(slug: string, count = 4): string[] {
  const country = getCountry(slug);
  if (!country) return [];

  const others = getAllCountries().filter((c) => c.slug !== slug);
  const byPopulationDistance = (list: Country[]) =>
    [...list].sort(
      (a, b) =>
        Math.abs(a.population.value - country.population.value) -
        Math.abs(b.population.value - country.population.value)
    );

  const picks = byPopulationDistance(others.filter((c) => c.continent === country.continent)).slice(
    0,
    count
  );

  if (picks.length < count) {
    for (const c of byPopulationDistance(others)) {
      if (picks.length >= count) break;
      if (picks.some((p) => p.slug === c.slug)) continue;
      picks.push(c);
    }
  }

  return picks.map((c) => c.slug);
}

export function toComparable(country: Country, locale: string): ComparableCountry {
  return {
    name: country.names[locale] ?? country.names.en,
    population: country.population.value,
    areaKm2: country.area_km2,
    gdpPerCapitaUsd: country.gdp_per_capita_usd.value,
    tempHighC: country.climate?.temp_high_c,
  };
}
