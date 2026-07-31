import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCountries } from "@/lib/countries";
import { buildAlternateLanguages, canonicalUrl } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
import { flagEmoji, emojiFaviconDataUrl } from "@/lib/homeCountry";

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
    icons: { icon: emojiFaviconDataUrl("🌍") },
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
  const countries = getAllCountries();

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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-content-secondary">{t("subtitle")}</p>

      <h2 className="mt-10 mb-3 text-lg font-semibold">{t("popularCountries")}</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
