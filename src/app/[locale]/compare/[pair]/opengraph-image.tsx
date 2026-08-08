import { ImageResponse } from "next/og";
import { getCountry } from "@/lib/countries";
import { formatCompact, formatUSD } from "@/lib/compare";
import { parsePair } from "@/lib/comparePair";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Country comparison";

const COLOR_TARGET = "#2f6fed";
const COLOR_HOME = "#d9822b";

/** Satori (used by ImageResponse) can't render emoji glyphs, so flags are
 * fetched as Twemoji PNGs keyed by the flag emoji's own codepoints. */
function twemojiFlagUrl(iso2: string): string {
  const codepoints = iso2
    .toUpperCase()
    .split("")
    .map((char) => (127397 + char.charCodeAt(0)).toString(16))
    .join("-");
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoints}.png`;
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2650c2",
          color: "#ffffff",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {siteName}
      </div>
    ),
    size
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return fallback();
  const [slugA, slugB] = parsed;
  const a = getCountry(slugA);
  const b = getCountry(slugB);
  if (!a || !b) return fallback();

  const nameA = a.names[locale] ?? a.names.en;
  const nameB = b.names[locale] ?? b.names.en;

  const sides = [
    { country: a, name: nameA, color: COLOR_TARGET, flagUrl: twemojiFlagUrl(a.iso2) },
    { country: b, name: nameB, color: COLOR_HOME, flagUrl: twemojiFlagUrl(b.iso2) },
  ];

  const statLabels =
    locale === "ko" ? { population: "인구", gdp: "1인당 GDP" } : { population: "Population", gdp: "GDP / capita" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #3468e0 0%, #172f75 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={sides[0].flagUrl} width={80} height={80} style={{ borderRadius: 14 }} alt="" />
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, maxWidth: 380 }}>{nameA}</div>
          <div style={{ display: "flex", fontSize: 34, opacity: 0.6, margin: "0 8px" }}>vs</div>
          <img src={sides[1].flagUrl} width={80} height={80} style={{ borderRadius: 14 }} alt="" />
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, maxWidth: 380 }}>{nameB}</div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {sides.map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 20,
                padding: "20px 28px",
                flex: 1,
                borderTop: `6px solid ${s.color}`,
              }}
            >
              <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{s.name}</div>
              <div style={{ display: "flex", fontSize: 24, opacity: 0.75, marginTop: 12 }}>
                {statLabels.population}
              </div>
              <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
                {formatCompact(s.country.population.value, locale)}
              </div>
              <div style={{ display: "flex", fontSize: 24, opacity: 0.75, marginTop: 10 }}>{statLabels.gdp}</div>
              <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
                {formatUSD(s.country.gdp_per_capita_usd.value, locale)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>{siteName}</div>
      </div>
    ),
    size
  );
}
