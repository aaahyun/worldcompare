import fs from "node:fs";
import path from "node:path";
import { countrySchema, type Country } from "../../src/lib/schema";
import { countryList } from "./countryList";
import { manualOverrides } from "./manualOverrides";
import { getBaseInfo } from "./sources/worldCountries";
import { fetchWorldBankIndicators } from "./sources/worldBank";
import { fetchCapitalGeo } from "./sources/capitalGeo";
import { fetchClimateNormals } from "./sources/climate";

const OUT_DIR = path.join(process.cwd(), "data", "countries");
const RETRIEVED = new Date().toISOString().slice(0, 7); // "YYYY-MM"
const SNAPSHOT_DATE = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

const src = (name: string, url: string) => ({ name, url, retrieved: RETRIEVED });

// World Bank returns many decimal places of floating-point noise (e.g.
// 82.1080487804878) — round to what's actually meaningful for display.
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round0(n: number): number {
  return Math.round(n);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

/**
 * happiness_index and livability_rank are hand-curated directly into the output JSON
 * (see manualOverrides.ts header) — this pipeline has no source for them. Re-running
 * ingest must not wipe that data, so an existing file's values are carried forward.
 */
function readExistingExtras(slug: string): {
  fields: Pick<Country, "happiness_index" | "livability_rank">;
  sources: Partial<Country["sources"]>;
} {
  const file = path.join(OUT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return { fields: {}, sources: {} };
  const existing = JSON.parse(fs.readFileSync(file, "utf-8")) as Partial<Country>;
  return {
    fields: {
      happiness_index: existing.happiness_index,
      livability_rank: existing.livability_rank,
    },
    sources: {
      ...(existing.sources?.happiness_index && { happiness_index: existing.sources.happiness_index }),
      ...(existing.sources?.livability_rank && { livability_rank: existing.sources.livability_rank }),
    },
  };
}

async function buildCountry(
  entry: (typeof countryList)[number],
  capitalGeo: Awaited<ReturnType<typeof fetchCapitalGeo>>
): Promise<Country> {
  const { slug, iso2, iso3 } = entry;

  const override = manualOverrides[slug];
  if (!override) {
    throw new Error(`No manual override entry for "${slug}" — add one to manualOverrides.ts`);
  }

  const base = getBaseInfo(iso2);
  const wb = override.economicOverride
    ? {
        population: override.economicOverride.population,
        gdpNominalUsd: override.economicOverride.gdpNominalUsd,
        gdpPerCapitaUsd: override.economicOverride.gdpPerCapitaUsd,
        lifeExpectancy: null,
        urbanizationPct: null,
      }
    : await fetchWorldBankIndicators(iso3);
  const capital = capitalGeo.get(iso2);
  if (!capital) throw new Error(`No Wikidata capital found for ${slug} (${iso2})`);
  const climate = await fetchClimateNormals(capital.lat, capital.lng);
  const extras = readExistingExtras(slug);

  return countrySchema.parse({
    ...extras.fields,
    slug,
    iso2,
    iso3,
    names: { en: base.nameEn, ko: override.namesKoOverride ?? base.nameKo ?? override.namesKoFallback },
    capital: {
      names: { en: capital.nameEn, ko: override.capitalNameKo },
      lat: capital.lat,
      lng: capital.lng,
    },
    continent: base.continent,
    area_km2: base.areaKm2,
    population: wb.population,
    gdp_nominal_usd: { value: round0(wb.gdpNominalUsd.value), year: wb.gdpNominalUsd.year },
    gdp_per_capita_usd: {
      value: round1(wb.gdpPerCapitaUsd.value),
      year: wb.gdpPerCapitaUsd.year,
    },
    median_age: override.medianAge ?? undefined,
    life_expectancy: wb.lifeExpectancy ? round1(wb.lifeExpectancy) : undefined,
    urbanization_pct: wb.urbanizationPct ? round1(wb.urbanizationPct) : undefined,
    religions: override.religions ?? undefined,
    languages: {
      official: override.languagesOfficial,
      english_proficiency: override.englishProficiency,
    },
    industries: override.industries ?? undefined,
    currency: {
      code: base.currencyCode,
      usd_rate_snapshot: override.currencyUsdRateSnapshot ?? undefined,
      snapshot_date: override.currencyUsdRateSnapshot ? SNAPSHOT_DATE : undefined,
    },
    timezone: override.timezone,
    electricity: override.electricity,
    driving_side: override.drivingSide,
    calling_code: base.callingCode,
    emergency: override.emergency,
    climate,
    sources: {
      population: override.economicOverride?.source ?? src("World Bank Open Data", "https://data.worldbank.org"),
      area: src("world-countries (Wikidata-derived)", "https://github.com/mledoze/countries"),
      gdp_nominal_usd:
        override.economicOverride?.source ?? src("World Bank Open Data", "https://data.worldbank.org"),
      gdp_per_capita_usd:
        override.economicOverride?.source ?? src("World Bank Open Data", "https://data.worldbank.org"),
      religions: src("Manual curation (Pew Research)", "https://www.pewresearch.org"),
      industries: src("Manual curation (CIA World Factbook)", "https://www.cia.gov/the-world-factbook/"),
      climate: src("Open-Meteo Historical Weather API", "https://open-meteo.com"),
      ...extras.sources,
    },
  });
}

async function main() {
  console.log(`Ingesting ${countryList.length} countries...`);

  const capitalGeo = await fetchCapitalGeo(countryList.map((c) => c.iso2));
  console.log(`Resolved ${capitalGeo.size}/${countryList.length} capitals via Wikidata.`);

  const failures: { slug: string; error: string }[] = [];

  // Concurrency 1: this network hangs on simultaneous connections to the same
  // host (see worldBank.ts) — one country's full API sequence at a time is
  // slower but reliable, and each step here is fast (well under a second).
  await mapWithConcurrency(countryList, 1, async (entry) => {
    try {
      const country = await buildCountry(entry, capitalGeo);
      fs.writeFileSync(
        path.join(OUT_DIR, `${entry.slug}.json`),
        JSON.stringify(country, null, 2) + "\n"
      );
      console.log(`  ok  ${entry.slug}`);
    } catch (err) {
      failures.push({ slug: entry.slug, error: err instanceof Error ? err.message : String(err) });
      console.error(`  FAIL ${entry.slug}: ${err instanceof Error ? err.message : err}`);
    }
  });

  console.log(`\n${countryList.length - failures.length}/${countryList.length} succeeded.`);
  if (failures.length > 0) {
    console.error("\nFailures:");
    for (const f of failures) console.error(`  ${f.slug}: ${f.error}`);
    process.exitCode = 1;
  }
}

main();
