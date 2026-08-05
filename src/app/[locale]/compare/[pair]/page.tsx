import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect, Link } from "@/i18n/navigation";
import { getAllSlugs, getCountry, toComparable } from "@/lib/countries";
import {
  areaSentence,
  buildCompareTitle,
  climateAnnualSentence,
  densitySentence,
  drivingSideSentence,
  formatCompact,
  formatGdpCompact,
  formatUSD,
  gdpNominalSentence,
  gdpPerCapitaSentence,
  languageDisplayName,
  languageSentence,
  populationSentence,
  religionSentence,
} from "@/lib/compare";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { flagEmoji } from "@/lib/homeCountry";
import { ReligionStackedBar } from "@/lib/charts/religionChart";
import { PlugIcon } from "@/components/PlugIcon";

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

  const tCompare = await getTranslations("compare");

  const nameA = a.names[locale] ?? a.names.en;
  const nameB = b.names[locale] ?? b.names.en;
  const path = `/compare/${pair}`;
  const url = canonicalUrl(locale, path);

  const title = buildCompareTitle(nameA, nameB, locale, tCompare);

  const gdpA = formatGdpCompact(a.gdp_nominal_usd.value, locale);
  const gdpB = formatGdpCompact(b.gdp_nominal_usd.value, locale);
  const ratio = a.gdp_nominal_usd.value / b.gdp_nominal_usd.value;
  const ratioLabel =
    ratio >= 0.5 && ratio <= 2
      ? tCompare("ratioSimilar")
      : ratio > 2
        ? tCompare("ratioMultiple", { n: Math.round(ratio * 10) / 10 })
        : tCompare("ratioPercent", { n: Math.round(ratio * 1000) / 10 });

  const description = tCompare("metadata.description", {
    a: nameA,
    b: nameB,
    gdpA,
    gdpB,
    ratio: ratioLabel,
  });

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
  const tEnums = await getTranslations("enums");
  const tNav = await getTranslations("nav");

  const nameA = a.names[locale] ?? a.names.en;
  const nameB = b.names[locale] ?? b.names.en;
  const compA = toComparable(a, locale);
  const compB = toComparable(b, locale);

  const hasClimate = Boolean(a.climate && b.climate);
  const hasReligion = Boolean(a.religions?.length && b.religions?.length);

  const topReligion = (country: typeof a) =>
    country.religions!.reduce((max, r) => (r.pct > max.pct ? r : max), country.religions![0]);

  const sectionH2 = (key: "gdp" | "population" | "area" | "climate" | "religion" | "languages" | "travelInfo") =>
    tCompare(`sections.${key}`, { a: nameA, b: nameB });

  const toc: { id: string; label: string }[] = [
    { id: "gdp", label: tCompare("toc.gdp") },
    { id: "population", label: tCompare("toc.population") },
    { id: "area", label: tCompare("toc.area") },
    ...(hasClimate ? [{ id: "climate", label: tCompare("toc.climate") }] : []),
    ...(hasReligion ? [{ id: "religion", label: tCompare("toc.religion") }] : []),
    { id: "languages", label: tCompare("toc.languages") },
    { id: "travel-info", label: tCompare("toc.travelInfo") },
  ];

  const targetSide = locale === "ko" ? t(`travel.drivingSide${a.driving_side === "left" ? "Left" : "Right"}`) : a.driving_side;
  const homeSide = locale === "ko" ? t(`travel.drivingSide${b.driving_side === "left" ? "Left" : "Right"}`) : b.driving_side;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tNav("home"), item: `${siteUrl}/${locale}` },
        {
          "@type": "ListItem",
          position: 2,
          name: `${nameA} vs ${nameB}`,
          item: canonicalUrl(locale, `/compare/${pair}`),
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-content-tertiary">
        <Link href="/">{tNav("home")}</Link> {" / "}
        <span>
          {nameA} vs {nameB}
        </span>
      </nav>

      <h1 className="mb-4 text-3xl font-bold">
        {flagEmoji(a.iso2)} {nameA} vs {flagEmoji(b.iso2)} {nameB}
      </h1>

      <nav aria-label="Jump to section" className="mb-8 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 whitespace-nowrap rounded-full bg-surface-card px-3 py-1.5 text-xs text-content-secondary shadow-sm transition hover:text-content-primary"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <section id="gdp" className="mb-10 scroll-mt-24">
        <h2 className="mb-3 text-xl font-semibold">{sectionH2("gdp")}</h2>
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
                {t("economy.gdpNominal")}
              </th>
              <td>{formatUSD(a.gdp_nominal_usd.value, locale)}</td>
              <td>{formatUSD(b.gdp_nominal_usd.value, locale)}</td>
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
        <div className="mt-3 space-y-2 text-sm text-content-secondary">
          <p>
            {gdpNominalSentence(
              { name: nameA, gdpNominalUsd: a.gdp_nominal_usd.value },
              { name: nameB, gdpNominalUsd: b.gdp_nominal_usd.value },
              locale,
              tCompare
            )}
          </p>
          <p>{gdpPerCapitaSentence(compA, compB, locale, tCompare)}</p>
        </div>
      </section>

      <section id="population" className="mb-10 scroll-mt-24">
        <h2 className="mb-3 text-xl font-semibold">{sectionH2("population")}</h2>
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
          </tbody>
        </table>
        <div className="mt-3 space-y-2 text-sm text-content-secondary">
          <p>{populationSentence(compA, compB, locale, tCompare)}</p>
        </div>
      </section>

      <section id="area" className="mb-10 scroll-mt-24">
        <h2 className="mb-3 text-xl font-semibold">{sectionH2("area")}</h2>
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
                {t("stats.area")}
              </th>
              <td>{new Intl.NumberFormat(locale).format(a.area_km2)} km²</td>
              <td>{new Intl.NumberFormat(locale).format(b.area_km2)} km²</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3 space-y-2 text-sm text-content-secondary">
          <p>{areaSentence(compA, compB, locale, tCompare)}</p>
          <p>{densitySentence(compA, compB, locale, tCompare)}</p>
        </div>
      </section>

      {hasClimate && (
        <section id="climate" className="mb-10 scroll-mt-24">
          <h2 className="mb-3 text-xl font-semibold">{sectionH2("climate")}</h2>
          <p className="mb-3 text-sm text-content-secondary">
            {climateAnnualSentence(compA, compB, locale, tCompare)}
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer text-content-tertiary">
              {t("climate.temperatureTitle")}
            </summary>
            <table className="mt-2 w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="pr-2"></th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="px-1 text-center font-normal text-content-tertiary">
                      {new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(
                        new Date(Date.UTC(2024, i, 1))
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-neutral-100">
                  <th className="pr-2 text-left font-normal">{nameA}</th>
                  {a.climate!.temp_high_c.map((v, i) => (
                    <td key={i} className="px-1 text-center">
                      {v}°
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-neutral-100">
                  <th className="pr-2 text-left font-normal">{nameB}</th>
                  {b.climate!.temp_high_c.map((v, i) => (
                    <td key={i} className="px-1 text-center">
                      {v}°
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </details>
        </section>
      )}

      {hasReligion && (
        <section id="religion" className="mb-10 scroll-mt-24">
          <h2 className="mb-3 text-xl font-semibold">{sectionH2("religion")}</h2>
          <p className="mb-3 text-sm text-content-secondary">
            {religionSentence(
              { name: nameA, label: tEnums(`religions.${topReligion(a).key}`), pct: topReligion(a).pct },
              { name: nameB, label: tEnums(`religions.${topReligion(b).key}`), pct: topReligion(b).pct },
              tCompare
            )}
          </p>
          <div className="space-y-4">
            {[a, b].map((country) => {
              const name = country.names[locale] ?? country.names.en;
              return (
                <figure key={country.slug}>
                  <figcaption className="mb-1 text-sm font-medium">{name}</figcaption>
                  <ReligionStackedBar
                    segments={country.religions!.map((r) => ({
                      label: tEnums(`religions.${r.key}`),
                      pct: r.pct,
                    }))}
                  />
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-content-secondary">
                    {country.religions!.map((r) => (
                      <li key={r.key}>
                        {tEnums(`religions.${r.key}`)} {r.pct}%
                      </li>
                    ))}
                  </ul>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      <section id="languages" className="mb-10 scroll-mt-24">
        <h2 className="mb-3 text-xl font-semibold">{sectionH2("languages")}</h2>
        <p className="mb-3 text-sm text-content-secondary">
          {languageSentence(
            { name: nameA, lang: languageDisplayName(a.languages.official[0], locale) },
            { name: nameB, lang: languageDisplayName(b.languages.official[0], locale) },
            tCompare
          )}
        </p>
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
                {t("language.official")}
              </th>
              <td>{a.languages.official.map((c) => languageDisplayName(c, locale)).join(", ")}</td>
              <td>{b.languages.official.map((c) => languageDisplayName(c, locale)).join(", ")}</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <th className="py-2 text-left font-normal text-content-tertiary">
                {t("language.englishProficiency")}
              </th>
              <td>{tEnums(`englishProficiency.${a.languages.english_proficiency}`)}</td>
              <td>{tEnums(`englishProficiency.${b.languages.english_proficiency}`)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="travel-info" className="mb-10 scroll-mt-24">
        <h2 className="mb-3 text-xl font-semibold">{sectionH2("travelInfo")}</h2>
        <p className="mb-3 text-sm text-content-secondary">
          {drivingSideSentence(
            { name: nameA, side: targetSide },
            { name: nameB, side: homeSide },
            a.driving_side === b.driving_side,
            locale,
            tCompare
          )}
        </p>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-content-tertiary">{t("travel.timezone")}</dt>
            <dd className="font-medium">{nameA}: {a.timezone.join(", ")}</dd>
            <dd className="font-medium">{nameB}: {b.timezone.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-content-tertiary">{t("travel.electricity")}</dt>
            <dd className="flex items-center gap-1 font-medium">
              {nameA}: {a.electricity.voltage}V {a.electricity.plugs.join("/")}
              {a.electricity.plugs.map((p) => (
                <PlugIcon key={p} type={p} className="h-5 w-5" />
              ))}
            </dd>
            <dd className="flex items-center gap-1 font-medium">
              {nameB}: {b.electricity.voltage}V {b.electricity.plugs.join("/")}
              {b.electricity.plugs.map((p) => (
                <PlugIcon key={p} type={p} className="h-5 w-5" />
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-content-tertiary">{t("travel.callingCode")}</dt>
            <dd className="font-medium">{nameA}: {a.calling_code}</dd>
            <dd className="font-medium">{nameB}: {b.calling_code}</dd>
          </div>
          <div>
            <dt className="text-content-tertiary">{t("travel.emergency")}</dt>
            <dd className="font-medium">{nameA}: {a.emergency}</dd>
            <dd className="font-medium">{nameB}: {b.emergency}</dd>
          </div>
        </dl>
      </section>

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
