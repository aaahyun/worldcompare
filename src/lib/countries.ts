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

export function toComparable(country: Country, locale: string): ComparableCountry {
  return {
    name: country.names[locale] ?? country.names.en,
    population: country.population.value,
    areaKm2: country.area_km2,
    gdpPerCapitaUsd: country.gdp_per_capita_usd.value,
    tempHighC: country.climate?.temp_high_c,
  };
}
