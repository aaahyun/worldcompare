import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllReportSlugs, getReport, localized, localizedList } from "@/lib/reports";
import { getCountry } from "@/lib/countries";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { ReportCoverArt } from "@/components/reports/ReportCoverArt";
import { ReportScrollHeader } from "@/components/reports/ReportScrollHeader";

export async function generateStaticParams() {
  return getAllReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const report = getReport(slug);
  if (!report) return {};

  const path = `/reports/${slug}`;
  const title = localized(report.title, locale);
  const description = localized(report.excerpt, locale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(locale, path),
      languages: buildAlternateLanguages(path),
    },
    openGraph: { title, description, url: canonicalUrl(locale, path) },
  };
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateStr}T00:00:00Z`));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const report = getReport(slug);
  if (!report) notFound();

  const t = await getTranslations("reportDetail");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/reports" className="text-sm text-content-secondary hover:text-content-primary">
        ← {t("backToReports")}
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {localizedList(report.tags, locale).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface-card px-3 py-1 text-xs text-content-secondary shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <ReportScrollHeader
        title={localized(report.title, locale)}
        backHref="/reports"
        backLabel={t("backToReports")}
      />

      <p className="mt-3 text-sm text-content-tertiary">
        {formatDate(report.publishedAt, locale)} · {t("readingMinutes", { n: report.readingMinutes })}
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <ReportCoverArt variant={report.coverArt} className="h-56 w-full sm:h-72" />
      </div>

      {report.stats && report.stats.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {report.stats.map((stat, i) => (
            <div key={i} className="rounded-xl bg-surface-card p-4 shadow-sm">
              <p className="text-xs text-content-tertiary">{localized(stat.label, locale)}</p>
              <p className="mt-1 font-display text-lg font-bold">{localized(stat.value, locale)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-10">
        {report.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {localized(section.heading, locale)}
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {localizedList(section.body, locale).map((paragraph, j) => (
                <p key={j} className="leading-relaxed text-content-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {report.relatedCountrySlugs && report.relatedCountrySlugs.length > 0 && (
        <section className="mt-12 border-t border-neutral-200 pt-6">
          <h2 className="text-sm font-semibold text-content-secondary">
            {t("relatedCountriesTitle")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.relatedCountrySlugs.map((slug) => {
              const country = getCountry(slug);
              if (!country) return null;
              return (
                <Link
                  key={slug}
                  href={`/country/${slug}`}
                  className="rounded-full bg-surface-card px-3 py-1 text-xs text-content-secondary shadow-sm transition hover:text-content-primary"
                >
                  {localized(country.names, locale)}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-neutral-200 pt-6">
        <h2 className="text-sm font-semibold text-content-secondary">{t("sourcesTitle")}</h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-content-tertiary">
          {report.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-content-secondary"
              >
                {source.name}
              </a>{" "}
              — {t("retrieved", { date: source.retrieved })}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
