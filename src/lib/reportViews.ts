import "server-only";
import { getAllReports } from "@/lib/reports";
import type { Report } from "@/lib/reportSchema";
import { getRedis } from "@/lib/redis";

const VIEWS_KEY = "report_views";

/** Fire-and-forget: not configured locally, so this silently no-ops until Redis env vars are set. */
export async function incrementReportView(slug: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.hincrby(VIEWS_KEY, slug, 1);
  } catch {
    // View counting is best-effort; a Redis outage should never break the report page.
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

export async function getTopReportsByViews(limit: number): Promise<Report[]> {
  const reports = getAllReports();
  const counts = await getViewCounts();

  return [...reports]
    .sort((a, b) => {
      const diff = (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0);
      return diff !== 0 ? diff : b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
