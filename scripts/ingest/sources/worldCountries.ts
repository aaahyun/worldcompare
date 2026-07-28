import worldCountries from "world-countries";
import type { Continent } from "../../../src/lib/schema";

export interface BaseCountryInfo {
  nameEn: string;
  nameKo: string | null;
  areaKm2: number;
  currencyCode: string;
  callingCode: string;
  continent: Continent;
}

const REGION_MAP: Record<string, Continent> = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europe",
  Oceania: "oceania",
  Antarctic: "antarctica",
};

// "Americas" splits by subregion — world-countries has no single north/south field.
const SOUTH_AMERICA_SUBREGIONS = new Set(["South America"]);

function resolveContinent(region: string, subregion: string): Continent {
  if (region === "Americas") {
    return SOUTH_AMERICA_SUBREGIONS.has(subregion) ? "south_america" : "north_america";
  }
  const mapped = REGION_MAP[region];
  if (!mapped) throw new Error(`Unmapped world-countries region: "${region}"`);
  return mapped;
}

const byIso2 = new Map(worldCountries.map((c) => [c.cca2, c]));

export function getBaseInfo(iso2: string): BaseCountryInfo {
  const entry = byIso2.get(iso2);
  if (!entry) throw new Error(`world-countries has no entry for iso2 "${iso2}"`);

  const currencyCode = Object.keys(entry.currencies ?? {})[0];
  if (!currencyCode) throw new Error(`No currency listed for ${iso2}`);

  // A single suffix disambiguates a shared root (e.g. JP root "+8" + "1" -> "+81").
  // Multiple suffixes are regional area codes, not part of the country code
  // (e.g. CA/US root "+1" list hundreds of area codes) — use the root alone.
  const suffixes = entry.idd.suffixes ?? [];
  const callingCode = suffixes.length === 1 ? `${entry.idd.root}${suffixes[0]}` : entry.idd.root;

  return {
    nameEn: entry.name.common,
    nameKo: entry.translations?.kor?.common ?? null,
    areaKm2: entry.area,
    currencyCode,
    callingCode,
    continent: resolveContinent(entry.region, entry.subregion),
  };
}
