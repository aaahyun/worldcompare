export interface ManualOverride {
  capitalNameKo: string;
  namesKoFallback: string;
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
  }
};
