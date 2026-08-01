import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllReports, localized, localizedList } from "@/lib/reports";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { ReportCoverArt } from "@/components/reports/ReportCoverArt";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: canonicalUrl(locale, "/reports"),
      languages: buildAlternateLanguages("/reports"),
    },
  };
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateStr}T00:00:00Z`));
}

export default async function ReportsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reportsIndex");
  const reports = getAllReports();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-content-secondary">{t("subtitle")}</p>

      <div className="mt-8 flex flex-col gap-6">
        {reports.map((report) => (
          <Link
            key={report.slug}
            href={`/reports/${report.slug}`}
            className="flex w-full overflow-hidden rounded-2xl bg-surface-card shadow-md transition hover:shadow-lg"
          >
            <div className="w-[38%] shrink-0 sm:w-[42%]">
              <ReportCoverArt variant={report.coverArt} className="h-full min-h-64" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-8">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-content-tertiary">
                  {formatDate(report.publishedAt, locale)}
                </p>
                <h2 className="font-display text-xl font-bold leading-snug sm:text-2xl">
                  {localized(report.title, locale)}
                </h2>
                <p className="line-clamp-3 text-sm text-content-secondary sm:text-base">
                  {localized(report.excerpt, locale)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {localizedList(report.tags, locale).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-100 px-3 py-1 text-xs text-content-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-country-target px-5 py-2.5 text-sm font-semibold text-content-inverse">
                {t("readMore")}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
