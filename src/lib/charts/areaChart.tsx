export interface AreaDatum {
  label: string;
  areaKm2: number;
  colorVar: "--color-country-target" | "--color-country-home";
  /** Simplified real border outline, normalized to viewBox "0 0 100 100". */
  geometryPath?: string;
}

/**
 * Overlays the two countries' real border outlines at the same scale — both
 * sized by sqrt(area) (linear side length) so the ratio of rendered areas
 * matches the ratio of real areas, "true size" comparison style. Falls back
 * to a plain rounded square if a shape is missing so the chart still renders.
 */
export function AreaOverlayChart({
  data,
  size = 260,
}: {
  data: [AreaDatum, AreaDatum];
  size?: number;
}) {
  const maxSide = Math.sqrt(Math.max(...data.map((d) => d.areaKm2)));
  const sorted = [...data].sort((a, b) => b.areaKm2 - a.areaKm2);

  return (
    <div style={{ maxWidth: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-hidden="true">
        {sorted.map((d) => {
          const side = Math.max(0.1, Math.sqrt(d.areaKm2) / maxSide) * (size - 8);
          const offset = (size - side) / 2;
          return d.geometryPath ? (
            <g key={d.label} transform={`translate(${offset}, ${offset}) scale(${side / 100})`}>
              <path
                d={d.geometryPath}
                fill={`var(${d.colorVar})`}
                fillOpacity={0.4}
                stroke={`var(${d.colorVar})`}
                strokeWidth={0.75}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ) : (
            <rect
              key={d.label}
              x={offset}
              y={offset}
              width={side}
              height={side}
              rx={8}
              fill={`var(${d.colorVar})`}
              fillOpacity={0.35}
              stroke={`var(${d.colorVar})`}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <ul className="mt-2 space-y-1 text-sm text-content-secondary">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: `var(${d.colorVar})` }}
            />
            {d.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
