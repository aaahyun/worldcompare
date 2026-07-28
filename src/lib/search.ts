import type { CountryIndexEntry } from "./countryIndex";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** All candidate strings a query can match: names in every locale + slug + iso2. */
function candidateStrings(entry: CountryIndexEntry): string[] {
  return [entry.slug, entry.iso2, ...Object.values(entry.names)];
}

export function searchCountries(
  index: CountryIndexEntry[],
  query: string,
  limit = 8
): CountryIndexEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = index
    .map((entry) => {
      const candidates = candidateStrings(entry).map(normalize);
      let best = Infinity;
      for (const c of candidates) {
        if (c === q) best = Math.min(best, 0);
        else if (c.startsWith(q)) best = Math.min(best, 1);
        else if (c.includes(q)) best = Math.min(best, 2);
        else if (q.length >= 3 && levenshtein(c, q) <= 2) best = Math.min(best, 3);
      }
      return { entry, best };
    })
    .filter((s) => s.best < Infinity)
    .sort((a, b) => a.best - b.best);

  return scored.slice(0, limit).map((s) => s.entry);
}
