export interface ManualOverride {
  capitalNameKo: string;
  namesKoFallback: string;
  /** Overrides world-countries' Korean translation outright (e.g. DPRK's "조선" isn't how the target audience refers to it). */
  namesKoOverride?: string;
  religions: { key: string; pct: number }[] | null;
  languagesOfficial: string[];
  englishProficiency: "very_high" | "high" | "moderate" | "low" | "very_low";
  industries: string[] | null;
  medianAge: number | null;
  timezone: string[];
  electricity: { voltage: number; plugs: string[] };
  drivingSide: "left" | "right";
  emergency: string;
  currencyUsdRateSnapshot: number | null;
  /**
   * For countries the World Bank has no data on at all (e.g. North Korea isn't a WB
   * member and reports no official statistics) — supplies population/GDP from the
   * next-best reputable estimate instead of letting the pipeline throw.
   */
  economicOverride?: {
    population: { value: number; year: number };
    gdpNominalUsd: { value: number; year: number };
    gdpPerCapitaUsd: { value: number; year: number };
    source: { name: string; url: string; retrieved: string };
  };
}

/**
 * Facts with no reliable free/keyless API: religions (Pew/Wikipedia), industries (CIA
 * Factbook), English proficiency (EF EPI, licensed), timezone/electricity/driving side
 * (no single clean source), and the capital's Korean name (Wikidata labels for capitals
 * tend to be formal administrative names, e.g. '서울특별시' instead of '서울').
 * Add an entry here for every new slug in countryList.ts before running the pipeline —
 * build.ts throws if one is missing.
 */
