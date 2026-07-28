import type { Country } from "./schema";
import { formatCompact, formatUSD } from "./compare";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

/**
 * Deterministic per-country template variant (stable across builds) so
 * neighboring pages don't read as duplicate content to a crawler.
 */
export function countrySummary(
  country: Country,
  locale: string,
  templates: string[],
  continentName: string,
  industryName: string
): string {
  if (templates.length === 0) return "";
  const variant = templates[hashString(country.slug) % templates.length];
  return fillTemplate(variant, {
    name: country.names[locale] ?? country.names.en,
    capital: country.capital.names[locale] ?? country.capital.names.en,
    continent: continentName,
    population: formatCompact(country.population.value, locale),
    area: new Intl.NumberFormat(locale).format(country.area_km2),
    gdpPerCapita: formatUSD(country.gdp_per_capita_usd.value, locale),
    urbanization: country.urbanization_pct ? String(country.urbanization_pct) : "",
    lifeExpectancy: country.life_expectancy ? String(country.life_expectancy) : "",
    industry: industryName,
  });
}
