"use client";

import { useLocale } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import { PopulationFigureChart } from "@/lib/charts/populationChart";
import { AreaOverlayChart } from "@/lib/charts/areaChart";
import { ClimateLineChart, type ClimateSeries } from "@/lib/charts/climateChart";
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

  if (homeIso2 === null) return <ChartSkeleton height={194} />;
  if (!home || isSameCountry) return null;

  return (
    <PopulationFigureChart
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
          geometryPath: target.geometryPath,
        },
        {
          label: areaLabel(home, home.areaKm2),
          areaKm2: home.areaKm2,
          colorVar: "--color-country-home",
          geometryPath: home.geometryPath,
        },
      ]}
    />
  );
}

/**
 * Renders immediately with just the viewed country's line (no skeleton —
 * that data is already known server-side), then layers the home country's
 * line in once home-country detection resolves. Works for both temperature
 * and precipitation via the `metric` prop.
 */
export function PersonalizedClimateChart({
  metric,
  title,
  unit,
  monthLabels,
}: {
  metric: "temp" | "precip";
  title: string;
  unit: string;
  monthLabels: string[];
}) {
  const locale = useLocale();
  const { home, target, isSameCountry } = useCountryCompare();

  const valuesFor = (d: { tempHighC?: number[]; precipMm?: number[] }) =>
    metric === "temp" ? d.tempHighC : d.precipMm;

  const targetValues = valuesFor(target);
  if (!targetValues) return null;

  const series: ClimateSeries[] = [
    { label: name(target, locale), values: targetValues, colorVar: "--color-country-target" },
  ];

  const homeValues = home ? valuesFor(home) : undefined;
  if (home && !isSameCountry && homeValues) {
    series.push({
      label: name(home, locale),
      values: homeValues,
      colorVar: "--color-country-home",
      dashed: true,
    });
  }

  return <ClimateLineChart title={title} unit={unit} monthLabels={monthLabels} series={series} />;
}