export const manualOverrides: Record<string, ManualOverride> = {
  australia: {
    capitalNameKo: "캔버라",
    namesKoFallback: "호주",
    religions: [
      {
        key: "christianity",
        pct: 43.9
      },
      {
        key: "none",
        pct: 38.9
      },
      {
        key: "other",
        pct: 17.2
      }
    ],
    languagesOfficial: [
      "en"
    ],
    englishProficiency: "very_high",
    industries: [
      "mining",
      "agriculture",
      "tourism",
      "finance"
    ],
    medianAge: 38.4,
    timezone: [
      "Australia/Sydney"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "I"
      ]
    },
    drivingSide: "left",
    emergency: "000",
    currencyUsdRateSnapshot: 1.52
  },
  brazil: {
    capitalNameKo: "브라질리아",
    namesKoFallback: "브라질",
    religions: [
      {
        key: "christianity",
        pct: 86.8
      },
      {
        key: "none",
        pct: 8
      },
      {
        key: "other",
        pct: 5.2
      }
    ],
    languagesOfficial: [
      "pt"
    ],
    englishProficiency: "low",
    industries: [
      "agriculture",
      "mining",
      "manufacturing",
      "oil_gas"
    ],
    medianAge: 34.6,
    timezone: [
      "America/Sao_Paulo"
    ],
    electricity: {
      voltage: 127,
      plugs: [
        "C",
        "N"
      ]
    },
    drivingSide: "right",
    emergency: "190",
    currencyUsdRateSnapshot: 5.5
  },
  canada: {
    capitalNameKo: "오타와",
    namesKoFallback: "캐나다",
    religions: [
      {
        key: "christianity",
        pct: 53.3
      },
      {
        key: "none",
        pct: 34.6
      },
      {
        key: "other",
        pct: 12.1
      }
    ],
    languagesOfficial: [
      "en",
      "fr"
    ],
    englishProficiency: "very_high",
    industries: [
      "mining",
      "manufacturing",
      "technology",
      "oil_gas"
    ],
    medianAge: 41.1,
    timezone: [
      "America/Toronto"
    ],
    electricity: {
      voltage: 120,
      plugs: [
        "A",
        "B"
      ]
    },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 1.37
  },
  china: {
    capitalNameKo: "베이징",
    namesKoFallback: "중국",
    religions: [
      {
        key: "none",
        pct: 52
      },
      {
        key: "folk",
        pct: 22
      },
      {
        key: "buddhism",
        pct: 18
      },
      {
        key: "christianity",
        pct: 5
      },
      {
        key: "islam",
        pct: 2
      },
      {
        key: "other",
        pct: 1
      }
    ],
    languagesOfficial: [
      "zh"
    ],
    englishProficiency: "low",
    industries: [
      "manufacturing",
      "electronics",
      "technology",
      "steel"
    ],
    medianAge: 39.8,
    timezone: [
      "Asia/Shanghai"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "A",
        "C",
        "I"
      ]
    },
    drivingSide: "right",
    emergency: "110",
    currencyUsdRateSnapshot: 7.25
  },
  egypt: {
    capitalNameKo: "카이로",
    namesKoFallback: "이집트",
    religions: [
      {
        key: "islam",
        pct: 90
      },
      {
        key: "christianity",
        pct: 10
      }
    ],
    languagesOfficial: [
      "ar"
    ],
    englishProficiency: "low",
    industries: [
      "tourism",
      "oil_gas",
      "agriculture",
      "textiles"
    ],
    medianAge: 25.3,
    timezone: [
      "Africa/Cairo"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "122",
    currencyUsdRateSnapshot: 48.5
  },
  france: {
    capitalNameKo: "파리",
    namesKoFallback: "프랑스",
    religions: [
      {
        key: "christianity",
        pct: 47
      },
      {
        key: "none",
        pct: 40
      },
      {
        key: "islam",
        pct: 8
      },
      {
        key: "other",
        pct: 5
      }
    ],
    languagesOfficial: [
      "fr"
    ],
    englishProficiency: "moderate",
    industries: [
      "tourism",
      "manufacturing",
      "aerospace",
      "agriculture"
    ],
    medianAge: 42.3,
    timezone: [
      "Europe/Paris"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "E"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.93
  },
  germany: {
    capitalNameKo: "베를린",
    namesKoFallback: "독일",
    religions: [
      {
        key: "christianity",
        pct: 55
      },
      {
        key: "none",
        pct: 38
      },
      {
        key: "islam",
        pct: 5.5
      },
      {
        key: "other",
        pct: 1.5
      }
    ],
    languagesOfficial: [
      "de"
    ],
    englishProficiency: "high",
    industries: [
      "automotive",
      "manufacturing",
      "machinery",
      "chemicals"
    ],
    medianAge: 45.7,
    timezone: [
      "Europe/Berlin"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.93
  },
  iceland: {
    capitalNameKo: "레이캬비크",
    namesKoFallback: "아이슬란드",
    religions: [
      {
        key: "christianity",
        pct: 67.4
      },
      {
        key: "none",
        pct: 26.1
      },
      {
        key: "other",
        pct: 6.5
      }
    ],
    languagesOfficial: [
      "is"
    ],
    englishProficiency: "very_high",
    industries: [
      "tourism",
      "fisheries",
      "aluminum",
      "geothermal_energy"
    ],
    medianAge: 37.1,
    timezone: [
      "Atlantic/Reykjavik"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 138.2
  },
  india: {
    capitalNameKo: "뉴델리",
    namesKoFallback: "인도",
    religions: [
      {
        key: "hinduism",
        pct: 79.8
      },
      {
        key: "islam",
        pct: 14.2
      },
      {
        key: "christianity",
        pct: 2.3
      },
      {
        key: "other",
        pct: 3.7
      }
    ],
    languagesOfficial: [
      "hi",
      "en"
    ],
    englishProficiency: "moderate",
    industries: [
      "technology",
      "textiles",
      "agriculture",
      "manufacturing"
    ],
    medianAge: 28.2,
    timezone: [
      "Asia/Kolkata"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "D",
        "M"
      ]
    },
    drivingSide: "left",
    emergency: "112",
    currencyUsdRateSnapshot: 83.5
  },
  indonesia: {
    capitalNameKo: "자카르타",
    namesKoFallback: "인도네시아",
    religions: [
      {
        key: "islam",
        pct: 87.2
      },
      {
        key: "christianity",
        pct: 9.9
      },
      {
        key: "hinduism",
        pct: 1.7
      },
      {
        key: "other",
        pct: 1.2
      }
    ],
    languagesOfficial: [
      "id"
    ],
    englishProficiency: "low",
    industries: [
      "agriculture",
      "manufacturing",
      "mining",
      "textiles"
    ],
    medianAge: 30.2,
    timezone: [
      "Asia/Jakarta"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "left",
    emergency: "112",
    currencyUsdRateSnapshot: 15900
  },
  italy: {
    capitalNameKo: "로마",
    namesKoFallback: "이탈리아",
    religions: [
      {
        key: "christianity",
        pct: 74
      },
      {
        key: "none",
        pct: 22
      },
      {
        key: "other",
        pct: 4
      }
    ],
    languagesOfficial: [
      "it"
    ],
    englishProficiency: "moderate",
    industries: [
      "manufacturing",
      "tourism",
      "automotive",
      "agriculture"
    ],
    medianAge: 48.4,
    timezone: [
      "Europe/Rome"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F",
        "L"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.93
  },
  japan: {
    capitalNameKo: "도쿄",
    namesKoFallback: "일본",
    religions: [
      {
        key: "folk",
        pct: 48
      },
      {
        key: "buddhism",
        pct: 34
      },
      {
        key: "christianity",
        pct: 1.5
      },
      {
        key: "none",
        pct: 16.5
      }
    ],
    languagesOfficial: [
      "ja"
    ],
    englishProficiency: "low",
    industries: [
      "automotive",
      "electronics",
      "technology",
      "manufacturing",
      "steel"
    ],
    medianAge: 49.9,
    timezone: [
      "Asia/Tokyo"
    ],
    electricity: {
      voltage: 100,
      plugs: [
        "A",
        "B"
      ]
    },
    drivingSide: "left",
    emergency: "110",
    currencyUsdRateSnapshot: 157.3
  },
  mexico: {
    capitalNameKo: "멕시코시티",
    namesKoFallback: "멕시코",
    religions: [
      {
        key: "christianity",
        pct: 88
      },
      {
        key: "none",
        pct: 9
      },
      {
        key: "other",
        pct: 3
      }
    ],
    languagesOfficial: [
      "es"
    ],
    englishProficiency: "low",
    industries: [
      "manufacturing",
      "automotive",
      "electronics",
      "agriculture"
    ],
    medianAge: 29.9,
    timezone: [
      "America/Mexico_City"
    ],
    electricity: {
      voltage: 127,
      plugs: [
        "A",
        "B"
      ]
    },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 18.3
  },
  netherlands: {
    capitalNameKo: "암스테르담",
    namesKoFallback: "네덜란드",
    religions: [
      {
        key: "none",
        pct: 54.1
      },
      {
        key: "christianity",
        pct: 34.9
      },
      {
        key: "islam",
        pct: 5.2
      },
      {
        key: "other",
        pct: 5.8
      }
    ],
    languagesOfficial: [
      "nl"
    ],
    englishProficiency: "very_high",
    industries: [
      "agriculture",
      "technology",
      "finance",
      "manufacturing"
    ],
    medianAge: 42.6,
    timezone: [
      "Europe/Amsterdam"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.93
  },
  philippines: {
    capitalNameKo: "마닐라",
    namesKoFallback: "필리핀",
    religions: [
      {
        key: "christianity",
        pct: 92.6
      },
      {
        key: "islam",
        pct: 5.5
      },
      {
        key: "other",
        pct: 1.9
      }
    ],
    languagesOfficial: [
      "tl",
      "en"
    ],
    englishProficiency: "high",
    industries: [
      "agriculture",
      "electronics",
      "manufacturing",
      "tourism"
    ],
    medianAge: 25.7,
    timezone: [
      "Asia/Manila"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "A",
        "B",
        "C"
      ]
    },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 58.7
  },
  "south-korea": {
    capitalNameKo: "서울",
    namesKoFallback: "대한민국",
    religions: [
      {
        key: "none",
        pct: 56.1
      },
      {
        key: "christianity",
        pct: 27.6
      },
      {
        key: "buddhism",
        pct: 15.5
      },
      {
        key: "other",
        pct: 0.8
      }
    ],
    languagesOfficial: [
      "ko"
    ],
    englishProficiency: "moderate",
    industries: [
      "semiconductors",
      "automotive",
      "electronics",
      "shipbuilding",
      "steel"
    ],
    medianAge: 44.5,
    timezone: [
      "Asia/Seoul"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 1350
  },
  spain: {
    capitalNameKo: "마드리드",
    namesKoFallback: "스페인",
    religions: [
      {
        key: "christianity",
        pct: 58.6
      },
      {
        key: "none",
        pct: 38.7
      },
      {
        key: "other",
        pct: 2.7
      }
    ],
    languagesOfficial: [
      "es"
    ],
    englishProficiency: "moderate",
    industries: [
      "tourism",
      "automotive",
      "agriculture",
      "manufacturing"
    ],
    medianAge: 44.9,
    timezone: [
      "Europe/Madrid"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.93
  },
  switzerland: {
    capitalNameKo: "베른",
    namesKoFallback: "스위스",
    religions: [
      {
        key: "christianity",
        pct: 62.7
      },
      {
        key: "none",
        pct: 29.4
      },
      {
        key: "islam",
        pct: 5.4
      },
      {
        key: "other",
        pct: 2.5
      }
    ],
    languagesOfficial: [
      "de",
      "fr",
      "it"
    ],
    englishProficiency: "high",
    industries: [
      "finance",
      "pharmaceuticals",
      "manufacturing",
      "tourism"
    ],
    medianAge: 43.1,
    timezone: [
      "Europe/Zurich"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "J"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.9
  },
  thailand: {
    capitalNameKo: "방콕",
    namesKoFallback: "태국",
    religions: [
      {
        key: "buddhism",
        pct: 93.2
      },
      {
        key: "islam",
        pct: 5.4
      },
      {
        key: "christianity",
        pct: 1.2
      },
      {
        key: "other",
        pct: 0.2
      }
    ],
    languagesOfficial: [
      "th"
    ],
    englishProficiency: "low",
    industries: [
      "tourism",
      "agriculture",
      "automotive",
      "electronics"
    ],
    medianAge: 40.1,
    timezone: [
      "Asia/Bangkok"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "A",
        "B",
        "C",
        "O"
      ]
    },
    drivingSide: "left",
    emergency: "191",
    currencyUsdRateSnapshot: 36.5
  },
  turkey: {
    capitalNameKo: "앙카라",
    namesKoFallback: "튀르키예",
    religions: [
      {
        key: "islam",
        pct: 99.2
      },
      {
        key: "other",
        pct: 0.8
      }
    ],
    languagesOfficial: [
      "tr"
    ],
    englishProficiency: "low",
    industries: [
      "manufacturing",
      "textiles",
      "automotive",
      "tourism"
    ],
    medianAge: 34,
    timezone: [
      "Europe/Istanbul"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "C",
        "F"
      ]
    },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 33
  },
  "united-kingdom": {
    capitalNameKo: "런던",
    namesKoFallback: "영국",
    religions: [
      {
        key: "christianity",
        pct: 46.2
      },
      {
        key: "none",
        pct: 37.2
      },
      {
        key: "islam",
        pct: 6.5
      },
      {
        key: "other",
        pct: 10.1
      }
    ],
    languagesOfficial: [
      "en"
    ],
    englishProficiency: "very_high",
    industries: [
      "finance",
      "manufacturing",
      "technology",
      "automotive"
    ],
    medianAge: 40.6,
    timezone: [
      "Europe/London"
    ],
    electricity: {
      voltage: 230,
      plugs: [
        "G"
      ]
    },
    drivingSide: "left",
    emergency: "999",
    currencyUsdRateSnapshot: 0.78
  },
  "united-states": {
    capitalNameKo: "워싱턴 D.C.",
    namesKoFallback: "미국",
    religions: [
      {
        key: "christianity",
        pct: 63
      },
      {
        key: "none",
        pct: 29
      },
      {
        key: "other",
        pct: 8
      }
    ],
    languagesOfficial: [
      "en"
    ],
    englishProficiency: "very_high",
    industries: [
      "technology",
      "finance",
      "manufacturing",
      "aerospace"
    ],
    medianAge: 38.9,
    timezone: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles"
    ],
    electricity: {
      voltage: 120,
      plugs: [
        "A",
        "B"
      ]
    },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 1
  },
  vietnam: {
    capitalNameKo: "하노이",
    namesKoFallback: "베트남",
    religions: [
      {
        key: "folk",
        pct: 45.3
      },
      {
        key: "none",
        pct: 29.6
      },
      {
        key: "buddhism",
        pct: 16.4
      },
      {
        key: "christianity",
        pct: 8.2
      },
      {
        key: "other",
        pct: 0.5
      }
    ],
    languagesOfficial: [
      "vi"
    ],
    englishProficiency: "low",
    industries: [
      "manufacturing",
      "electronics",
      "textiles",
      "agriculture"
    ],
    medianAge: 32.5,
    timezone: [
      "Asia/Ho_Chi_Minh"
    ],
    electricity: {
      voltage: 220,
      plugs: [
        "A",
        "C"
      ]
    },
    drivingSide: "right",
    emergency: "113",
    currencyUsdRateSnapshot: 25400
  },
  albania: {
    capitalNameKo: "티라나",
    namesKoFallback: "알바니아",
    religions: [
      { key: "islam", pct: 58.8 },
      { key: "christianity", pct: 16.8 },
      { key: "none", pct: 2.5 },
      { key: "other", pct: 21.9 }
    ],
    languagesOfficial: ["sq"],
    englishProficiency: "moderate",
    industries: ["tourism", "agriculture", "textiles", "mining"],
    medianAge: 35.8,
    timezone: ["Europe/Tirane"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 82.5
  },
  andorra: {
    capitalNameKo: "안도라라베야",
    namesKoFallback: "안도라",
    religions: [
      { key: "christianity", pct: 90.8 },
      { key: "none", pct: 6.9 },
      { key: "other", pct: 2.3 }
    ],
    languagesOfficial: ["ca"],
    englishProficiency: "moderate",
    industries: ["tourism", "banking", "retail", "agriculture"],
    medianAge: 46.2,
    timezone: ["Europe/Andorra"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.92
  },
  argentina: {
    capitalNameKo: "부에노스아이레스",
    namesKoFallback: "아르헨티나",
    religions: [
      { key: "christianity", pct: 78.2 },
      { key: "none", pct: 18.9 },
      { key: "other", pct: 2.9 }
    ],
    languagesOfficial: ["es"],
    englishProficiency: "high",
    industries: ["agriculture", "automotive", "food_processing", "mining"],
    medianAge: 33,
    timezone: ["America/Argentina/Buenos_Aires"],
    electricity: { voltage: 220, plugs: ["C", "I"] },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 1490
  },
  austria: {
    capitalNameKo: "빈",
    namesKoFallback: "오스트리아",
    religions: [
      { key: "christianity", pct: 64 },
      { key: "none", pct: 22 },
      { key: "islam", pct: 8 },
      { key: "other", pct: 6 }
    ],
    languagesOfficial: ["de"],
    englishProficiency: "very_high",
    industries: ["tourism", "manufacturing", "automotive", "finance"],
    medianAge: 44.7,
    timezone: ["Europe/Vienna"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.87
  },
  bahrain: {
    capitalNameKo: "마나마",
    namesKoFallback: "바레인",
    religions: [
      { key: "islam", pct: 73.7 },
      { key: "christianity", pct: 9.3 },
      { key: "hinduism", pct: 6 },
      { key: "judaism", pct: 0.1 },
      { key: "other", pct: 10.9 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "moderate",
    industries: ["oil_gas", "aluminum", "finance", "tourism"],
    medianAge: 33.3,
    timezone: ["Asia/Bahrain"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "right",
    emergency: "999",
    currencyUsdRateSnapshot: 0.376
  },
  cambodia: {
    capitalNameKo: "프놈펜",
    namesKoFallback: "캄보디아",
    religions: [
      { key: "buddhism", pct: 97 },
      { key: "islam", pct: 2 },
      { key: "christianity", pct: 0.2 },
      { key: "other", pct: 0.8 }
    ],
    languagesOfficial: ["km"],
    englishProficiency: "very_low",
    industries: ["tourism", "textiles", "agriculture", "fisheries"],
    medianAge: 27.4,
    timezone: ["Asia/Phnom_Penh"],
    electricity: { voltage: 230, plugs: ["A", "C", "G"] },
    drivingSide: "right",
    emergency: "117",
    currencyUsdRateSnapshot: 4000
  },
  chile: {
    capitalNameKo: "산티아고",
    namesKoFallback: "칠레",
    religions: [
      { key: "christianity", pct: 74.5 },
      { key: "none", pct: 24.7 },
      { key: "other", pct: 0.8 }
    ],
    languagesOfficial: ["es"],
    englishProficiency: "moderate",
    industries: ["mining", "agriculture", "fisheries", "wine", "forestry"],
    medianAge: 36.4,
    timezone: ["America/Santiago", "Pacific/Easter"],
    electricity: { voltage: 220, plugs: ["C", "L"] },
    drivingSide: "right",
    emergency: "133",
    currencyUsdRateSnapshot: 900
  },
  colombia: {
    capitalNameKo: "보고타",
    namesKoFallback: "콜롬비아",
    religions: [
      { key: "christianity", pct: 81.8 },
      { key: "none", pct: 16.2 },
      { key: "other", pct: 2 }
    ],
    languagesOfficial: ["es"],
    englishProficiency: "low",
    industries: ["oil_gas", "mining", "agriculture", "textiles"],
    medianAge: 31.6,
    timezone: ["America/Bogota"],
    electricity: { voltage: 110, plugs: ["A", "B"] },
    drivingSide: "right",
    emergency: "123",
    currencyUsdRateSnapshot: 3132
  },
  cyprus: {
    capitalNameKo: "니코시아",
    namesKoFallback: "키프로스",
    religions: [
      { key: "christianity", pct: 94 },
      { key: "islam", pct: 1.8 },
      { key: "buddhism", pct: 1 },
      { key: "other", pct: 2.5 },
      { key: "none", pct: 0.6 }
    ],
    languagesOfficial: ["el", "tr"],
    englishProficiency: "moderate",
    industries: ["tourism", "finance", "shipping", "food_processing"],
    medianAge: 38.4,
    timezone: ["Asia/Nicosia"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "left",
    emergency: "112",
    currencyUsdRateSnapshot: 0.92
  },
  "dominican-republic": {
    capitalNameKo: "산토도밍고",
    namesKoFallback: "도미니카 공화국",
    religions: [
      { key: "christianity", pct: 68.4 },
      { key: "none", pct: 29.6 },
      { key: "other", pct: 2 }
    ],
    languagesOfficial: ["es"],
    englishProficiency: "moderate",
    industries: ["tourism", "agriculture", "mining", "manufacturing"],
    medianAge: 28.8,
    timezone: ["America/Santo_Domingo"],
    electricity: { voltage: 120, plugs: ["A", "B"] },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 59
  },
  georgia: {
    capitalNameKo: "트빌리시",
    namesKoFallback: "조지아",
    religions: [
      { key: "christianity", pct: 86.3 },
      { key: "islam", pct: 10.7 },
      { key: "none", pct: 0.5 },
      { key: "other", pct: 2.5 }
    ],
    languagesOfficial: ["ka"],
    englishProficiency: "moderate",
    industries: ["agriculture", "mining", "tourism", "wine", "manufacturing"],
    medianAge: 38,
    timezone: ["Asia/Tbilisi"],
    electricity: { voltage: 220, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 2.65
  },
  greece: {
    capitalNameKo: "아테네",
    namesKoFallback: "그리스",
    religions: [
      { key: "christianity", pct: 90 },
      { key: "none", pct: 6 },
      { key: "islam", pct: 2 },
      { key: "other", pct: 2 }
    ],
    languagesOfficial: ["el"],
    englishProficiency: "very_high",
    industries: ["tourism", "shipping", "agriculture", "manufacturing"],
    medianAge: 46.3,
    timezone: ["Europe/Athens"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.87
  },
  hungary: {
    capitalNameKo: "부다페스트",
    namesKoFallback: "헝가리",
    religions: [
      { key: "christianity", pct: 43.3 },
      { key: "none", pct: 16.1 },
      { key: "other", pct: 40.6 }
    ],
    languagesOfficial: ["hu"],
    englishProficiency: "high",
    industries: ["automotive", "manufacturing", "electronics", "agriculture", "tourism"],
    medianAge: 44.2,
    timezone: ["Europe/Budapest"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 340
  },
  iran: {
    capitalNameKo: "테헤란",
    namesKoFallback: "이란",
    religions: [
      { key: "islam", pct: 99.4 },
      { key: "other", pct: 0.6 }
    ],
    languagesOfficial: ["fa"],
    englishProficiency: "low",
    industries: ["oil_gas", "petrochemicals", "automotive", "textiles"],
    medianAge: 32.5,
    timezone: ["Asia/Tehran"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "110",
    currencyUsdRateSnapshot: 1900000
  },
  ireland: {
    capitalNameKo: "더블린",
    namesKoFallback: "아일랜드",
    religions: [
      { key: "christianity", pct: 75 },
      { key: "islam", pct: 1.4 },
      { key: "none", pct: 15.4 },
      { key: "other", pct: 8.2 }
    ],
    languagesOfficial: ["ga", "en"],
    englishProficiency: "very_high",
    industries: ["pharmaceuticals", "technology", "finance", "food_processing"],
    medianAge: 38.8,
    timezone: ["Europe/Dublin"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "left",
    emergency: "112",
    currencyUsdRateSnapshot: 0.92
  },
  jordan: {
    capitalNameKo: "암만",
    namesKoFallback: "요르단",
    religions: [
      { key: "islam", pct: 97.1 },
      { key: "christianity", pct: 2.1 },
      { key: "other", pct: 0.8 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "very_low",
    industries: ["tourism", "mining", "textiles", "pharmaceuticals", "technology"],
    medianAge: 24.5,
    timezone: ["Asia/Amman"],
    electricity: { voltage: 230, plugs: ["B", "C", "D", "F", "G"] },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 0.71
  },
  malaysia: {
    capitalNameKo: "쿠알라룸푸르",
    namesKoFallback: "말레이시아",
    religions: [
      { key: "islam", pct: 63.5 },
      { key: "buddhism", pct: 18.7 },
      { key: "christianity", pct: 9.1 },
      { key: "hinduism", pct: 6.1 },
      { key: "other", pct: 2.6 }
    ],
    languagesOfficial: ["ms"],
    englishProficiency: "high",
    industries: ["manufacturing", "electronics", "palm_oil", "tourism"],
    medianAge: 31,
    timezone: ["Asia/Kuala_Lumpur"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "left",
    emergency: "999",
    currencyUsdRateSnapshot: 4.09
  },
  morocco: {
    capitalNameKo: "라바트",
    namesKoFallback: "모로코",
    religions: [
      { key: "islam", pct: 99 },
      { key: "other", pct: 1 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "low",
    industries: ["tourism", "agriculture", "textiles", "automotive", "mining"],
    medianAge: 29.7,
    timezone: ["Africa/Casablanca"],
    electricity: { voltage: 220, plugs: ["C", "E"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 9.4
  },
  "north-korea": {
    capitalNameKo: "평양",
    namesKoFallback: "북한",
    namesKoOverride: "북한",
    religions: [
      { key: "none", pct: 64.3 },
      { key: "folk", pct: 16 },
      { key: "chondoism", pct: 13.5 },
      { key: "buddhism", pct: 4.5 },
      { key: "christianity", pct: 2 }
    ],
    languagesOfficial: ["ko"],
    englishProficiency: "very_low",
    industries: ["mining", "textiles", "chemicals", "metallurgy"],
    medianAge: 36.2,
    timezone: ["Asia/Pyongyang"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "110",
    currencyUsdRateSnapshot: null,
    economicOverride: {
      population: { value: 26402841, year: 2025 },
      gdpNominalUsd: { value: 35925925926, year: 2025 },
      gdpPerCapitaUsd: { value: 1387.4, year: 2025 },
      source: {
        name: "Bank of Korea DPRK GDP/GNI estimate (2025년 북한 경제성장률 추정 결과), converted from KRW at ~1,350 KRW/USD; population from CIA World Factbook",
        url: "https://www.bok.or.kr",
        retrieved: "2026-07"
      }
    }
  },
  peru: {
    capitalNameKo: "리마",
    namesKoFallback: "페루",
    religions: [
      { key: "christianity", pct: 94.5 },
      { key: "none", pct: 5.1 },
      { key: "other", pct: 0.4 }
    ],
    languagesOfficial: ["es", "qu", "ay"],
    englishProficiency: "moderate",
    industries: ["mining", "agriculture", "fisheries", "tourism"],
    medianAge: 30.7,
    timezone: ["America/Lima"],
    electricity: { voltage: 220, plugs: ["A", "C"] },
    drivingSide: "right",
    emergency: "105",
    currencyUsdRateSnapshot: 3.4
  },
  poland: {
    capitalNameKo: "바르샤바",
    namesKoFallback: "폴란드",
    religions: [
      { key: "christianity", pct: 72 },
      { key: "other", pct: 21 },
      { key: "none", pct: 7 }
    ],
    languagesOfficial: ["pl"],
    englishProficiency: "high",
    industries: ["manufacturing", "agriculture", "mining", "automotive"],
    medianAge: 42.5,
    timezone: ["Europe/Warsaw"],
    electricity: { voltage: 230, plugs: ["C", "E"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 3.73
  },
  portugal: {
    capitalNameKo: "리스본",
    namesKoFallback: "포르투갈",
    religions: [
      { key: "christianity", pct: 85 },
      { key: "none", pct: 14 },
      { key: "other", pct: 1 }
    ],
    languagesOfficial: ["pt"],
    englishProficiency: "very_high",
    industries: ["tourism", "textiles", "agriculture", "manufacturing"],
    medianAge: 46.4,
    timezone: ["Europe/Lisbon"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 0.87
  },
  qatar: {
    capitalNameKo: "도하",
    namesKoFallback: "카타르",
    religions: [
      { key: "islam", pct: 65.2 },
      { key: "christianity", pct: 13.7 },
      { key: "hinduism", pct: 15.9 },
      { key: "buddhism", pct: 3.8 },
      { key: "other", pct: 1.4 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "low",
    industries: ["oil_gas", "petrochemicals", "construction", "finance", "steel"],
    medianAge: 34.2,
    timezone: ["Asia/Qatar"],
    electricity: { voltage: 240, plugs: ["D", "G"] },
    drivingSide: "right",
    emergency: "999",
    currencyUsdRateSnapshot: 3.64
  },
  "saudi-arabia": {
    capitalNameKo: "리야드",
    namesKoFallback: "사우디아라비아",
    religions: [
      { key: "islam", pct: 93 },
      { key: "christianity", pct: 5 },
      { key: "other", pct: 2 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "very_low",
    industries: ["oil_gas", "petrochemicals", "construction", "finance"],
    medianAge: 29.6,
    timezone: ["Asia/Riyadh"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "right",
    emergency: "999",
    currencyUsdRateSnapshot: 3.75
  },
  sweden: {
    capitalNameKo: "스톡홀름",
    namesKoFallback: "스웨덴",
    religions: [
      { key: "christianity", pct: 53.9 },
      { key: "none", pct: 37.2 },
      { key: "other", pct: 8.9 }
    ],
    languagesOfficial: ["sv"],
    englishProficiency: "very_high",
    industries: ["technology", "automotive", "manufacturing", "forestry", "finance"],
    medianAge: 41.2,
    timezone: ["Europe/Stockholm"],
    electricity: { voltage: 230, plugs: ["F"] },
    drivingSide: "right",
    emergency: "112",
    currencyUsdRateSnapshot: 9.5
  },
  tunisia: {
    capitalNameKo: "튀니스",
    namesKoFallback: "튀니지",
    religions: [
      { key: "islam", pct: 99 },
      { key: "other", pct: 1 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "low",
    industries: ["tourism", "textiles", "agriculture", "mining", "oil_gas"],
    medianAge: 33.4,
    timezone: ["Africa/Tunis"],
    electricity: { voltage: 230, plugs: ["C", "E"] },
    drivingSide: "right",
    emergency: "197",
    currencyUsdRateSnapshot: 2.95
  },
  "united-arab-emirates": {
    capitalNameKo: "아부다비",
    namesKoFallback: "아랍에미리트",
    religions: [
      { key: "islam", pct: 74 },
      { key: "christianity", pct: 13 },
      { key: "hinduism", pct: 7 },
      { key: "buddhism", pct: 3 },
      { key: "other", pct: 3 }
    ],
    languagesOfficial: ["ar"],
    englishProficiency: "low",
    industries: ["oil_gas", "tourism", "finance", "construction"],
    medianAge: 31.6,
    timezone: ["Asia/Dubai"],
    electricity: { voltage: 230, plugs: ["G"] },
    drivingSide: "right",
    emergency: "999",
    currencyUsdRateSnapshot: 3.6725
  },
  uruguay: {
    capitalNameKo: "몬테비데오",
    namesKoFallback: "우루과이",
    religions: [
      { key: "christianity", pct: 42.3 },
      { key: "folk", pct: 2.8 },
      { key: "none", pct: 48.9 },
      { key: "other", pct: 6 }
    ],
    languagesOfficial: ["es"],
    englishProficiency: "moderate",
    industries: ["agriculture", "meat_processing", "tourism", "textiles", "finance"],
    medianAge: 35.8,
    timezone: ["America/Montevideo"],
    electricity: { voltage: 230, plugs: ["C", "F", "I", "L"] },
    drivingSide: "right",
    emergency: "911",
    currencyUsdRateSnapshot: 40
  },
  uzbekistan: {
    capitalNameKo: "타슈켄트",
    namesKoFallback: "우즈베키스탄",
    religions: [
      { key: "islam", pct: 88 },
      { key: "christianity", pct: 9 },
      { key: "other", pct: 3 }
    ],
    languagesOfficial: ["uz"],
    englishProficiency: "very_low",
    industries: ["mining", "oil_gas", "textiles", "agriculture"],
    medianAge: 28.7,
    timezone: ["Asia/Tashkent"],
    electricity: { voltage: 230, plugs: ["C", "F"] },
    drivingSide: "right",
    emergency: "102",
    currencyUsdRateSnapshot: 12700
  }
};
