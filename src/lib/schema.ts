import { z } from "zod";

const localizedString = z.record(z.string(), z.string()).refine(
  (names) => "en" in names && "ko" in names,
  { message: "names must at least include every locale configured in src/i18n/routing.ts" }
);

export const continentSchema = z.enum([
  "africa",
  "asia",
  "europe",
  "north_america",
  "south_america",
  "oceania",
  "antarctica",
]);

export type Continent = z.infer<typeof continentSchema>;

export const englishProficiencySchema = z.enum([
  "very_high",
  "high",
  "moderate",
  "low",
  "very_low",
]);

const yearedValue = z.object({
  value: z.number(),
  year: z.number().int(),
});

const sourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  retrieved: z.string(),
});

export const countrySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  iso2: z.string().length(2),
  iso3: z.string().length(3),
  names: localizedString,
  capital: z.object({
    names: localizedString,
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  continent: continentSchema,
  area_km2: z.number().positive(),
  population: yearedValue,
  gdp_nominal_usd: yearedValue,
  gdp_per_capita_usd: yearedValue,
  median_age: z.number().positive().optional(),
  life_expectancy: z.number().positive().optional(),
  urbanization_pct: z.number().min(0).max(100).optional(),
  religions: z
    .array(
      z.object({
        key: z.string(),
        pct: z.number().min(0).max(100),
      })
    )
    .optional(),
  languages: z.object({
    official: z.array(z.string()),
    english_proficiency: englishProficiencySchema,
  }),
  industries: z.array(z.string()).optional(),
  currency: z.object({
    code: z.string().length(3),
    usd_rate_snapshot: z.number().positive().optional(),
    snapshot_date: z.string().optional(),
  }),
  timezone: z.array(z.string()).min(1),
  electricity: z.object({
    voltage: z.number(),
    plugs: z.array(z.string()),
  }),
  driving_side: z.enum(["left", "right"]),
  calling_code: z.string().regex(/^\+\d+$/),
  emergency: z.string(),
  climate: z
    .object({
      temp_high_c: z.array(z.number()).length(12),
      temp_low_c: z.array(z.number()).length(12),
      precip_mm: z.array(z.number()).length(12),
    })
    .optional(),
  geometry_svg: z.string().optional(),
  sources: z.record(z.string(), sourceSchema),
});

export type Country = z.infer<typeof countrySchema>;
