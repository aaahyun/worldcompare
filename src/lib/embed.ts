import { siteUrl } from "./site";

export const EMBED_METRICS = ["gdp", "population", "area", "climate"] as const;
export type EmbedMetric = (typeof EMBED_METRICS)[number];

export const DEFAULT_EMBED_METRIC: EmbedMetric = "population";

/** Malformed or unknown metric segments fall back to the default rather than
 * 404ing — an embed URL is meant to keep working forever once a blogger has
 * pasted it. */
export function toEmbedMetric(value: string): EmbedMetric {
  return (EMBED_METRICS as readonly string[]).includes(value)
    ? (value as EmbedMetric)
    : DEFAULT_EMBED_METRIC;
}

/** Fixed iframe height suggested in copy-paste embed code. Kept uniform across
 * metrics so a post embedding several charts gets a consistent grid, with
 * enough headroom that no metric's chart clips. */
export const EMBED_HEIGHT = 420;

export function embedSrcUrl(pair: string, metric: EmbedMetric): string {
  return `${siteUrl}/embed/compare/${pair}/${metric}`;
}
