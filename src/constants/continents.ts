export type Continent = {
  id: string;
  nameKey: string;
  emoji: string;
  countryCodes: readonly string[];
};

export const CONTINENTS: readonly Continent[] = [
  {
    id: "africa",
    nameKey: "continents.africa",
    emoji: "\uD83C\uDF0D",
    countryCodes: [
      "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD",
      "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET",
      "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG",
      "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW",
      "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG",
      "TN", "UG", "ZM", "ZW",
    ],
  },
  {
    id: "asia",
    nameKey: "continents.asia",
    emoji: "\uD83C\uDF0F",
    countryCodes: [
      "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY",
      "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW",
      "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM",
      "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW",
      "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE",
    ],
  },
  {
    id: "europe",
    nameKey: "continents.europe",
    emoji: "\uD83C\uDF0D",
    countryCodes: [
      "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK",
      "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "XK",
      "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK",
      "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES",
      "SE", "CH", "UA", "GB", "VA",
    ],
  },
  {
    id: "north-america",
    nameKey: "continents.north-america",
    emoji: "\uD83C\uDF0E",
    countryCodes: [
      "AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV",
      "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC",
      "VC", "TT", "US",
    ],
  },
  {
    id: "south-america",
    nameKey: "continents.south-america",
    emoji: "\uD83C\uDF0E",
    countryCodes: [
      "AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR",
      "UY", "VE",
    ],
  },
  {
    id: "oceania",
    nameKey: "continents.oceania",
    emoji: "\uD83C\uDF0F",
    countryCodes: [
      "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS",
      "SB", "TO", "TV", "VU",
    ],
  },
] as const;

export function getContinentById(id: string): Continent | undefined {
  return CONTINENTS.find((continent) => continent.id === id);
}
