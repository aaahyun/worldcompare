export interface PopulationBarDatum {
  label: string;
  value: number;
  colorVar: "--color-country-target" | "--color-country-home";
}

/**
 * Proportional bar chart, sqrt-scaled so a much smaller value still renders
 * as a visible sliver rather than disappearing (population gaps can span
 * 2-3 orders of magnitude between two countries).
 */
export function PopulationBarChart({
  data,
  width = 480,
  barHeight = 28,
  gap = 16,
}: {
  data: [PopulationBarDatum, PopulationBarDatum];
  width?: number;
  barHeight?: number;
  gap?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const trackWidth = width - 120;
  const height = data.length * barHeight + (data.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-hidden="true"
      style={{ maxWidth: width }}
    >
      {data.map((d, i) => {
        const scaled = Math.sqrt(d.value / maxValue);
        const barWidth = Math.max(0.04, scaled) * trackWidth;
        const y = i * (barHeight + gap);
        return (
          <g key={d.label}>
            <rect
              x={0}
              y={y}
              width={trackWidth}
              height={barHeight}
              rx={barHeight / 2}
              fill="var(--color-surface-100)"
            />
            <rect
              x={0}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={barHeight / 2}
              fill={`var(${d.colorVar})`}
            />
            <text
              x={trackWidth + 12}
              y={y + barHeight / 2}
              dominantBaseline="middle"
              fontSize={13}
              fill="var(--color-content-secondary)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
