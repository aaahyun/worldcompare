"use client";

import { useTranslations } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import { flagEmoji } from "@/lib/homeCountry";
import type { CompareDatum } from "@/lib/compareDataset";

interface Row {
  label: string;
  target: string | null;
  home: string | null;
}

function buildRows(target: CompareDatum, home: CompareDatum, t: ReturnType<typeof useTranslations>): Row[] {
  const rows: Row[] = [];

  if (target.medianAge !== undefined || home.medianAge !== undefined) {
    rows.push({
      label: t("demographics.medianAge"),
      target: target.medianAge?.toString() ?? null,
      home: home.medianAge?.toString() ?? null,
    });
  }
  if (target.lifeExpectancy !== undefined || home.lifeExpectancy !== undefined) {
    rows.push({
      label: t("demographics.lifeExpectancy"),
      target: target.lifeExpectancy?.toString() ?? null,
      home: home.lifeExpectancy?.toString() ?? null,
    });
  }
  if (target.urbanizationPct !== undefined || home.urbanizationPct !== undefined) {
    rows.push({
      label: t("demographics.urbanization"),
      target: target.urbanizationPct !== undefined ? `${target.urbanizationPct}%` : null,
      home: home.urbanizationPct !== undefined ? `${home.urbanizationPct}%` : null,
    });
  }
  if (target.happinessIndex || home.happinessIndex) {
    const format = (h?: CompareDatum["happinessIndex"]) =>
      h
        ? `${h.score.toFixed(2)} (${t("demographics.happinessIndexOutOf", { rank: h.rank, outOf: h.outOf })})`
        : null;
    rows.push({
      label: t("demographics.happinessIndex"),
      target: format(target.happinessIndex),
      home: format(home.happinessIndex),
    });
  }
  if (target.livabilityRank || home.livabilityRank) {
    const format = (r?: CompareDatum["livabilityRank"]) =>
      r ? t("demographics.livabilityRankOutOf", { rank: r.rank, outOf: r.outOf }) : null;
    rows.push({
      label: t("demographics.livabilityRank"),
      target: format(target.livabilityRank),
      home: format(home.livabilityRank),
    });
  }

  return rows;
}

export function DemographicsCompareTable() {
  const t = useTranslations("country");
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) {
    return <div className="h-40 w-full max-w-md animate-pulse rounded-lg bg-neutral-100" />;
  }
  if (!home || isSameCountry) return null;

  const rows = buildRows(target, home, t);
  if (rows.length === 0) return null;

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="border-b border-neutral-100 pb-3">
          <p className="text-sm text-content-tertiary">{row.label}</p>
          <div className="mt-1 grid grid-cols-2 gap-x-3 text-base font-medium">
            <span>
              {flagEmoji(target.iso2)} {row.target ?? "—"}
            </span>
            <span className="border-l border-neutral-200 pl-3">
              {flagEmoji(home.iso2)} {row.home ?? "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
