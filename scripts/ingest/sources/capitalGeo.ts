import { fetchWithRetry } from "./fetchRetry";

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

export interface CapitalGeo {
  nameEn: string;
  lat: number;
  lng: number;
}

function buildQuery(iso2Codes: string[]): string {
  const values = iso2Codes.map((c) => `"${c}"`).join(" ");
  return `
    SELECT ?iso2 ?capitalLabelEn ?coord WHERE {
      VALUES ?iso2 { ${values} }
      ?country wdt:P297 ?iso2 .
      ?country wdt:P36 ?capital .
      ?capital wdt:P625 ?coord .
      OPTIONAL { ?capital rdfs:label ?capitalLabelEn . FILTER(LANG(?capitalLabelEn) = "en") }
    }
  `;
}

interface SparqlBinding {
  iso2: { value: string };
  capitalLabelEn?: { value: string };
  coord: { value: string };
}

function parsePoint(wkt: string): { lat: number; lng: number } {
  // "Point(lng lat)"
  const match = wkt.match(/Point\(([-\d.]+) ([-\d.]+)\)/);
  if (!match) throw new Error(`Unparseable WKT point: ${wkt}`);
  return { lng: Number(match[1]), lat: Number(match[2]) };
}

/** One batched SPARQL query for every country's capital name + coordinates. */
export async function fetchCapitalGeo(iso2Codes: string[]): Promise<Map<string, CapitalGeo>> {
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(buildQuery(iso2Codes))}`;
  const res = await fetchWithRetry(
    url,
    { headers: { Accept: "application/sparql-results+json" } },
    20,
    20000
  );

  const body = (await res.json()) as { results: { bindings: SparqlBinding[] } };
  const result = new Map<string, CapitalGeo>();

  for (const b of body.results.bindings) {
    if (!b.capitalLabelEn) continue;
    const { lat, lng } = parsePoint(b.coord.value);
    result.set(b.iso2.value, { nameEn: b.capitalLabelEn.value, lat, lng });
  }

  return result;
}
