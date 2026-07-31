const STORAGE_KEY = "homeCountry";

export function getStoredHomeCountryIso2(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredHomeCountryIso2(iso2: string): void {
  window.localStorage.setItem(STORAGE_KEY, iso2);
}

function iso2FromNavigatorLanguage(): string | null {
  const lang = typeof navigator !== "undefined" ? navigator.language : null;
  if (!lang) return null;
  const region = lang.split("-")[1];
  return region ? region.toUpperCase() : null;
}

/**
 * Priority per PRD §4.2: explicit user choice > (IP geolocation, not
 * implemented client-side — see note below) > navigator.language region >
 * locale's representative country.
 *
 * IP-based geolocation would need to run at the edge (e.g. reading
 * `x-vercel-ip-country`) and is intentionally out of scope for this scaffold;
 * add it in middleware.ts as a cookie fallback before this function runs.
 */
export function detectHomeCountryIso2(localeFallbackIso2: string): string {
  return (
    getStoredHomeCountryIso2() ?? iso2FromNavigatorLanguage() ?? localeFallbackIso2
  );
}

export function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

/** Data-URI SVG favicon rendering a country's flag emoji, for use in a route's `metadata.icons`. */
export function flagFaviconDataUrl(iso2: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="48" font-size="48" text-anchor="middle">${flagEmoji(iso2)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
