import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, localeHomeCountry, type Locale } from "@/i18n/routing";
import { siteName, siteUrl } from "@/lib/site";
import { emojiFaviconDataUrl } from "@/lib/homeCountry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeCountryProvider } from "@/components/HomeCountryProvider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s | ${siteName}` },
    alternates: {
      canonical: `/${locale}`,
    },
    verification: {
      other: {
        "msvalidate.01": "4466C36B23437E3DB9D7D495752F3637",
      },
    },
    icons: { icon: emojiFaviconDataUrl("🌍") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-surface-100 text-content-primary antialiased">
        <NextIntlClientProvider>
          <HomeCountryProvider localeFallbackIso2={localeHomeCountry[locale as Locale]}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </HomeCountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
