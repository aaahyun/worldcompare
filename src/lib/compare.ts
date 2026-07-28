import { eunNeun, gwaWa } from "./josa";

export type Translator = (
  key: string,
  values?: Record<string, string | number>
) => string;

/** Minimal shape both the server (full Country) and client (trimmed compare
 * dataset) sides can build, so the comparison math/templates have one source. */
export interface ComparableCountry {
  name: string;
  population: number;
  areaKm2: number;
  gdpPerCapitaUsd: number;
  tempHighC?: number[];
}

function roundTo(n: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(n * factor) / factor;
}

export function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatUSD(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Ratio (target/home) → translated qualitative description, per PRD §4.1:
 * 0.5x–2x reads as "similar", otherwise as an explicit multiple or percentage.
 */
export function ratioDescriptor(ratio: number, t: Translator): string {
  if (ratio >= 0.5 && ratio <= 2) return t("ratioSimilar");
  if (ratio > 2) return t("ratioMultiple", { n: roundTo(ratio, 1) });
  return t("ratioPercent", { n: roundTo(ratio * 100, 1) });
}

export function populationSentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator
): string {
  const ratio = target.population / home.population;
  return t("templates.population", {
    target: target.name,
    home: home.name,
    value: formatCompact(target.population, locale),
    homeValue: formatCompact(home.population, locale),
    ratio: ratioDescriptor(ratio, t),
  });
}

export function gdpPerCapitaSentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator
): string {
  const ratio = target.gdpPerCapitaUsd / home.gdpPerCapitaUsd;
  return t("templates.gdpPerCapita", {
    target: target.name,
    home: home.name,
    value: formatUSD(target.gdpPerCapitaUsd, locale),
    homeValue: formatUSD(home.gdpPerCapitaUsd, locale),
    ratio: ratioDescriptor(ratio, t),
  });
}

export function areaSentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator
): string {
  const ratio = target.areaKm2 / home.areaKm2;

  const values = {
    target: target.name,
    home: home.name,
    targetTopic: locale === "ko" ? eunNeun(target.name) : target.name,
    homeGwaWa: locale === "ko" ? gwaWa(home.name) : home.name,
  };

  if (ratio >= 0.67 && ratio <= 1.5) {
    return t("templates.areaSimilar", values);
  }
  if (ratio > 1.5) {
    return t("templates.areaMultiple", { ...values, x: roundTo(ratio, 1) });
  }
  return t("templates.areaFraction", { ...values, x: roundTo(1 / ratio, 1) });
}

function formatMonth(monthIndex: number, locale: string): string {
  if (locale === "ko") return String(monthIndex + 1);
  const date = new Date(Date.UTC(2024, monthIndex, 1));
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(date);
}

export function temperatureSentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator,
  monthIndex: number
): string | null {
  if (!target.tempHighC || !home.tempHighC) return null;

  const targetTemp = target.tempHighC[monthIndex];
  const homeTemp = home.tempHighC[monthIndex];
  const diff = targetTemp - homeTemp;

  return t("templates.temperature", {
    month: formatMonth(monthIndex, locale),
    target: target.name,
    home: home.name,
    t: roundTo(targetTemp, 1),
    diff: roundTo(Math.abs(diff), 1),
    direction: diff >= 0 ? t("higher") : t("lower"),
  });
}

export function bestTimeToVisit(
  country: ComparableCountry,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
): string | null {
  if (!country.tempHighC) return null;
  const highs = country.tempHighC;
  const peakIndex = highs.indexOf(Math.max(...highs));
  return t("bestTimeToVisit", {
    target: country.name,
    months: formatMonth(peakIndex, locale) + (locale === "ko" ? "월" : ""),
    temp: roundTo(highs[peakIndex], 1),
  });
}
