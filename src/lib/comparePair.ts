export const PAIR_DELIMITER = "-vs-";

export function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf(PAIR_DELIMITER);
  if (idx === -1) return null;
  const a = pair.slice(0, idx);
  const b = pair.slice(idx + PAIR_DELIMITER.length);
  if (!a || !b) return null;
  return [a, b];
}
