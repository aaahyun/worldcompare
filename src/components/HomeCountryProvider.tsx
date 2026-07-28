"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { detectHomeCountryIso2, setStoredHomeCountryIso2 } from "@/lib/homeCountry";

interface HomeCountryContextValue {
  /** null while detection hasn't resolved on the client yet. */
  homeIso2: string | null;
  setHomeIso2: (iso2: string) => void;
}

const HomeCountryContext = createContext<HomeCountryContextValue>({
  homeIso2: null,
  setHomeIso2: () => {},
});

export function HomeCountryProvider({
  localeFallbackIso2,
  children,
}: {
  localeFallbackIso2: string;
  children: ReactNode;
}) {
  const [homeIso2, setHomeIso2State] = useState<string | null>(null);

  useEffect(() => {
    // Must run post-hydration, not during the initial render: the server has no
    // localStorage/navigator to read, so computing this eagerly would mismatch
    // the SSR output. The one-time state flip here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHomeIso2State(detectHomeCountryIso2(localeFallbackIso2));
  }, [localeFallbackIso2]);

  function setHomeIso2(iso2: string) {
    setStoredHomeCountryIso2(iso2);
    setHomeIso2State(iso2);
  }

  return (
    <HomeCountryContext.Provider value={{ homeIso2, setHomeIso2 }}>
      {children}
    </HomeCountryContext.Provider>
  );
}

export function useHomeCountry() {
  return useContext(HomeCountryContext);
}
