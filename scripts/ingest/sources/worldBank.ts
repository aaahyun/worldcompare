import { fetchWithRetry } from "./fetchRetry";

interface WorldBankObservation {
  date: string;
  value: number | null;
}

const CURRENT_YEAR = new Date().getUTCFullYear();

/**
 * Most recent non-null observation for one World Bank indicator, for one country.
 *
 * Uses an explicit date range rather than the API's own `mrnev=1` ("most recent
 * non-empty value") flag — that flag started returning HTTP 400 for every
 * indicator/country combination as of mid-2026, apparently a bug on the World
 * Bank API's side. Fetching the last decade and picking the first non-null
 * observation client-side (the API returns rows newest-first) reproduces the
 * same result without depending on the broken flag.
 */
async function fetchIndicator(
  iso3: string,
  indicator: string
): Promise<{ value: number; year: number } | null> {
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&date=${CURRENT_YEAR - 10}:${CURRENT_YEAR}&per_page=20`;
  const res = await fetchWithRetry(url, { headers: { Accept: "application/json" } });
  // World Bank prefixes responses with a UTF-8 BOM.
  const body = (await res.text()).replace(/^﻿/, "");
  const parsed = JSON.parse(body) as [unknown, WorldBankObservation[] | null];
  const observations = parsed[1];
  if (!observations || observations.length === 0) return null;
  const obs = observations.find((o) => o.value !== null);
  if (!obs || obs.value === null) return null;
  return { value: obs.value, year: Number(obs.date) };
}

export interface WorldBankIndicators {
  population: { value: number; year: number };
  gdpNominalUsd: { value: number; year: number };
  gdpPerCapitaUsd: { value: number; year: number };
  lifeExpectancy: number | null;
  urbanizationPct: number | null;
}

const INDICATORS = {
  population: "SP.POP.TOTL",
  gdpNominalUsd: "NY.GDP.MKTP.CD",
  gdpPerCapitaUsd: "NY.GDP.PCAP.CD",
  lifeExpectancy: "SP.DYN.LE00.IN",
  urbanizationPct: "SP.URB.TOTL.IN.ZS",
} as const;

export async function fetchWorldBankIndicators(iso3: string): Promise<WorldBankIndicators> {
  // Sequential, not Promise.all: concurrent requests to the same host have been
  // observed to hang indefinitely in some sandboxed network environments, while
  // one-at-a-time requests consistently resolve in well under a second.
  const population = await fetchIndicator(iso3, INDICATORS.population);
  const gdpNominalUsd = await fetchIndicator(iso3, INDICATORS.gdpNominalUsd);
  const gdpPerCapitaUsd = await fetchIndicator(iso3, INDICATORS.gdpPerCapitaUsd);
  const lifeExpectancy = await fetchIndicator(iso3, INDICATORS.lifeExpectancy);
  const urbanizationPct = await fetchIndicator(iso3, INDICATORS.urbanizationPct);

  if (!population) throw new Error(`No population data for ${iso3}`);
  if (!gdpNominalUsd) throw new Error(`No GDP data for ${iso3}`);
  if (!gdpPerCapitaUsd) throw new Error(`No GDP per capita data for ${iso3}`);

  return {
    population,
    gdpNominalUsd,
    gdpPerCapitaUsd,
    lifeExpectancy: lifeExpectancy?.value ?? null,
    urbanizationPct: urbanizationPct?.value ?? null,
  };
}
