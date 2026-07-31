import { z } from "zod";

const localizedString = z.record(z.string(), z.string()).refine(
  (names) => "en" in names && "ko" in names,
  { message: "must at least include every locale configured in src/i18n/routing.ts" }
);

const localizedStringArray = z.record(z.string(), z.array(z.string())).refine(
  (names) => "en" in names && "ko" in names,
  { message: "must at least include every locale configured in src/i18n/routing.ts" }
);

const reportSectionSchema = z.object({
  heading: localizedString,
  body: localizedStringArray,
});

const reportStatSchema = z.object({
  label: localizedString,
  value: localizedString,
});

const reportSourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  retrieved: z.string(),
});

export const reportCoverArtSchema = z.enum(["population-extremes"]);
export type ReportCoverArt = z.infer<typeof reportCoverArtSchema>;

export const reportSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readingMinutes: z.number().int().positive(),
  coverArt: reportCoverArtSchema,
  tags: localizedStringArray,
  title: localizedString,
  excerpt: localizedString,
  stats: z.array(reportStatSchema).optional(),
  sections: z.array(reportSectionSchema).min(1),
  sources: z.array(reportSourceSchema).min(1),
});

export type Report = z.infer<typeof reportSchema>;
