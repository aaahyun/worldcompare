"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useHomeCountry } from "./HomeCountryProvider";
import type { CompareDatum } from "@/lib/compareDataset";

interface CountryCompareContextValue {
  homeIso2: string | null;
  setHomeIso2: (iso2: string) => void;
  target: CompareDatum;
  /** null while detection hasn't resolved, or the iso2 isn't in the dataset. */
  home: CompareDatum | null;
  isSameCountry: boolean;
  dataset: CompareDatum[];
}

const Ctx = createContext<CountryCompareContextValue | null>(null);

export function CountryCompareProvider({
  targetSlug,
  dataset,
  children,
}: {
  targetSlug: string;
  dataset: CompareDatum[];
  children: ReactNode;
}) {
  const { homeIso2, setHomeIso2 } = useHomeCountry();

  const value = useMemo<CountryCompareContextValue>(() => {
    const target = dataset.find((d) => d.slug === targetSlug)!;
    const home = homeIso2 ? dataset.find((d) => d.iso2 === homeIso2) ?? null : null;
    return {
      homeIso2,
      setHomeIso2,
      target,
      home,
      isSameCountry: !!home && home.iso2 === target.iso2,
      dataset,
    };
  }, [dataset, targetSlug, homeIso2, setHomeIso2]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCountryCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useCountryCompare must be used within CountryCompareProvider");
  }
  return ctx;
}
