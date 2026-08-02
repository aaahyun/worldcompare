/**
 * One-off generator: reads each country's real border geometry from the
 * world-countries package, simplifies it, and writes a normalized SVG path
 * (viewBox "0 0 100 100") into that country's `geometry_svg` field.
 *
 * Run with: npx tsx scripts/generateCountryShapes.ts
 */
import fs from "node:fs";
import path from "node:path";

type Ring = [number, number][]; // [lon, lat][]

const DATA_DIR = path.join(process.cwd(), "data", "countries");
const WC_DATA_DIR = path.join(process.cwd(), "node_modules", "world-countries", "data");
const VIEWBOX = 100;
const PADDING_FRACTION = 0.06;

function readGeoJson(iso3: string): Ring[] {
  const file = path.join(WC_DATA_DIR, `${iso3.toLowerCase()}.geo.json`);
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const feature = raw.features[0];
  const geom = feature.geometry;
  const rings: Ring[] = [];

  if (geom.type === "Polygon") {
    rings.push(geom.coordinates[0]);
  } else if (geom.type === "MultiPolygon") {
    for (const polygon of geom.coordinates) {
      rings.push(polygon[0]);
    }
  }
  return rings;
}

function shoelaceArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

/** Douglas-Peucker simplification on a closed ring. */
function simplifyRing(ring: Ring, tolerance: number): Ring {
  if (ring.length <= 4) return ring;

  function perpDistance(p: [number, number], a: [number, number], b: [number, number]): number {
    const [px, py] = p;
    const [ax, ay] = a;
    const [bx, by] = b;
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - ax, py - ay);
    const t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    const projX = ax + t * dx;
    const projY = ay + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  function rdp(points: Ring, tol: number): Ring {
    if (points.length <= 2) return points;
    let maxDist = 0;
    let maxIdx = 0;
    const first = points[0];
    const last = points[points.length - 1];
    for (let i = 1; i < points.length - 1; i++) {
      const d = perpDistance(points[i], first, last);
      if (d > maxDist) {
        maxDist = d;
        maxIdx = i;
      }
    }
    if (maxDist > tol) {
      const left = rdp(points.slice(0, maxIdx + 1), tol);
      const right = rdp(points.slice(maxIdx), tol);
      return [...left.slice(0, -1), ...right];
    }
    return [first, last];
  }

  // Open the ring at its widest point so RDP (which anchors on first/last)
  // doesn't bias the simplification toward the arbitrary start vertex.
  return rdp(ring, tolerance);
}

/** Rounds every vertex of a closed ring with a small fixed-radius fillet
 * (quadratic Bezier per corner), so the simplified polygon reads as a smooth
 * coastline instead of a faceted, jagged outline. */
function roundedRingPath(points: [number, number][], radius: number): string {
  const n = points.length;
  const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const along = (from: [number, number], to: [number, number], d: number): [number, number] => {
    const len = dist(from, to) || 1;
    const t = Math.min(d, len) / len;
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  };
  const fmt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

  const cutBack: [number, number][] = [];
  const cutForward: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];
    const r = Math.min(radius, dist(curr, prev) * 0.4, dist(curr, next) * 0.4);
    cutBack.push(along(curr, prev, r));
    cutForward.push(along(curr, next, r));
  }

  let d = `M${fmt(cutForward[0])}`;
  for (let i = 1; i < n; i++) {
    d += `L${fmt(cutBack[i])}Q${fmt(points[i])} ${fmt(cutForward[i])}`;
  }
  d += `L${fmt(cutBack[0])}Q${fmt(points[0])} ${fmt(cutForward[0])}Z`;
  return d;
}

function project(rings: Ring[]): { x: number; y: number }[][] {
  const allLats = rings.flatMap((r) => r.map(([, lat]) => lat));
  const refLat = (Math.min(...allLats) + Math.max(...allLats)) / 2;
  const cos = Math.max(0.15, Math.cos((refLat * Math.PI) / 180));

  return rings.map((ring) => ring.map(([lon, lat]) => ({ x: lon * cos, y: -lat })));
}

function buildPath(rings: Ring[]): string | null {
  if (rings.length === 0) return null;

  const areas = rings.map((r) => shoelaceArea(r));
  const totalArea = areas.reduce((a, b) => a + b, 0);
  if (totalArea === 0) return null;

  const order = areas
    .map((area, i) => ({ area, i }))
    .sort((a, b) => b.area - a.area);

  const kept: Ring[] = [];
  let cumulative = 0;
  for (const { area, i } of order) {
    if (kept.length >= 20) break;
    if (cumulative / totalArea >= 0.97 && kept.length >= 1) break;
    if (kept.length >= 1 && area / totalArea < 0.004) continue;
    kept.push(rings[i]);
    cumulative += area;
  }

  const projected = project(kept);

  const simplified = projected.map((pts) => {
    const bboxW = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
    const bboxH = Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y));
    const tolerance = Math.max(bboxW, bboxH) * 0.004;
    const asPairs: Ring = pts.map((p) => [p.x, p.y]);
    let simple = simplifyRing(asPairs, tolerance);
    // Hard cap so a handful of complex coastlines can't blow up file size.
    if (simple.length > 70) {
      const stride = Math.ceil(simple.length / 70);
      simple = simple.filter((_, i) => i % stride === 0);
    }
    return simple;
  });

  const allPoints = simplified.flat();
  const minX = Math.min(...allPoints.map(([x]) => x));
  const maxX = Math.max(...allPoints.map(([x]) => x));
  const minY = Math.min(...allPoints.map(([, y]) => y));
  const maxY = Math.max(...allPoints.map(([, y]) => y));
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const usable = VIEWBOX * (1 - PADDING_FRACTION * 2);
  const scale = usable / Math.max(width, height);

  const toViewbox = ([x, y]: [number, number]): [number, number] => [
    (x - minX - width / 2) * scale + VIEWBOX / 2,
    (y - minY - height / 2) * scale + VIEWBOX / 2,
  ];

  const CORNER_RADIUS = 1.1;
  return simplified
    .map((ring) => roundedRingPath(ring.map(toViewbox), CORNER_RADIUS))
    .join(" ");
}

function main() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  let totalBytes = 0;
  const missing: string[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const country = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const iso3 = country.iso3;

    let rings: Ring[];
    try {
      rings = readGeoJson(iso3);
    } catch {
      missing.push(`${country.slug} (${iso3})`);
      continue;
    }

    const pathData = buildPath(rings);
    if (!pathData) {
      missing.push(`${country.slug} (${iso3}) — empty geometry`);
      continue;
    }

    country.geometry_svg = pathData;
    totalBytes += pathData.length;

    const ordered: Record<string, unknown> = {};
    for (const key of Object.keys(country)) {
      if (key === "geometry_svg" || key === "sources") continue;
      ordered[key] = country[key];
    }
    ordered.geometry_svg = country.geometry_svg;
    ordered.sources = country.sources;

    fs.writeFileSync(filePath, JSON.stringify(ordered, null, 2) + "\n");
  }

  console.log(`Wrote geometry_svg for ${files.length - missing.length}/${files.length} countries.`);
  console.log(`Total path bytes: ${totalBytes} (~${(totalBytes / 1024).toFixed(1)} KB)`);
  if (missing.length) console.log("Missing:", missing);
}

main();
