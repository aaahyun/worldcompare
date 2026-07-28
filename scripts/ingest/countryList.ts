export interface CountryListEntry {
  slug: string;
  iso2: string;
  iso3: string;
}

/** Countries this pipeline manages. Extend this list to grow past 23 toward the PRD's 100. */
export const countryList: CountryListEntry[] = [
  { slug: "iceland", iso2: "IS", iso3: "ISL" },
  { slug: "south-korea", iso2: "KR", iso3: "KOR" },
  { slug: "japan", iso2: "JP", iso3: "JPN" },
  { slug: "united-states", iso2: "US", iso3: "USA" },
  { slug: "united-kingdom", iso2: "GB", iso3: "GBR" },
  { slug: "france", iso2: "FR", iso3: "FRA" },
  { slug: "germany", iso2: "DE", iso3: "DEU" },
  { slug: "italy", iso2: "IT", iso3: "ITA" },
  { slug: "spain", iso2: "ES", iso3: "ESP" },
  { slug: "china", iso2: "CN", iso3: "CHN" },
  { slug: "india", iso2: "IN", iso3: "IND" },
  { slug: "thailand", iso2: "TH", iso3: "THA" },
  { slug: "vietnam", iso2: "VN", iso3: "VNM" },
  { slug: "australia", iso2: "AU", iso3: "AUS" },
  { slug: "canada", iso2: "CA", iso3: "CAN" },
  { slug: "mexico", iso2: "MX", iso3: "MEX" },
  { slug: "brazil", iso2: "BR", iso3: "BRA" },
  { slug: "egypt", iso2: "EG", iso3: "EGY" },
  { slug: "turkey", iso2: "TR", iso3: "TUR" },
  { slug: "indonesia", iso2: "ID", iso3: "IDN" },
  { slug: "philippines", iso2: "PH", iso3: "PHL" },
  { slug: "switzerland", iso2: "CH", iso3: "CHE" },
  { slug: "netherlands", iso2: "NL", iso3: "NLD" },
];
