export interface ClimateSeries {
  label: string;
  values: number[];
  colorVar: "--color-country-target" | "--color-country-home";
  dashed?: boolean;
}

function pointsFor(
  values: number[],
  width: number,
  height: number,
  min: number,
  max: number
): string {
  const stepX = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

/** Small line-style preview (solid/dashed) next to a name, so "which line is
 * which country" doesn't rely on color alone. */
function LegendLine({ series }: { series: ClimateSeries }) {
  return (
    <li className="flex items-center gap-1.5">
      <svg width={20} height={10} aria-hidden="true">
        <line
          x1={0}
          y1={5}
          x2={20}
          y2={5}
          stroke={`var(${series.colorVar})`}
          strokeWidth={2.5}
          strokeDasharray={series.dashed ? "5 4" : undefined}
          strokeLinecap="round"
        />
      </svg>
      {series.label}
    </li>
  );
}

/**
 * Monthly line chart used for both temperature and precipitation. Always
 * shows a visible title (which measurement) and a legend keyed to actual
 * country names (which line is which), since color alone doesn't explain
 * either.
 */
export function ClimateLineChart({
  title,
  series,
  monthLabels,
  unit,
  width = 560,
  height = 180,
  padding = 44,
}: {
  title: string;
  series: ClimateSeries[];
  monthLabels: string[];
  unit: string;
  width?: number;
  height?: number;
  padding?: number;
}) {
  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const range = rawMax - rawMin;
  const pad = range === 0 ? 2 : range * 0.15;
  const min = rawMin - pad;
  const max = rawMax + pad;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-content-secondary">{title}</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-hidden="true"
        style={{ maxWidth: width }}
      >
        <g transform={`translate(${padding}, ${padding})`}>
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="var(--color-neutral-200)"
          />
          <text
            x={-padding + 4}
            y={4}
            textAnchor="start"
            fontSize={11}
            fill="var(--color-content-tertiary)"
          >
            {Math.round(rawMax)}
            {unit}
          </text>
          <text
            x={-padding + 4}
            y={chartHeight}
            textAnchor="start"
            fontSize={11}
            fill="var(--color-content-tertiary)"
          >
            {Math.round(rawMin)}
            {unit}
          </text>
          {series.map((s) => (
            <polyline
              key={s.label}
              points={pointsFor(s.values, chartWidth, chartHeight, min, max)}
              fill="none"
              stroke={`var(${s.colorVar})`}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {monthLabels.map((label, i) => (
            <text
              key={label + i}
              x={(chartWidth / (monthLabels.length - 1)) * i}
              y={chartHeight + 18}
              fontSize={11}
              textAnchor="middle"
              fill="var(--color-content-tertiary)"
            >
              {label}
            </text>
          ))}
        </g>
      </svg>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-content-secondary">
        {series.map((s) => (
          <LegendLine key={s.label} series={s} />
        ))}
      </ul>
    </div>
  );
}
