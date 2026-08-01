import "server-only";
import { getAllCountries } from "@/lib/countries";
import type { Country } from "@/lib/schema";
import { getRedis } from "@/lib/redis";

const VIEWS_KEY = "country_views";

/** Fire-and-forget: not configured locally, so this silently no-ops until Redis env vars are set. */
export async function incrementCountryView(slug: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.hincrby(VIEWS_KEY, slug, 1);
  } catch {
    // View counting is best-effort; a Redis outage should never break the country page.
  }
}

async function getViewCounts(): Promise<Record<string, number>> {
  const redis = getRedis();
  if (!redis) return {};
  try {
    return (await redis.hgetall<Record<string, number>>(VIEWS_KEY)) ?? {};
  } catch {
    return {};
  }
}

/** All countries ordered by view count (ties broken alphabetically by slug). */
export async function getCountriesByViews(): Promise<Country[]> {
  const countries = getAllCountries();
  const counts = await getViewCounts();

  return [...countries].sort((a, b) => {
    const diff = (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0);
    return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
  });
}
