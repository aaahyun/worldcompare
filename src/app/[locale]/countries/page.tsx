import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCountries } from "@/lib/countries";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { flagEmoji } from "@/lib/homeCountry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: canonicalUrl(locale, "/countries"),
      languages: buildAlternateLanguages("/countries"),
    },
  };
}

export default async function CountriesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("countriesIndex");
  const countries = getAllCountries();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-content-secondary">{t("subtitle")}</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
    </div>
  );
}
