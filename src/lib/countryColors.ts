/**
 * Per-country accent color for the "viewed country" role in comparisons —
 * approximated from each country's national football/sports team kit (or
 * flag color where no strongly recognized kit color exists), darkened where
 * needed so it stays legible as bold text on a light background.
 */
const COUNTRY_ACCENT_BY_ISO2: Record<string, string> = {
  AL: "#D6001C",
  AD: "#0018A8",
  AR: "#4F86C6",
  AU: "#00843D",
  AT: "#ED2939",
  BH: "#CE1126",
  BR: "#009639",
  KH: "#032EA1",
  CA: "#FF0000",
  CL: "#D52B1E",
  CN: "#DE2910",
  CO: "#C89B0C",
  CY: "#004B87",
  DO: "#002D62",
  EG: "#CE1126",
  FR: "#0055A4",
  GE: "#E4032E",
  DE: "#1A1A1A",
  GR: "#0D5EAF",
  HU: "#CE2939",
  IS: "#003897",
  IN: "#0F4C9C",
  ID: "#CE1126",
  IR: "#239F40",
  IE: "#169B62",
  IT: "#0066B3",
  JP: "#08298A",
  JO: "#CE1126",
  MY: "#B8860B",
  MX: "#006847",
  MA: "#C1272D",
  NL: "#CC5500",
  KP: "#ED1C24",
  PE: "#D91023",
  PH: "#0038A8",
  PL: "#DC143C",
  PT: "#FF0000",
  QA: "#8D1B3D",
  SA: "#006C35",
  KR: "#C60C30",
  ES: "#C60B1E",
  SE: "#006AA7",
  CH: "#E8112D",
  TH: "#A51931",
  TN: "#E70013",
  TR: "#E30A17",
  AE: "#00732F",
  GB: "#C8102E",
  US: "#3C3B6E",
  UY: "#7FB2E5",
  UZ: "#0099B5",
  VN: "#DA251D",
};

const FALLBACK_COLOR = "#2f6fed";

export function getCountryAccentColor(iso2: string): string {
  return COUNTRY_ACCENT_BY_ISO2[iso2.toUpperCase()] ?? FALLBACK_COLOR;
}

/** Fixed neutral for the home/reference country — deliberately not colorful,
 * since it's the constant baseline every comparison is measured against. */
export const HOME_COUNTRY_COLOR = "#5b6472";
export const HOME_COUNTRY_COLOR_SOFT = "#e9eaed";
