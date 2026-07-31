"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCountryCompare } from "./CountryCompareProvider";
import { useCountUp } from "@/hooks/useCountUp";
import { flagEmoji } from "@/lib/homeCountry";

export function PopulationHero() {
  const t = useTranslations("country");
  const locale = useLocale();
  const { target, home, homeIso2, isSameCountry } = useCountryCompare();

  const name = target.names[locale] ?? target.names.en;
  const count = useCountUp(target.population);
  const displayValue = new Intl.NumberFormat(locale).format(Math.round(count));

  const showPercent = homeIso2 !== null && !!home && !isSameCountry;
  const pct = home ? (target.population / home.population) * 100 : 0;

  return (
    <section aria-label={t("hero.question", { name })} className="mb-10">
      <h1
        className="hero-fade-up flex flex-wrap items-center gap-3 text-[clamp(2.5rem,9vw,6.75rem)] font-black leading-[1.05] tracking-tight text-content-primary"
      >
        <span aria-hidden="true" className="hero-flag-pop inline-block">
          {flagEmoji(target.iso2)}
        </span>
        <span className="bg-gradient-to-br from-brand-600 to-brand-400 bg-clip-text text-transparent">
          {t("hero.question", { name })}
        </span>
      </h1>

      <p
        aria-live="polite"
        className="hero-fade-up hero-fade-up-delay-1 mt-4 flex items-baseline gap-2 text-[clamp(2.25rem,7vw,5rem)] font-bold tabular-nums text-country-target"
      >
        {displayValue}
        <span className="text-base font-medium text-content-tertiary">{t("hero.peopleUnit")}</span>
      </p>

      {homeIso2 === null ? (
        <span className="hero-fade-up hero-fade-up-delay-2 mt-3 inline-block h-5 w-40 animate-pulse rounded-full bg-neutral-200" />
      ) : showPercent ? (
        <p
          key={home!.iso2}
          className="hero-fade-up hero-fade-up-delay-2 mt-3 flex items-center gap-1.5 text-lg text-content-secondary"
        >
          <span aria-hidden="true">{flagEmoji(home!.iso2)}</span>
          {t("hero.percentOfHome", {
            home: home!.names[locale] ?? home!.names.en,
            pct: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(pct),
          })}
        </p>
      ) : null}
    </section>
  );
}
