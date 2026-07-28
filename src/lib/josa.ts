const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;

function hasBatchim(word: string): boolean {
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_LAST) return false;
  return (code - HANGUL_BASE) % 28 !== 0;
}

/** Attaches 은/는 (topic marker) based on whether `word` ends in a batchim. */
export function eunNeun(word: string): string {
  return word + (hasBatchim(word) ? "은" : "는");
}

/** Attaches 이/가 (subject marker) based on whether `word` ends in a batchim. */
export function iGa(word: string): string {
  return word + (hasBatchim(word) ? "이" : "가");
}

/** Attaches 과/와 ("and"/"with") based on whether `word` ends in a batchim. */
export function gwaWa(word: string): string {
  return word + (hasBatchim(word) ? "과" : "와");
}

/** Attaches 을/를 (object marker) based on whether `word` ends in a batchim. */
export function eulReul(word: string): string {
  return word + (hasBatchim(word) ? "을" : "를");
}
