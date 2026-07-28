export interface AreaDatum {
  label: string;
  areaKm2: number;
  colorVar: "--color-country-target" | "--color-country-home";
}

/**
 * Same-scale overlay of the two countries' footprints, sized by sqrt(area)
 * (linear side length) so the ratio of rendered areas matches the ratio of
 * real areas. Uses plain squares, not real borders — see figcaption.
 *
 * When the two areas are close, the squares nearly coincide and blend into
 * what looks like one shape — the legend below is what actually tells them
 * apart, not just the outline colors.
 */
export function AreaOverlayChart({
  data,
  size = 240,
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
          const side = Math.max(0.06, Math.sqrt(d.areaKm2) / maxSide) * (size - 8);
          const offset = (size - side) / 2;
          return (
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
      <ul className="mt-2 space-y-1 text-xs text-content-secondary">
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
