import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { parsePair } from "@/lib/comparePair";
import { embedSrcUrl, toEmbedMetric, DEFAULT_EMBED_METRIC, EMBED_HEIGHT } from "@/lib/embed";
import { siteName, siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

/** Accepts both the human-facing compare page URL and a direct /embed URL, so
 * consumers (WordPress, Notion, ...) can discover this from the <link> tag on
 * the compare page or resolve an already-copied embed URL directly. */
function extractPairAndMetric(target: URL): { pair: string; metric: string } | null {
  const parts = target.pathname.split("/").filter(Boolean);

  if (parts[0] === "embed" && parts[1] === "compare" && parts[2] && parts[3]) {
    return { pair: parts[2], metric: parts[3] };
  }

  if (parts.length >= 3 && parts[1] === "compare" && (routing.locales as readonly string[]).includes(parts[0])) {
    return { pair: parts[2], metric: DEFAULT_EMBED_METRIC };
  }

  return null;
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (target.origin !== new URL(siteUrl).origin) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 404 });
  }

  const extracted = extractPairAndMetric(target);
  const parsed = extracted ? parsePair(extracted.pair) : null;
  if (!extracted || !parsed) {
    return NextResponse.json({ error: "Unknown comparison" }, { status: 404 });
  }

  const [slugA, slugB] = parsed;
  const a = getCountry(slugA);
  const b = getCountry(slugB);
  if (!a || !b) {
    return NextResponse.json({ error: "Unknown comparison" }, { status: 404 });
  }

  const metric = toEmbedMetric(extracted.metric);
  const nameA = a.names.en;
  const nameB = b.names.en;
  const src = embedSrcUrl(extracted.pair, metric);
  const title = escapeHtml(`${nameA} vs ${nameB} comparison`);

  const requestedWidth = Number(request.nextUrl.searchParams.get("maxwidth"));
  const width = Number.isFinite(requestedWidth) && requestedWidth > 0 ? Math.min(requestedWidth, 600) : 600;

  return NextResponse.json({
    version: "1.0",
    type: "rich",
    provider_name: siteName,
    provider_url: siteUrl,
    title,
    width,
    height: EMBED_HEIGHT,
    html: `<iframe src="${src}" width="100%" height="${EMBED_HEIGHT}" frameborder="0" loading="lazy" title="${title}"></iframe>`,
  });
}
