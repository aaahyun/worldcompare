"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import {
  areaSentence,
  gdpPerCapitaSentence,
  populationSentence,
  temperatureSentence,
  type ComparableCountry,
} from "@/lib/compare";
import type { CompareDatum } from "@/lib/compareDataset";

function toComparable(d: CompareDatum, locale: string): ComparableCountry {
  return {
    name: d.names[locale] ?? d.names.en,
    population: d.population,
    areaKm2: d.areaKm2,
    gdpPerCapitaUsd: d.gdpPerCapitaUsd,
    tempHighC: d.tempHighC,
  };
}

export function PersonalizedSentence({
  metric,
  monthIndex,
}: {
  metric: "population" | "area" | "gdpPerCapita" | "temperature";
  monthIndex?: number;
}) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) {
    return <span className="inline-block h-4 w-full max-w-md animate-pulse rounded bg-neutral-200" />;
  }
  if (!home || isSameCountry) return null;

  const targetC = toComparable(target, locale);
  const homeC = toComparable(home, locale);

  let sentence: string | null = null;
  if (metric === "population") sentence = populationSentence(targetC, homeC, locale, t);
  if (metric === "area") sentence = areaSentence(targetC, homeC, locale, t);
  if (metric === "gdpPerCapita") sentence = gdpPerCapitaSentence(targetC, homeC, locale, t);
  if (metric === "temperature") {
    sentence = temperatureSentence(targetC, homeC, locale, t, monthIndex ?? new Date().getMonth());
  }

  if (!sentence) return null;
  return <p className="text-sm text-content-secondary">{sentence}</p>;
}
