import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCountriesByViews } from "@/lib/countryViews";
import { getTopReportsByViews } from "@/lib/reportViews";
import { localized } from "@/lib/reports";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
import { flagEmoji } from "@/lib/homeCountry";
import { ReportCoverArt } from "@/components/reports/ReportCoverArt";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const title = `${t("title")} | ${siteName}`;
  const description = t("subtitle");
  const url = canonicalUrl(locale, "");

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: buildAlternateLanguages(""),
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const countries = await getCountriesByViews();
  const topReports = await getTopReportsByViews(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${locale}/countries?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-content-secondary">{t("subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <ul className="grid grid-cols-2 gap-3 self-start sm:grid-cols-3">
          {countries.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/country/${c.slug}`}
                className="flex items-center gap-2 rounded-lg bg-surface-card p-3 text-sm shadow-sm hover:shadow-md"
              >
                <span aria-hidden="true">{flagEmoji(c.iso2)}</span>
                {c.names[locale] ?? c.names.en}
              </Link>
            </li>
          ))}
        </ul>

        {topReports.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("popularReports")}</h2>
              <Link
                href="/reports"
                className="text-sm text-content-secondary hover:text-content-primary"
              >
                {t("allReports")} →
              </Link>
            </div>
            <ul className="flex flex-col gap-3">
              {topReports.map((report) => (
                <li key={report.slug}>
                  <Link
                    href={`/reports/${report.slug}`}
                    className="flex flex-col overflow-hidden rounded-lg bg-surface-card shadow-sm hover:shadow-md"
                  >
                    <ReportCoverArt variant={report.coverArt} className="aspect-[3/2] w-full" />
                    <span className="line-clamp-2 p-3 text-sm font-medium">
                      {localized(report.title, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
