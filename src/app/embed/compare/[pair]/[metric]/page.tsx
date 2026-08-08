import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getAllSlugs, getCountry } from "@/lib/countries";
import { parsePair } from "@/lib/comparePair";
import { EMBED_METRICS, toEmbedMetric, type EmbedMetric } from "@/lib/embed";
import { formatCompact, formatGdpCompact } from "@/lib/compare";
import { siteUrl } from "@/lib/site";
import { flagEmoji } from "@/lib/homeCountry";
import { PopulationFigureChart } from "@/lib/charts/populationChart";
import { AreaOverlayChart } from "@/lib/charts/areaChart";
import { ClimateLineChart, type ClimateSeries } from "@/lib/charts/climateChart";
import { GdpBarChart } from "@/lib/charts/gdpChart";
import { industryLabelEn } from "@/lib/industries";

const METRIC_LABEL: Record<EmbedMetric, string> = {
  gdp: "GDP",
  population: "Population",
  area: "Area",
  climate: "Climate",
};

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, i, 1)))
);

export async function generateStaticParams() {
  const slugs = getAllSlugs().sort();
  const params: { pair: string; metric: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = getCountry(slugs[i]);
      const b = getCountry(slugs[j]);
      const pair = `${slugs[i]}-vs-${slugs[j]}`;
      for (const metric of EMBED_METRICS) {
        if (metric === "climate" && !(a?.climate && b?.climate)) continue;
        params.push({ pair, metric });
      }
    }
  }
  return params;
}

function resolvePair(pair: string) {
  const parsed = parsePair(pair);
  if (!parsed) return null;
  const [slugA, slugB] = parsed;
  const a = getCountry(slugA);
  const b = getCountry(slugB);
  if (!a || !b) return null;
  return { slugA, slugB, a, b };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string; metric: string }>;
}): Promise<Metadata> {
  const { pair, metric: rawMetric } = await params;
  const resolved = resolvePair(pair);
  if (!resolved) return {};
  const { a, b } = resolved;
  const metric = toEmbedMetric(rawMetric);
  const nameA = a.names.en;
  const nameB = b.names.en;

  return {
    title: `${nameA} vs ${nameB} ${METRIC_LABEL[metric]} | WhatsThePop`,
    robots: { index: false, follow: true },
  };
}

export default async function EmbedComparePage({
  params,
}: {
  params: Promise<{ pair: string; metric: string }>;
}) {
  const { pair, metric: rawMetric } = await params;
  const resolved = resolvePair(pair);
  if (!resolved) notFound();
  const { slugA, slugB, a, b } = resolved;

  if (slugA > slugB) {
    permanentRedirect(`/embed/compare/${slugB}-vs-${slugA}/${rawMetric}`);
  }

  const metric = toEmbedMetric(rawMetric);
  const nameA = a.names.en;
  const nameB = b.names.en;
  const comparePageUrl = `${siteUrl}/en/compare/${pair}`;

  let chart: React.ReactNode;
  switch (metric) {
    case "gdp":
      chart = (
        <GdpBarChart
          data={[
            {
              label: `${nameA} · ${formatGdpCompact(a.gdp_nominal_usd.value, "en")}`,
              valueUsd: a.gdp_nominal_usd.value,
              colorVar: "--color-country-target",
            },
            {
              label: `${nameB} · ${formatGdpCompact(b.gdp_nominal_usd.value, "en")}`,
              valueUsd: b.gdp_nominal_usd.value,
              colorVar: "--color-country-home",
            },
          ]}
        />
      );
      break;
    case "area":
      chart = (
        <AreaOverlayChart
          size={220}
          data={[
            {
              label: `${nameA} · ${new Intl.NumberFormat("en").format(a.area_km2)} km²`,
              areaKm2: a.area_km2,
              colorVar: "--color-country-target",
              geometryPath: a.geometry_svg,
            },
            {
              label: `${nameB} · ${new Intl.NumberFormat("en").format(b.area_km2)} km²`,
              areaKm2: b.area_km2,
              colorVar: "--color-country-home",
              geometryPath: b.geometry_svg,
            },
          ]}
        />
      );
      break;
    case "climate": {
      const series: ClimateSeries[] = [];
      if (a.climate) series.push({ label: nameA, values: a.climate.temp_high_c, colorVar: "--color-country-target" });
      if (b.climate)
        series.push({
          label: nameB,
          values: b.climate.temp_high_c,
          colorVar: "--color-country-home",
          dashed: true,
        });
      chart = (
        <ClimateLineChart
          title="Average high temperature"
          unit="°C"
          monthLabels={MONTH_LABELS}
          series={series}
        />
      );
      break;
    }
    case "population":
    default:
      chart = (
        <PopulationFigureChart
          data={[
            {
              label: `${nameA} · ${formatCompact(a.population.value, "en")}`,
              value: a.population.value,
              colorVar: "--color-country-target",
            },
            {
              label: `${nameB} · ${formatCompact(b.population.value, "en")}`,
              value: b.population.value,
              colorVar: "--color-country-home",
            },
          ]}
        />
      );
      break;
  }

  return (
    <div style={{ padding: "16px 20px", boxSizing: "border-box" }}>
      <a
        href={comparePageUrl}
        target="_blank"
        rel="noopener"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h1 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
          {flagEmoji(a.iso2)} {nameA} vs {flagEmoji(b.iso2)} {nameB} — {METRIC_LABEL[metric]}
        </h1>
      </a>

      <div style={{ display: "flex", justifyContent: "center" }}>{chart}</div>

      {metric === "population" && a.industries?.length && b.industries?.length ? (
        <>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-content-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          Top industries
        </p>
        <table style={{ width: "100%", marginTop: 4, borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "2px 6px",
                  color: "var(--color-country-target)",
                  fontWeight: 600,
                }}
              >
                {nameA}
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "2px 6px",
                  color: "var(--color-country-home)",
                  fontWeight: 600,
                }}
              >
                {nameB}
              </th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--color-neutral-200)" }}>
                <td style={{ padding: "3px 6px", color: "var(--color-content-secondary)" }}>
                  {a.industries![i] ? industryLabelEn(a.industries![i]) : "—"}
                </td>
                <td style={{ padding: "3px 6px", color: "var(--color-content-secondary)" }}>
                  {b.industries![i] ? industryLabelEn(b.industries![i]) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      ) : null}

      <div
        style={{
          marginTop: 16,
          paddingTop: 8,
          borderTop: "1px solid var(--color-neutral-200)",
          textAlign: "right",
        }}
      >
        <a
          href={comparePageUrl}
          target="_blank"
          rel="noopener"
          style={{ fontSize: 12, color: "var(--color-content-tertiary)" }}
        >
          Source: whatsthepop.world
        </a>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  function send(){
    if (window.parent === window) return;
    window.parent.postMessage({ source: "whatsthepop-embed", height: document.documentElement.scrollHeight }, "*");
  }
  if (window.ResizeObserver) { new ResizeObserver(send).observe(document.documentElement); }
  else { window.addEventListener("load", send); }
  send();
})();`,
        }}
      />
    </div>
  );
}
