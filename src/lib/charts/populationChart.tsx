export interface PopulationFigureDatum {
  label: string;
  value: number;
  colorVar: "--color-country-target" | "--color-country-home";
}

/** Simple bust/avatar silhouette, viewBox "0 0 100 100". Traced as a single
 * continuous outline (not a circle + a separate body shape overlaid) so
 * there's no internal seam where the two would otherwise meet. The head is
 * deliberately oversized relative to the body — at the small end of the
 * size range (population gaps span orders of magnitude) a subtler neck taper
 * disappears entirely and the whole figure reads as a plain blob. */
const PERSON_PATH =
  "M8,100 C8,68 20,44 34,36 A24,24 0 1,1 66,36 C80,44 92,68 92,100 Z";

/** The path's head rounds slightly above y=0 (true bbox is y:[-5.89, 100],
 * not y:[0, 100]) — reserve headroom for that so the largest figure's head
 * isn't clipped by the SVG viewport at scale = MAX_SCALE. */
const TOP_OVERSHOOT_PADDING = 12;

/** Bounds on the sqrt(value/max) size scale: never so small the figure reads
 * as an unrecognizable speck, never larger than the reference "100%" size. */
const MIN_SCALE = 0.22;
const MAX_SCALE = 1;

/**
 * Two person figures scaled so AREA (not just height) is proportional to
 * population — both width and height scale by sqrt(value/max), which keeps
 * the visual size honestly tied to quantity instead of exaggerating ratios.
 */
export function PopulationFigureChart({
  data,
  width = 480,
  iconMaxHeight = 150,
}: {
  data: [PopulationFigureDatum, PopulationFigureDatum];
  width?: number;
  iconMaxHeight?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const labelHeight = 44;
  const height = TOP_OVERSHOOT_PADDING + iconMaxHeight + labelHeight;
  const baselineY = TOP_OVERSHOOT_PADDING + iconMaxHeight;

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
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.sqrt(d.value / maxValue)));
        const iconSize = iconMaxHeight * scale;
        const cx = (width / data.length) * (i + 0.5);

        return (
          <g key={d.label}>
            <g
              transform={`translate(${cx - iconSize / 2}, ${baselineY - iconSize}) scale(${iconSize / 100})`}
            >
              <path d={PERSON_PATH} fill={`var(${d.colorVar})`} />
            </g>
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
