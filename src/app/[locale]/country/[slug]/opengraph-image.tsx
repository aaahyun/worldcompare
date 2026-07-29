import { ImageResponse } from "next/og";
import { getCountry } from "@/lib/countries";
import { formatCompact, formatUSD } from "@/lib/compare";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Country stats comparison";

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

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const country = getCountry(slug);

  if (!country) {
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

  const name = country.names[locale] ?? country.names.en;
  const flagUrl = twemojiFlagUrl(country.iso2);

  const stats = [
    { label: locale === "ko" ? "인구" : "Population", value: formatCompact(country.population.value, locale) },
    { label: locale === "ko" ? "면적" : "Area", value: `${new Intl.NumberFormat(locale).format(country.area_km2)} km²` },
    { label: locale === "ko" ? "1인당 GDP" : "GDP / capita", value: formatUSD(country.gdp_per_capita_usd.value, locale) },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img src={flagUrl} width={96} height={96} style={{ borderRadius: 16 }} alt="" />
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>{name}</div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 20,
                padding: "20px 28px",
                flex: 1,
              }}
            >
              <div style={{ display: "flex", fontSize: 26, opacity: 0.75 }}>{s.label}</div>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginTop: 8 }}>
                {s.value}
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
