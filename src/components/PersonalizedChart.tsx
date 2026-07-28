"use client";

import { useLocale } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import { PopulationBarChart } from "@/lib/charts/populationChart";
import { AreaOverlayChart } from "@/lib/charts/areaChart";
import { ClimateLineChart } from "@/lib/charts/climateChart";
import { formatCompact } from "@/lib/compare";

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full max-w-[480px] animate-pulse rounded-lg bg-neutral-100"
      style={{ height }}
    />
  );
}

function name(d: { names: Record<string, string> }, locale: string): string {
  return d.names[locale] ?? d.names.en;
}

export function PersonalizedPopulationChart() {
  const locale = useLocale();
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) return <ChartSkeleton height={88} />;
  if (!home || isSameCountry) return null;

  return (
    <PopulationBarChart
      data={[
        {
          label: `${name(target, locale)} · ${formatCompact(target.population, locale)}`,
          value: target.population,
          colorVar: "--color-country-target",
        },
        {
          label: `${name(home, locale)} · ${formatCompact(home.population, locale)}`,
          value: home.population,
          colorVar: "--color-country-home",
        },
      ]}
    />
  );
}

export function PersonalizedAreaChart() {
  const locale = useLocale();
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) return <ChartSkeleton height={240} />;
  if (!home || isSameCountry) return null;

  const areaLabel = (d: { names: Record<string, string> }, areaKm2: number) =>
    `${name(d, locale)} · ${new Intl.NumberFormat(locale).format(areaKm2)} km²`;

  return (
    <AreaOverlayChart
      data={[
        {
          label: areaLabel(target, target.areaKm2),
          areaKm2: target.areaKm2,
          colorVar: "--color-country-target",
        },
        {
          label: areaLabel(home, home.areaKm2),
          areaKm2: home.areaKm2,
          colorVar: "--color-country-home",
        },
      ]}
    />
  );
}

export function PersonalizedClimateChart({ monthLabels }: { monthLabels: string[] }) {
  const locale = useLocale();
  const { home, target, homeIso2, isSameCountry } = useCountryCompare();

  if (homeIso2 === null) return <ChartSkeleton height={180} />;
  if (!home || isSameCountry || !home.tempHighC || !target.tempHighC) return null;

  return (
    <ClimateLineChart
      monthLabels={monthLabels}
      series={[
        { label: name(target, locale), tempHighC: target.tempHighC, colorVar: "--color-country-target" },
        {
          label: name(home, locale),
          tempHighC: home.tempHighC,
          colorVar: "--color-country-home",
          dashed: true,
        },
      ]}
    />
  );
}
