import { defineRouting } from "next-intl/routing";

// P0 scaffold ships en/ko only; PRD targets 8 locales (ko,en,ja,es,fr,zh,hi,ar) —
// add each locale here only once its locales/{code}.json translation file exists.
export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const rtlLocales: Locale[] = [];

export const localeHomeCountry: Record<Locale, string> = {
  en: "US",
  ko: "KR",
};
