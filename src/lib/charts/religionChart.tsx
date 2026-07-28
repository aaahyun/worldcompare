const SEGMENT_COLORS = [
  "var(--color-brand-500)",
  "var(--color-brand-300)",
  "var(--color-neutral-400)",
  "var(--color-neutral-300)",
  "var(--color-neutral-200)",
];

export interface ReligionSegment {
  label: string;
  pct: number;
}

/** Single-row stacked bar — pattern-safe alternative to a color-only donut. */
export function ReligionStackedBar({
  segments,
  width = 480,
  height = 32,
}: {
  segments: ReligionSegment[];
  width?: number;
  height?: number;
}) {
  const bars = segments.reduce<Array<ReligionSegment & { x: number; w: number }>>((acc, s) => {
    const prev = acc[acc.length - 1];
    const x = prev ? prev.x + prev.w : 0;
    acc.push({ ...s, x, w: (s.pct / 100) * width });
    return acc;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-hidden="true"
      style={{ maxWidth: width }}
    >
      <rect x={0} y={0} width={width} height={height} rx={6} fill="var(--color-surface-100)" />
      {bars.map((s, i) => (
        <rect
          key={s.label}
          x={s.x}
          y={0}
          width={s.w}
          height={height}
          fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
        />
      ))}
    </svg>
  );
}
