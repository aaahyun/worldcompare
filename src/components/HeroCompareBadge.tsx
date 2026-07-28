"use client";

import { useTranslations } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import { ratioDescriptor } from "@/lib/compare";
import { flagEmoji } from "@/lib/homeCountry";

const METRIC_KEY = {
  population: "population",
  area: "areaKm2",
  gdpPerCapita: "gdpPerCapitaUsd",
} as const;

export function HeroCompareBadge({ metric }: { metric: keyof typeof METRIC_KEY }) {
  const t = useTranslations("compare");
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) {
    return <span className="inline-block h-5 w-16 animate-pulse rounded-full bg-neutral-200" />;
  }
  if (!home || isSameCountry) return null;

  const key = METRIC_KEY[metric];
  const ratio = target[key] / home[key];

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-country-home-soft px-2 py-0.5 text-xs font-medium text-content-secondary">
      {flagEmoji(home.iso2)} {ratioDescriptor(ratio, t)}
    </span>
  );
}
