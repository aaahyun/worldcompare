import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect, Link } from "@/i18n/navigation";
import { getAllSlugs, getCountry, toComparable } from "@/lib/countries";
import {
  areaSentence,
  formatCompact,
  formatUSD,
  gdpPerCapitaSentence,
  populationSentence,
} from "@/lib/compare";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { flagEmoji } from "@/lib/homeCountry";

const PAIR_DELIMITER = "-vs-";

function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf(PAIR_DELIMITER);
  if (idx === -1) return null;
  const a = pair.slice(0, idx);
  const b = pair.slice(idx + PAIR_DELIMITER.length);
  if (!a || !b) return null;
  return [a, b];
}

export async function generateStaticParams() {
  const slugs = getAllSlugs().sort();
  const pairs: { pair: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      pairs.push({ pair: `${slugs[i]}${PAIR_DELIMITER}${slugs[j]}` });
    }
  }
  return pairs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale, pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const a = getCountry(slugA);
  const b = getCountry(slugB);
  if (!a || !b) return {};

  const nameA = a.names[locale] ?? a.names.en;
  const nameB = b.names[locale] ?? b.names.en;
  const path = `/compare/${pair}`;
  const url = canonicalUrl(locale, path);

  const title =
    locale === "ko"
      ? `${nameA} vs ${nameB} 비교: 인구, 면적, GDP`
      : `${nameA} vs ${nameB}: Population, Area & GDP Compared`;

  const description =
    locale === "ko"
      ? `${nameA} 인구 ${formatCompact(a.population.value, locale)}명, ${nameB} 인구 ${formatCompact(b.population.value, locale)}명. 면적과 1인당 GDP까지 한눈에 비교해 보세요.`
      : `${nameA} (pop. ${formatCompact(a.population.value, locale)}) vs ${nameB} (pop. ${formatCompact(b.population.value, locale)}) — compare population, area, and GDP per capita side by side.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildAlternateLanguages(path),
    },
    openGraph: { title, description, url },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  setRequestLocale(locale);
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [slugA, slugB] = parsed;

  if (slugA > slugB) {
    permanentRedirect({ href: `/compare/${slugB}${PAIR_DELIMITER}${slugA}`, locale });
  }

  const a = getCountry(slugA);
  const b = getCountry(slugB);
  if (!a || !b) notFound();

  const t = await getTranslations("country");
  const tCompare = await getTranslations("compare");
  const tNav = await getTranslations("nav");

  const nameA = a.names[locale] ?? a.names.en;
  const nameB = b.names[locale] ?? b.names.en;
  const compA = toComparable(a, locale);
  const compB = toComparable(b, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-content-tertiary">
        <Link href="/">{tNav("home")}</Link> {" / "}
        <span>
          {nameA} vs {nameB}
        </span>
      </nav>

      <h1 className="mb-6 text-3xl font-bold">
        {flagEmoji(a.iso2)} {nameA} vs {flagEmoji(b.iso2)} {nameB}
      </h1>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left">
            <th className="py-2"></th>
            <th className="py-2">{nameA}</th>
            <th className="py-2">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-100">
            <th className="py-2 text-left font-normal text-content-tertiary">
              {t("stats.population")}
            </th>
            <td>{formatCompact(a.population.value, locale)}</td>
            <td>{formatCompact(b.population.value, locale)}</td>
          </tr>
          <tr className="border-b border-neutral-100">
            <th className="py-2 text-left font-normal text-content-tertiary">
              {t("stats.area")}
            </th>
            <td>{new Intl.NumberFormat(locale).format(a.area_km2)} km²</td>
            <td>{new Intl.NumberFormat(locale).format(b.area_km2)} km²</td>
          </tr>
          <tr className="border-b border-neutral-100">
            <th className="py-2 text-left font-normal text-content-tertiary">
              {t("stats.gdpPerCapita")}
            </th>
            <td>{formatUSD(a.gdp_per_capita_usd.value, locale)}</td>
            <td>{formatUSD(b.gdp_per_capita_usd.value, locale)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 space-y-2 text-sm text-content-secondary">
        <p>{populationSentence(compA, compB, locale, tCompare)}</p>
        <p>{areaSentence(compA, compB, locale, tCompare)}</p>
        <p>{gdpPerCapitaSentence(compA, compB, locale, tCompare)}</p>
      </div>

      <p className="mt-8 text-sm">
        <Link href={`/country/${a.slug}`} className="underline">
          {nameA} →
        </Link>{" "}
        <Link href={`/country/${b.slug}`} className="underline">
          {nameB} →
        </Link>
      </p>
    </div>
  );
}
