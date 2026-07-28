import { fetchWithRetry } from "./fetchRetry";

export interface ClimateNormals {
  temp_high_c: number[];
  temp_low_c: number[];
  precip_mm: number[];
}

interface ArchiveResponse {
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Monthly averages from the most recent full calendar year of daily
 * observations — a single-year proxy for a true 30-year climate normal,
 * traded for one lightweight API call per country instead of decades of them.
 */
export async function fetchClimateNormals(lat: number, lng: number): Promise<ClimateNormals> {
  const year = new Date().getUTCFullYear() - 1;
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}` +
    `&start_date=${year}-01-01&end_date=${year}-12-31` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=UTC`;

  const res = await fetchWithRetry(url, {}, 20, 20000);

  const body = (await res.json()) as ArchiveResponse;
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum } = body.daily;

  const highs: number[][] = Array.from({ length: 12 }, () => []);
  const lows: number[][] = Array.from({ length: 12 }, () => []);
  const precip: number[] = Array(12).fill(0);

  time.forEach((date, i) => {
    const month = Number(date.slice(5, 7)) - 1;
    const high = temperature_2m_max[i];
    const low = temperature_2m_min[i];
    const p = precipitation_sum[i];
    if (high !== null) highs[month].push(high);
    if (low !== null) lows[month].push(low);
    if (p !== null) precip[month] += p;
  });

  const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

  return {
    temp_high_c: highs.map((m) => round1(avg(m))),
    temp_low_c: lows.map((m) => round1(avg(m))),
    precip_mm: precip.map((p) => Math.round(p)),
  };
}
