import type { ReactNode } from "react";
import type { ReportCoverArt as ReportCoverArtVariant } from "@/lib/reportSchema";

const DOT_ROWS = 9;
const DOT_COLS = 5;

function CrowdDots({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const dots = [];
  const gapX = width / DOT_COLS;
  const gapY = height / DOT_ROWS;
  for (let row = 0; row < DOT_ROWS; row++) {
    for (let col = 0; col < DOT_COLS; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={x + gapX * (col + 0.5)}
          cy={y + gapY * (row + 0.5)}
          r={2.1}
          className="fill-content-inverse"
          fillOpacity={0.35}
        />
      );
    }
  }
  return <>{dots}</>;
}

function PopulationExtremesArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-labelledby="report-cover-title"
    >
      <title id="report-cover-title">
        Bar illustration comparing India&apos;s population of 1.46 billion to Vatican City&apos;s
        population of 764
      </title>
      <rect width={480} height={320} className="fill-country-target-soft" />

      <line
        x1={40}
        y1={270}
        x2={440}
        y2={270}
        className="stroke-content-tertiary"
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />

      <rect x={64} y={36} width={132} height={234} rx={14} className="fill-country-target" />
      <CrowdDots x={64} y={36} width={132} height={234} />

      <rect x={252} y={256} width={40} height={14} rx={5} className="fill-country-home" />
      <circle cx={272} cy={244} r={5} className="fill-country-home" />

      <line
        x1={200}
        y1={70}
        x2={330}
        y2={70}
        className="stroke-content-secondary"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />
      <line
        x1={330}
        y1={70}
        x2={330}
        y2={240}
        className="stroke-content-secondary"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />

      <text x={130} y={26} textAnchor="middle" fontSize={22}>
        🇮🇳
      </text>
      <text
        x={130}
        y={296}
        textAnchor="middle"
        fontSize={17}
        fontWeight={700}
        className="fill-content-primary"
      >
        1.46B
      </text>

      <text x={272} y={228} textAnchor="middle" fontSize={16}>
        🇻🇦
      </text>
      <text
        x={272}
        y={296}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        className="fill-content-primary"
      >
        764
      </text>

      <text
        x={335}
        y={155}
        fontSize={13}
        fontWeight={700}
        className="fill-content-secondary"
      >
        ×1.9M
      </text>
    </svg>
  );
}

function AreaComparisonArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-labelledby="report-cover-title-area"
    >
      <title id="report-cover-title-area">
        Nested squares comparing Canada&apos;s land area of 9.98 million square kilometers to South
        Korea&apos;s 100 thousand square kilometers
      </title>
      <rect width={480} height={320} className="fill-country-target-soft" />

      <line
        x1={40}
        y1={270}
        x2={440}
        y2={270}
        className="stroke-content-tertiary"
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />

      <rect x={54} y={40} width={228} height={228} rx={16} className="fill-country-target" />

      <rect x={252} y={247} width={23} height={23} rx={5} className="fill-country-home" />

      <line
        x1={296}
        y1={70}
        x2={400}
        y2={70}
        className="stroke-content-secondary"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />
      <line
        x1={400}
        y1={70}
        x2={400}
        y2={240}
        className="stroke-content-secondary"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />

      <text x={168} y={26} textAnchor="middle" fontSize={22}>
        🇨🇦
      </text>
      <text
        x={168}
        y={296}
        textAnchor="middle"
        fontSize={17}
        fontWeight={700}
        className="fill-content-primary"
      >
        9.98M km²
      </text>

      <text x={263} y={240} textAnchor="middle" fontSize={14}>
        🇰🇷
      </text>
      <text
        x={263}
        y={296}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        className="fill-content-primary"
      >
        100K km²
      </text>

      <text
        x={405}
        y={155}
        fontSize={13}
        fontWeight={700}
        className="fill-content-secondary"
      >
        ×99.6
      </text>
    </svg>
  );
}

const artByVariant: Record<ReportCoverArtVariant, (props: { className?: string }) => ReactNode> = {
  "population-extremes": PopulationExtremesArt,
  "area-comparison": AreaComparisonArt,
};

export function ReportCoverArt({
  variant,
  className,
}: {
  variant: ReportCoverArtVariant;
  className?: string;
}) {
  const Art = artByVariant[variant];
  return (
    <div className={`bg-country-target-soft ${className ?? ""}`}>
      <Art className="h-full w-full" />
    </div>
  );
}
