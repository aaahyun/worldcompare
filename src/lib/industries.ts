import en from "../../locales/en.json";

const industryLabels: Record<string, string> = en.enums.industries;

export function industryLabelEn(key: string): string {
  return industryLabels[key] ?? key;
}
