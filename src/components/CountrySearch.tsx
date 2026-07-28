"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { CountryIndexEntry } from "@/lib/countryIndex";
import { searchCountries } from "@/lib/search";

export function CountrySearch({ index }: { index: CountryIndexEntry[] }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => searchCountries(index, query), [index, query]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-full border border-neutral-200 bg-surface-0 px-4 py-2 text-sm text-content-primary shadow-sm outline-none focus:border-brand-400"
      />
      {open && query && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-surface-card shadow-lg">
          {results.length === 0 && (
            <li className="px-4 py-2 text-sm text-content-tertiary">{t("searchNoResults")}</li>
          )}
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/country/${r.slug}`}
                className="block px-4 py-2 text-sm text-content-primary hover:bg-surface-100"
              >
                {r.names[locale] ?? r.names.en}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
