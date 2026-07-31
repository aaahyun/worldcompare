type PlugType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "I" | "J" | "L" | "M" | "N" | "O";

function RoundPin({ cx, cy, r = 3.2 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" />;
}

function FlatPin({
  x,
  y,
  w = 4,
  h = 14,
  rotate,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: string;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={1} fill="currentColor" transform={rotate} />;
}

function pins(type: PlugType) {
  switch (type) {
    // North America / Japan, ungrounded — two parallel flat blades
    case "A":
      return (
        <>
          <FlatPin x={17} y={15} />
          <FlatPin x={27} y={15} />
        </>
      );
    // North America, grounded — two parallel flat blades + round earth pin
    case "B":
      return (
        <>
          <FlatPin x={17} y={13} />
          <FlatPin x={27} y={13} />
          <RoundPin cx={24} cy={33} />
        </>
      );
    // Europlug — two round pins, unearthed
    case "C":
      return (
        <>
          <RoundPin cx={18} cy={24} />
          <RoundPin cx={30} cy={24} />
        </>
      );
    // Old British / India — three round pins in a triangle, large bottom pin
    case "D":
      return (
        <>
          <RoundPin cx={17} cy={17} r={2.6} />
          <RoundPin cx={31} cy={17} r={2.6} />
          <RoundPin cx={24} cy={32} r={3.6} />
        </>
      );
    // France — two round pins + male earth pin offset above center
    case "E":
      return (
        <>
          <RoundPin cx={24} cy={16} r={2.6} />
          <RoundPin cx={17} cy={30} />
          <RoundPin cx={31} cy={30} />
        </>
      );
    // Schuko (Germany + most of EU) — two round pins + two earth clips on the sides
    case "F":
      return (
        <>
          <rect x={11} y={22} width={4} height={5} rx={1} fill="currentColor" />
          <rect x={33} y={22} width={4} height={5} rx={1} fill="currentColor" />
          <RoundPin cx={18} cy={24} />
          <RoundPin cx={30} cy={24} />
        </>
      );
    // UK — three rectangular pins, earth on top, live/neutral below
    case "G":
      return (
        <>
          <FlatPin x={22} y={12} w={4} h={9} />
          <FlatPin x={14} y={27} w={9} h={4} />
          <FlatPin x={25} y={27} w={9} h={4} />
        </>
      );
    // Australia / China — two angled flat blades (V-shape) + straight earth pin
    case "I":
      return (
        <>
          <FlatPin x={16} y={14} w={4} h={13} rotate="rotate(-20 18 20)" />
          <FlatPin x={28} y={14} w={4} h={13} rotate="rotate(20 30 20)" />
          <FlatPin x={22} y={30} w={4} h={9} />
        </>
      );
    // Switzerland — three round pins, tight triangle
    case "J":
      return (
        <>
          <RoundPin cx={18} cy={19} r={2.6} />
          <RoundPin cx={30} cy={19} r={2.6} />
          <RoundPin cx={24} cy={31} r={2.6} />
        </>
      );
    // Italy — three round pins in a single line
    case "L":
      return (
        <>
          <RoundPin cx={24} cy={15} r={2.8} />
          <RoundPin cx={24} cy={24} r={2.8} />
          <RoundPin cx={24} cy={33} r={2.8} />
        </>
      );
    // South Africa — three large round pins in a wide triangle
    case "M":
      return (
        <>
          <RoundPin cx={16} cy={17} r={3.4} />
          <RoundPin cx={32} cy={17} r={3.4} />
          <RoundPin cx={24} cy={33} r={4} />
        </>
      );
    // Brazil — three round pins, earth centered above the pair
    case "N":
      return (
        <>
          <RoundPin cx={24} cy={15} r={2.6} />
          <RoundPin cx={17} cy={30} />
          <RoundPin cx={31} cy={30} />
        </>
      );
    // Thailand — three round pins, earth centered below the pair
    case "O":
      return (
        <>
          <RoundPin cx={17} cy={17} />
          <RoundPin cx={31} cy={17} />
          <RoundPin cx={24} cy={32} r={3.2} />
        </>
      );
    default:
      return null;
  }
}

export function PlugIcon({ type, className }: { type: string; className?: string }) {
  const normalized = type.toUpperCase() as PlugType;
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={`Type ${normalized} plug`}
    >
      <rect
        x={3}
        y={3}
        width={42}
        height={42}
        rx={12}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2.5}
      />
      {pins(normalized)}
    </svg>
  );
}
