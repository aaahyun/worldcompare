export interface ClimateSeries {
  label: string;
  tempHighC: number[];
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

export function ClimateLineChart({
  series,
  monthLabels,
  width = 560,
  height = 180,
  padding = 28,
}: {
  series: ClimateSeries[];
  monthLabels: string[];
  width?: number;
  height?: number;
  padding?: number;
}) {
  const allValues = series.flatMap((s) => s.tempHighC);
  const min = Math.min(...allValues) - 2;
  const max = Math.max(...allValues) + 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return (
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
        {series.map((s) => (
          <polyline
            key={s.label}
            points={pointsFor(s.tempHighC, chartWidth, chartHeight, min, max)}
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
            fontSize={10}
            textAnchor="middle"
            fill="var(--color-content-tertiary)"
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
}
