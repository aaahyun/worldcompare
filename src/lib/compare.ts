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

/** Compact GDP figure for headlines/descriptions (e.g. "$4.4T", "4.4조 달러"). */
export function formatGdpCompact(value: number, locale: string): string {
  if (locale === "ko") {
    const jo = value / 1e12;
    if (jo >= 1) return `${roundTo(jo, 1)}조 달러`;
    const eok = value / 1e8;
    if (eok >= 1) return `${roundTo(eok, 0)}억 달러`;
    return `${formatCompact(value, locale)} 달러`;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Locale display name for an ISO 639-1 language code (e.g. "ja" → "Japanese" / "일본어"). */
export function languageDisplayName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function populationDensity(country: ComparableCountry): number {
  return country.population / country.areaKm2;
}

export function formatDensity(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
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

export function gdpNominalSentence(
  target: { name: string; gdpNominalUsd: number },
  home: { name: string; gdpNominalUsd: number },
  locale: string,
  t: Translator
): string {
  const ratio = target.gdpNominalUsd / home.gdpNominalUsd;
  return t("templates.gdpNominal", {
    target: target.name,
    home: home.name,
    value: formatGdpCompact(target.gdpNominalUsd, locale),
    homeValue: formatGdpCompact(home.gdpNominalUsd, locale),
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

export function densitySentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator
): string {
  const targetDensity = populationDensity(target);
  const homeDensity = populationDensity(home);
  const ratio = targetDensity / homeDensity;
  return t("templates.density", {
    target: target.name,
    home: home.name,
    value: formatDensity(targetDensity, locale),
    homeValue: formatDensity(homeDensity, locale),
    ratio: ratioDescriptor(ratio, t),
  });
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

/** Year-round comparison (annual mean of monthly highs) — stable regardless of when the
 * static page was built, unlike a specific-month comparison. */
export function climateAnnualSentence(
  target: ComparableCountry,
  home: ComparableCountry,
  locale: string,
  t: Translator
): string | null {
  if (!target.tempHighC || !home.tempHighC) return null;
  const mean = (xs: number[]) => xs.reduce((sum, v) => sum + v, 0) / xs.length;
  const targetAvg = mean(target.tempHighC);
  const homeAvg = mean(home.tempHighC);
  const diff = targetAvg - homeAvg;
  return t("templates.climateAnnual", {
    target: target.name,
    home: home.name,
    t: roundTo(targetAvg, 1),
    homeT: roundTo(homeAvg, 1),
    diff: roundTo(Math.abs(diff), 1),
    direction: diff >= 0 ? t("higher") : t("lower"),
  });
}

export function religionSentence(
  target: { name: string; label: string; pct: number },
  home: { name: string; label: string; pct: number },
  t: Translator
): string {
  return t("templates.religion", {
    target: target.name,
    home: home.name,
    targetReligion: target.label,
    targetPct: roundTo(target.pct, 1),
    homeReligion: home.label,
    homePct: roundTo(home.pct, 1),
  });
}

export function languageSentence(
  target: { name: string; lang: string },
  home: { name: string; lang: string },
  t: Translator
): string {
  return t("templates.language", {
    target: target.name,
    home: home.name,
    targetLang: target.lang,
    homeLang: home.lang,
  });
}

export function drivingSideSentence(
  target: { name: string; side: string },
  home: { name: string; side: string },
  sameSide: boolean,
  locale: string,
  t: Translator
): string {
  const targetTopic = locale === "ko" ? eunNeun(target.name) : target.name;
  const homeTopic = locale === "ko" ? eunNeun(home.name) : home.name;
  return t(sameSide ? "templates.drivingSideSame" : "templates.drivingSideDiff", {
    target: sameSide && locale === "ko" ? gwaWa(target.name) : targetTopic,
    home: sameSide ? home.name : homeTopic,
    targetSide: target.side,
    homeSide: home.side,
  });
}

const TITLE_LIMITS: Record<string, number> = { ko: 30 };
const DEFAULT_TITLE_LIMIT = 60;

/** Metadata <title> per PRD length caps (30 chars for ko, 60 otherwise) — drops from
 * 4 metrics to 3 (metadata.titleShort) when the full template overflows the cap. */
export function buildCompareTitle(nameA: string, nameB: string, locale: string, t: Translator): string {
  const full = t("metadata.title", { a: nameA, b: nameB });
  const limit = TITLE_LIMITS[locale] ?? DEFAULT_TITLE_LIMIT;
  if (full.length <= limit) return full;
  return t("metadata.titleShort", { a: nameA, b: nameB });
}
