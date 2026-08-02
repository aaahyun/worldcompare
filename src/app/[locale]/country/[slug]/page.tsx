import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllSlugs, getCountry, getRelatedCompareSlugs, toComparable } from "@/lib/countries";
import { getCompareDataset } from "@/lib/compareDataset";
import { bestTimeToVisit, formatCompact, formatUSD } from "@/lib/compare";
import { countrySummary } from "@/lib/summary";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { CountryCompareProvider } from "@/components/CountryCompareProvider";
import { HomeCountryControl } from "@/components/HomeCountryControl";
import { PopulationHero } from "@/components/PopulationHero";
import { HeroCompareBadge } from "@/components/HeroCompareBadge";
import { PersonalizedSentence } from "@/components/PersonalizedSentence";
import { PlugIcon } from "@/components/PlugIcon";
import { flagEmoji, flagFaviconDataUrl } from "@/lib/homeCountry";
import {
  PersonalizedAreaChart,
  PersonalizedClimateChart,
  PersonalizedPopulationChart,
} from "@/components/PersonalizedChart";
import { DemographicsCompareTable } from "@/components/DemographicsCompareTable";
import { ReligionStackedBar } from "@/lib/charts/religionChart";
import { ViewBeacon } from "@/components/ViewBeacon";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const country = getCountry(slug);
  if (!country) return {};

  const name = country.names[locale] ?? country.names.en;
  const path = `/country/${slug}`;

  const title =
    locale === "ko"
      ? `${name} 정보: 인구, 면적, GDP, 기온`
      : `${name}: Population, Area, GDP & Climate`;

  const description =
    locale === "ko"
      ? `${name} 인구 ${formatCompact(country.population.value, locale)}명, 면적 ${new Intl.NumberFormat(locale).format(country.area_km2)}㎢, 1인당 GDP ${formatUSD(country.gdp_per_capita_usd.value, locale)}. 월별 기온과 여행 정보를 한눈에.`
      : `${name} population ${formatCompact(country.population.value, locale)}, area ${new Intl.NumberFormat(locale).format(country.area_km2)} km², GDP per capita ${formatUSD(country.gdp_per_capita_usd.value, locale)}. Monthly climate and travel info at a glance.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(locale, path),
      languages: buildAlternateLanguages(path),
    },
    openGraph: { title, description, url: canonicalUrl(locale, path) },
    icons: { icon: flagFaviconDataUrl(country.iso2) },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const country = getCountry(slug);
  if (!country) notFound();

  const t = await getTranslations("country");
  const tEnums = await getTranslations("enums");
  const tNav = await getTranslations("nav");

  const name = country.names[locale] ?? country.names.en;
  const capitalName = country.capital.names[locale] ?? country.capital.names.en;
  const continentName = tEnums(`continents.${country.continent}`);
  const topIndustry = country.industries?.[0]
    ? tEnums(`industries.${country.industries[0]}`)
    : "";

  const summary = countrySummary(
    country,
    locale,
    t.raw("summaryTemplates") as string[],
    continentName,
    topIndustry
  );

  const monthLabels = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(
      new Date(Date.UTC(2024, i, 1))
    )
  );

  const bestTime = bestTimeToVisit(toComparable(country, locale), locale, (key, values) =>
    t(`climate.${key}`, values)
  );

  const dataset = getCompareDataset();
  const relatedSlugs = getRelatedCompareSlugs(slug);

  const faqEntries = [
    { q: t("faq.population", { target: name }), a: `${name} — ${formatCompact(country.population.value, locale)} (${country.population.year})` },
    { q: t("faq.area", { target: name }), a: `${new Intl.NumberFormat(locale).format(country.area_km2)} km²` },
    { q: t("faq.capital", { target: name }), a: capitalName },
    { q: t("faq.gdp", { target: name }), a: formatUSD(country.gdp_per_capita_usd.value, locale) },
    { q: t("faq.language", { target: name }), a: country.languages.official.join(", ") },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Country",
      name,
      "geo": { "@type": "GeoCoordinates", latitude: country.capital.lat, longitude: country.capital.lng },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntries.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tNav("home"), item: `${siteUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: tNav("countries"), item: `${siteUrl}/${locale}/countries` },
        { "@type": "ListItem", position: 3, name, item: canonicalUrl(locale, `/country/${slug}`) },
      ],
    },
  ];

  return (
    <CountryCompareProvider targetSlug={slug} dataset={dataset}>
      <ViewBeacon endpoint={`/api/countries/${slug}/view`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-content-tertiary">
          <Link href="/">{tNav("home")}</Link> {" / "}
          <Link href="/countries">{tNav("countries")}</Link> {" / "}
          <span>{name}</span>
        </nav>

        <div className="mb-4">
          <HomeCountryControl />
        </div>

        <PopulationHero />

        <p className="mb-8 mt-2 text-base text-content-secondary">
          {t("capital")}: {capitalName} · {t("continent")}: {continentName}
        </p>

        <p className="mb-8 text-base leading-relaxed text-content-primary">{summary}</p>

        <section aria-label="Hero stats" className="mb-10 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface-card p-4 shadow-sm">
            <p className="text-sm text-content-tertiary">{t("stats.population")}</p>
            <p className="text-lg font-semibold">{formatCompact(country.population.value, locale)}</p>
            <div className="mt-1">
              <HeroCompareBadge metric="population" />
            </div>
          </div>
          <div className="rounded-xl bg-surface-card p-4 shadow-sm">
            <p className="text-sm text-content-tertiary">{t("stats.area")}</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat(locale).format(country.area_km2)} km²
            </p>
            <div className="mt-1">
              <HeroCompareBadge metric="area" />
            </div>
          </div>
          <div className="rounded-xl bg-surface-card p-4 shadow-sm">
            <p className="text-sm text-content-tertiary">{t("stats.gdpPerCapita")}</p>
            <p className="text-lg font-semibold">
              {formatUSD(country.gdp_per_capita_usd.value, locale)}
            </p>
            <div className="mt-1">
              <HeroCompareBadge metric="gdpPerCapita" />
            </div>
          </div>
        </section>

        <section id="population" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.population")}</h2>
          <PersonalizedPopulationChart />
          <div className="mt-3">
            <PersonalizedSentence metric="population" />
          </div>
        </section>

        <section id="area" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.area")}</h2>
          <PersonalizedAreaChart />
          <div className="mt-3 space-y-1">
            <PersonalizedSentence metric="area" />
            <PersonalizedSentence metric="density" />
          </div>
        </section>

        <section id="demographics" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.demographics")}</h2>
          <DemographicsCompareTable />
        </section>

        <section id="economy" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.economy")}</h2>
          <dl className="grid grid-cols-2 gap-3 text-base">
            <div>
              <dt className="text-sm text-content-tertiary">{t("economy.gdpNominal")}</dt>
              <dd className="font-medium">{formatUSD(country.gdp_nominal_usd.value, locale)}</dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("economy.currency")}</dt>
              <dd className="font-medium">{country.currency.code}</dd>
            </div>
          </dl>
          {country.industries && (
            <div className="mt-3">
              <p className="text-sm text-content-tertiary">{t("economy.topIndustries")}</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {country.industries.map((i) => (
                  <li key={i} className="rounded-full bg-surface-100 px-3 py-1 text-sm">
                    {tEnums(`industries.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3">
            <PersonalizedSentence metric="gdpPerCapita" />
          </div>
        </section>

        {country.climate && (
          <section id="climate" className="mb-10">
            <h2 className="mb-3 text-xl font-semibold">{t("sections.climate")}</h2>
            <div className="space-y-6">
              <PersonalizedClimateChart
                metric="temp"
                title={t("climate.temperatureTitle")}
                unit="°C"
                monthLabels={monthLabels}
              />
              <PersonalizedClimateChart
                metric="precip"
                title={t("climate.precipitationTitle")}
                unit="mm"
                monthLabels={monthLabels}
              />
            </div>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-content-tertiary">Data table</summary>
              <table className="mt-2 w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="pr-2">Month</th>
                    <th className="pr-2">High °C</th>
                    <th className="pr-2">Low °C</th>
                    <th>Precip mm</th>
                  </tr>
                </thead>
                <tbody>
                  {monthLabels.map((m, i) => (
                    <tr key={m}>
                      <td className="pr-2">{m}</td>
                      <td className="pr-2">{country.climate!.temp_high_c[i]}</td>
                      <td className="pr-2">{country.climate!.temp_low_c[i]}</td>
                      <td>{country.climate!.precip_mm[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            {bestTime && <p className="mt-3 text-base text-content-secondary">{bestTime}</p>}
            <div className="mt-2">
              <PersonalizedSentence metric="temperature" />
            </div>
          </section>
        )}

        {country.religions && (
          <section id="religion" className="mb-10">
            <h2 className="mb-3 text-xl font-semibold">{t("sections.religion")}</h2>
            <figure>
              <ReligionStackedBar
                segments={country.religions.map((r) => ({
                  label: tEnums(`religions.${r.key}`),
                  pct: r.pct,
                }))}
              />
              <figcaption className="sr-only">{`${name} religious composition`}</figcaption>
            </figure>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-content-secondary">
              {country.religions.map((r) => (
                <li key={r.key}>
                  {tEnums(`religions.${r.key}`)} {r.pct}%
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="language" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.language")}</h2>
          <dl className="grid grid-cols-2 gap-3 text-base">
            <div>
              <dt className="text-sm text-content-tertiary">{t("language.official")}</dt>
              <dd className="font-medium">{country.languages.official.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("language.englishProficiency")}</dt>
              <dd className="font-medium">
                {tEnums(`englishProficiency.${country.languages.english_proficiency}`)}
              </dd>
            </div>
          </dl>
        </section>

        <section id="travel-info" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.travelInfo")}</h2>
          <dl className="grid grid-cols-2 gap-3 text-base sm:grid-cols-3">
            <div>
              <dt className="text-sm text-content-tertiary">{t("travel.timezone")}</dt>
              <dd className="font-medium">{country.timezone.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("travel.electricity")}</dt>
              <dd className="font-medium">
                <div>
                  {country.electricity.voltage}V · {country.electricity.plugs.join("/")}
                </div>
                <div className="mt-1 flex gap-2 text-content-secondary">
                  {country.electricity.plugs.map((p) => (
                    <PlugIcon key={p} type={p} className="h-8 w-8" />
                  ))}
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("travel.drivingSide")}</dt>
              <dd className="font-medium">
                {country.driving_side === "left" ? t("travel.drivingSideLeft") : t("travel.drivingSideRight")}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("travel.callingCode")}</dt>
              <dd className="font-medium">{country.calling_code}</dd>
            </div>
            <div>
              <dt className="text-sm text-content-tertiary">{t("travel.emergency")}</dt>
              <dd className="font-medium">{country.emergency}</dd>
            </div>
          </dl>
        </section>

        {relatedSlugs.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-semibold">{t("sections.compareWith", { name })}</h2>
            <div className="flex flex-wrap gap-2">
              {relatedSlugs.map((otherSlug) => {
                const other = getCountry(otherSlug);
                if (!other) return null;
                const otherName = other.names[locale] ?? other.names.en;
                const pair = [slug, otherSlug].sort().join("-vs-");
                return (
                  <Link
                    key={otherSlug}
                    href={`/compare/${pair}`}
                    className="rounded-full bg-surface-card px-3 py-1 text-xs text-content-secondary shadow-sm transition hover:text-content-primary"
                  >
                    {flagEmoji(other.iso2)} {otherName}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section id="sources" className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{t("sections.sources")}</h2>
          <ul className="space-y-1 text-xs text-content-tertiary">
            {Object.entries(country.sources).map(([key, s]) => (
              <li key={key}>
                {key}:{" "}
                <a href={s.url} className="underline" target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>{" "}
                ({s.retrieved})
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="FAQ" className="mb-10">
          <h2 className="sr-only">FAQ</h2>
          <dl className="space-y-3">
            {faqEntries.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="text-base text-content-secondary">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </CountryCompareProvider>
  );
}
