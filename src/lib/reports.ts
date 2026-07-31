import "server-only";
import fs from "node:fs";
import path from "node:path";
import { reportSchema, type Report } from "./reportSchema";

const DATA_DIR = path.join(process.cwd(), "data", "reports");

let cache: Map<string, Report> | null = null;

function loadAll(): Map<string, Report> {
  if (cache) return cache;

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const map = new Map<string, Report>();

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
    const result = reportSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`Invalid report data in ${file}: ${result.error.message}`);
    }
    map.set(result.data.slug, result.data);
  }

  cache = map;
  return map;
}

export function getAllReports(): Report[] {
  return Array.from(loadAll().values()).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

export function getReport(slug: string): Report | undefined {
  return loadAll().get(slug);
}

export function getAllReportSlugs(): string[] {
  return Array.from(loadAll().keys());
}

export function localized(value: Record<string, string>, locale: string): string {
  return value[locale] ?? value.en;
}

export function localizedList(value: Record<string, string[]>, locale: string): string[] {
  return value[locale] ?? value.en;
}
