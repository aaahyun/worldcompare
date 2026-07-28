"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useCountryCompare } from "./CountryCompareProvider";
import { flagEmoji } from "@/lib/homeCountry";
import { gwaWa } from "@/lib/josa";

export function HomeCountryControl() {
  const t = useTranslations("country");
  const locale = useLocale();
  const { homeIso2, setHomeIso2, home, isSameCountry, dataset, target } = useCountryCompare();
  const [editing, setEditing] = useState(false);

  const options = dataset.filter((d) => d.iso2 !== target.iso2);

  // Fixed-height shell reserved for both the loading and resolved states — avoids CLS.
  return (
    <div className="flex h-10 items-center gap-2 rounded-full bg-surface-100 px-4 text-sm">
      {homeIso2 === null ? (
        <span className="h-3 w-40 animate-pulse rounded bg-neutral-200" />
      ) : editing || isSameCountry || !home ? (
        <>
          <span className="text-content-secondary">{t("selectCompareCountry")}</span>
          <select
            autoFocus
            className="rounded-full border border-neutral-200 bg-surface-0 px-2 py-1 text-sm"
            value={home?.iso2 ?? ""}
            onChange={(e) => {
              setHomeIso2(e.target.value);
              setEditing(false);
            }}
          >
            <option value="" disabled>
              …
            </option>
            {options.map((d) => (
              <option key={d.iso2} value={d.iso2}>
                {d.names[locale] ?? d.names.en}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <span className="text-content-primary">
            {flagEmoji(home!.iso2)}{" "}
            {t("comparingWith", {
              country: (() => {
                const homeName = home!.names[locale] ?? home!.names.en;
                return locale === "ko" ? gwaWa(homeName) : homeName;
              })(),
            })}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-brand-600 underline underline-offset-2"
          >
            {t("changeCountry")}
          </button>
        </>
      )}
    </div>
  );
}
