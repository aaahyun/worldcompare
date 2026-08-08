export interface GdpDatum {
  label: string;
  valueUsd: number;
  colorVar: "--color-country-target" | "--color-country-home";
}

/** GDP gaps between compared countries can span orders of magnitude — floor
 * the shorter bar so it stays a visible bar rather than a sliver. */
const MIN_SCALE = 0.05;

/** Simple two-bar column chart for nominal GDP. Bar height is linear in
 * value (unlike the sqrt-scaled area/population charts) since a bar's whole
 * point is that height reads directly as magnitude. */
export function GdpBarChart({
  data,
  width = 320,
  barMaxHeight = 150,
}: {
  data: [GdpDatum, GdpDatum];
  width?: number;
  barMaxHeight?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.valueUsd));
  const barWidth = width / data.length / 2.6;
  const labelHeight = 44;
  const height = barMaxHeight + labelHeight;
  const baselineY = barMaxHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-hidden="true"
      style={{ maxWidth: width }}
    >
      <line
        x1={0}
        y1={baselineY}
        x2={width}
        y2={baselineY}
        stroke="var(--color-neutral-200)"
      />
      {data.map((d, i) => {
        const scale = Math.max(MIN_SCALE, d.valueUsd / maxValue);
        const barHeight = barMaxHeight * scale;
        const cx = (width / data.length) * (i + 0.5);

        return (
          <g key={d.label}>
            <rect
              x={cx - barWidth / 2}
              y={baselineY - barHeight}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill={`var(${d.colorVar})`}
            />
            <text
              x={cx}
              y={baselineY + 22}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              fill={`var(${d.colorVar})`}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
