export type Country = {
  code: string;
  nameKey: string;
  flag: string;
  currency: string;
  continentId: string;
};

export const COUNTRIES: Record<string, Country> = {
  // ─── Africa (54) ───────────────────────────────────────────────────────────
  DZ: { code: "DZ", nameKey: "countries.DZ", flag: "🇩🇿", currency: "DZD", continentId: "africa" },
  AO: { code: "AO", nameKey: "countries.AO", flag: "🇦🇴", currency: "AOA", continentId: "africa" },
  BJ: { code: "BJ", nameKey: "countries.BJ", flag: "🇧🇯", currency: "XOF", continentId: "africa" },
  BW: { code: "BW", nameKey: "countries.BW", flag: "🇧🇼", currency: "BWP", continentId: "africa" },
  BF: { code: "BF", nameKey: "countries.BF", flag: "🇧🇫", currency: "XOF", continentId: "africa" },
  BI: { code: "BI", nameKey: "countries.BI", flag: "🇧🇮", currency: "BIF", continentId: "africa" },
  CV: { code: "CV", nameKey: "countries.CV", flag: "🇨🇻", currency: "CVE", continentId: "africa" },
  CM: { code: "CM", nameKey: "countries.CM", flag: "🇨🇲", currency: "XAF", continentId: "africa" },
  CF: { code: "CF", nameKey: "countries.CF", flag: "🇨🇫", currency: "XAF", continentId: "africa" },
  TD: { code: "TD", nameKey: "countries.TD", flag: "🇹🇩", currency: "XAF", continentId: "africa" },
  KM: { code: "KM", nameKey: "countries.KM", flag: "🇰🇲", currency: "KMF", continentId: "africa" },
  CG: { code: "CG", nameKey: "countries.CG", flag: "🇨🇬", currency: "XAF", continentId: "africa" },
  CD: { code: "CD", nameKey: "countries.CD", flag: "🇨🇩", currency: "CDF", continentId: "africa" },
  CI: { code: "CI", nameKey: "countries.CI", flag: "🇨🇮", currency: "XOF", continentId: "africa" },
  DJ: { code: "DJ", nameKey: "countries.DJ", flag: "🇩🇯", currency: "DJF", continentId: "africa" },
  EG: { code: "EG", nameKey: "countries.EG", flag: "🇪🇬", currency: "EGP", continentId: "africa" },
  GQ: { code: "GQ", nameKey: "countries.GQ", flag: "🇬🇶", currency: "XAF", continentId: "africa" },
  ER: { code: "ER", nameKey: "countries.ER", flag: "🇪🇷", currency: "ERN", continentId: "africa" },
  SZ: { code: "SZ", nameKey: "countries.SZ", flag: "🇸🇿", currency: "SZL", continentId: "africa" },
  ET: { code: "ET", nameKey: "countries.ET", flag: "🇪🇹", currency: "ETB", continentId: "africa" },
  GA: { code: "GA", nameKey: "countries.GA", flag: "🇬🇦", currency: "XAF", continentId: "africa" },
  GM: { code: "GM", nameKey: "countries.GM", flag: "🇬🇲", currency: "GMD", continentId: "africa" },
  GH: { code: "GH", nameKey: "countries.GH", flag: "🇬🇭", currency: "GHS", continentId: "africa" },
  GN: { code: "GN", nameKey: "countries.GN", flag: "🇬🇳", currency: "GNF", continentId: "africa" },
  GW: { code: "GW", nameKey: "countries.GW", flag: "🇬🇼", currency: "XOF", continentId: "africa" },
  KE: { code: "KE", nameKey: "countries.KE", flag: "🇰🇪", currency: "KES", continentId: "africa" },
  LS: { code: "LS", nameKey: "countries.LS", flag: "🇱🇸", currency: "LSL", continentId: "africa" },
  LR: { code: "LR", nameKey: "countries.LR", flag: "🇱🇷", currency: "LRD", continentId: "africa" },
  LY: { code: "LY", nameKey: "countries.LY", flag: "🇱🇾", currency: "LYD", continentId: "africa" },
  MG: { code: "MG", nameKey: "countries.MG", flag: "🇲🇬", currency: "MGA", continentId: "africa" },
  MW: { code: "MW", nameKey: "countries.MW", flag: "🇲🇼", currency: "MWK", continentId: "africa" },
  ML: { code: "ML", nameKey: "countries.ML", flag: "🇲🇱", currency: "XOF", continentId: "africa" },
  MR: { code: "MR", nameKey: "countries.MR", flag: "🇲🇷", currency: "MRU", continentId: "africa" },
  MU: { code: "MU", nameKey: "countries.MU", flag: "🇲🇺", currency: "MUR", continentId: "africa" },
  MA: { code: "MA", nameKey: "countries.MA", flag: "🇲🇦", currency: "MAD", continentId: "africa" },
  MZ: { code: "MZ", nameKey: "countries.MZ", flag: "🇲🇿", currency: "MZN", continentId: "africa" },
  NA: { code: "NA", nameKey: "countries.NA", flag: "🇳🇦", currency: "NAD", continentId: "africa" },
  NE: { code: "NE", nameKey: "countries.NE", flag: "🇳🇪", currency: "XOF", continentId: "africa" },
  NG: { code: "NG", nameKey: "countries.NG", flag: "🇳🇬", currency: "NGN", continentId: "africa" },
  RW: { code: "RW", nameKey: "countries.RW", flag: "🇷🇼", currency: "RWF", continentId: "africa" },
  ST: { code: "ST", nameKey: "countries.ST", flag: "🇸🇹", currency: "STN", continentId: "africa" },
  SN: { code: "SN", nameKey: "countries.SN", flag: "🇸🇳", currency: "XOF", continentId: "africa" },
  SC: { code: "SC", nameKey: "countries.SC", flag: "🇸🇨", currency: "SCR", continentId: "africa" },
  SL: { code: "SL", nameKey: "countries.SL", flag: "🇸🇱", currency: "SLE", continentId: "africa" },
  SO: { code: "SO", nameKey: "countries.SO", flag: "🇸🇴", currency: "SOS", continentId: "africa" },
  ZA: { code: "ZA", nameKey: "countries.ZA", flag: "🇿🇦", currency: "ZAR", continentId: "africa" },
  SS: { code: "SS", nameKey: "countries.SS", flag: "🇸🇸", currency: "SSP", continentId: "africa" },
  SD: { code: "SD", nameKey: "countries.SD", flag: "🇸🇩", currency: "SDG", continentId: "africa" },
  TZ: { code: "TZ", nameKey: "countries.TZ", flag: "🇹🇿", currency: "TZS", continentId: "africa" },
  TG: { code: "TG", nameKey: "countries.TG", flag: "🇹🇬", currency: "XOF", continentId: "africa" },
  TN: { code: "TN", nameKey: "countries.TN", flag: "🇹🇳", currency: "TND", continentId: "africa" },
  UG: { code: "UG", nameKey: "countries.UG", flag: "🇺🇬", currency: "UGX", continentId: "africa" },
  ZM: { code: "ZM", nameKey: "countries.ZM", flag: "🇿🇲", currency: "ZMW", continentId: "africa" },
  ZW: { code: "ZW", nameKey: "countries.ZW", flag: "🇿🇼", currency: "ZWL", continentId: "africa" },

  // ─── Asia (49) ─────────────────────────────────────────────────────────────
  AF: { code: "AF", nameKey: "countries.AF", flag: "🇦🇫", currency: "AFN", continentId: "asia" },
  AM: { code: "AM", nameKey: "countries.AM", flag: "🇦🇲", currency: "AMD", continentId: "asia" },
  AZ: { code: "AZ", nameKey: "countries.AZ", flag: "🇦🇿", currency: "AZN", continentId: "asia" },
  BH: { code: "BH", nameKey: "countries.BH", flag: "🇧🇭", currency: "BHD", continentId: "asia" },
  BD: { code: "BD", nameKey: "countries.BD", flag: "🇧🇩", currency: "BDT", continentId: "asia" },
  BT: { code: "BT", nameKey: "countries.BT", flag: "🇧🇹", currency: "BTN", continentId: "asia" },
  BN: { code: "BN", nameKey: "countries.BN", flag: "🇧🇳", currency: "BND", continentId: "asia" },
  KH: { code: "KH", nameKey: "countries.KH", flag: "🇰🇭", currency: "KHR", continentId: "asia" },
  CN: { code: "CN", nameKey: "countries.CN", flag: "🇨🇳", currency: "CNY", continentId: "asia" },
  CY: { code: "CY", nameKey: "countries.CY", flag: "🇨🇾", currency: "EUR", continentId: "asia" },
  GE: { code: "GE", nameKey: "countries.GE", flag: "🇬🇪", currency: "GEL", continentId: "asia" },
  IN: { code: "IN", nameKey: "countries.IN", flag: "🇮🇳", currency: "INR", continentId: "asia" },
  ID: { code: "ID", nameKey: "countries.ID", flag: "🇮🇩", currency: "IDR", continentId: "asia" },
  IR: { code: "IR", nameKey: "countries.IR", flag: "🇮🇷", currency: "IRR", continentId: "asia" },
  IQ: { code: "IQ", nameKey: "countries.IQ", flag: "🇮🇶", currency: "IQD", continentId: "asia" },
  IL: { code: "IL", nameKey: "countries.IL", flag: "🇮🇱", currency: "ILS", continentId: "asia" },
  JP: { code: "JP", nameKey: "countries.JP", flag: "🇯🇵", currency: "JPY", continentId: "asia" },
  JO: { code: "JO", nameKey: "countries.JO", flag: "🇯🇴", currency: "JOD", continentId: "asia" },
  KZ: { code: "KZ", nameKey: "countries.KZ", flag: "🇰🇿", currency: "KZT", continentId: "asia" },
  KW: { code: "KW", nameKey: "countries.KW", flag: "🇰🇼", currency: "KWD", continentId: "asia" },
  KG: { code: "KG", nameKey: "countries.KG", flag: "🇰🇬", currency: "KGS", continentId: "asia" },
  LA: { code: "LA", nameKey: "countries.LA", flag: "🇱🇦", currency: "LAK", continentId: "asia" },
  LB: { code: "LB", nameKey: "countries.LB", flag: "🇱🇧", currency: "LBP", continentId: "asia" },
  MY: { code: "MY", nameKey: "countries.MY", flag: "🇲🇾", currency: "MYR", continentId: "asia" },
  MV: { code: "MV", nameKey: "countries.MV", flag: "🇲🇻", currency: "MVR", continentId: "asia" },
  MN: { code: "MN", nameKey: "countries.MN", flag: "🇲🇳", currency: "MNT", continentId: "asia" },
  MM: { code: "MM", nameKey: "countries.MM", flag: "🇲🇲", currency: "MMK", continentId: "asia" },
  NP: { code: "NP", nameKey: "countries.NP", flag: "🇳🇵", currency: "NPR", continentId: "asia" },
  KP: { code: "KP", nameKey: "countries.KP", flag: "🇰🇵", currency: "KPW", continentId: "asia" },
  OM: { code: "OM", nameKey: "countries.OM", flag: "🇴🇲", currency: "OMR", continentId: "asia" },
  PK: { code: "PK", nameKey: "countries.PK", flag: "🇵🇰", currency: "PKR", continentId: "asia" },
  PS: { code: "PS", nameKey: "countries.PS", flag: "🇵🇸", currency: "ILS", continentId: "asia" },
  PH: { code: "PH", nameKey: "countries.PH", flag: "🇵🇭", currency: "PHP", continentId: "asia" },
  QA: { code: "QA", nameKey: "countries.QA", flag: "🇶🇦", currency: "QAR", continentId: "asia" },
  SA: { code: "SA", nameKey: "countries.SA", flag: "🇸🇦", currency: "SAR", continentId: "asia" },
  SG: { code: "SG", nameKey: "countries.SG", flag: "🇸🇬", currency: "SGD", continentId: "asia" },
  KR: { code: "KR", nameKey: "countries.KR", flag: "🇰🇷", currency: "KRW", continentId: "asia" },
  LK: { code: "LK", nameKey: "countries.LK", flag: "🇱🇰", currency: "LKR", continentId: "asia" },
  SY: { code: "SY", nameKey: "countries.SY", flag: "🇸🇾", currency: "SYP", continentId: "asia" },
  TW: { code: "TW", nameKey: "countries.TW", flag: "🇹🇼", currency: "TWD", continentId: "asia" },
  TJ: { code: "TJ", nameKey: "countries.TJ", flag: "🇹🇯", currency: "TJS", continentId: "asia" },
  TH: { code: "TH", nameKey: "countries.TH", flag: "🇹🇭", currency: "THB", continentId: "asia" },
  TL: { code: "TL", nameKey: "countries.TL", flag: "🇹🇱", currency: "USD", continentId: "asia" },
  TR: { code: "TR", nameKey: "countries.TR", flag: "🇹🇷", currency: "TRY", continentId: "asia" },
  TM: { code: "TM", nameKey: "countries.TM", flag: "🇹🇲", currency: "TMT", continentId: "asia" },
  AE: { code: "AE", nameKey: "countries.AE", flag: "🇦🇪", currency: "AED", continentId: "asia" },
  UZ: { code: "UZ", nameKey: "countries.UZ", flag: "🇺🇿", currency: "UZS", continentId: "asia" },
  VN: { code: "VN", nameKey: "countries.VN", flag: "🇻🇳", currency: "VND", continentId: "asia" },
  YE: { code: "YE", nameKey: "countries.YE", flag: "🇾🇪", currency: "YER", continentId: "asia" },

  // ─── Europe (45) ───────────────────────────────────────────────────────────
  AL: { code: "AL", nameKey: "countries.AL", flag: "🇦🇱", currency: "ALL", continentId: "europe" },
  AD: { code: "AD", nameKey: "countries.AD", flag: "🇦🇩", currency: "EUR", continentId: "europe" },
  AT: { code: "AT", nameKey: "countries.AT", flag: "🇦🇹", currency: "EUR", continentId: "europe" },
  BY: { code: "BY", nameKey: "countries.BY", flag: "🇧🇾", currency: "BYN", continentId: "europe" },
  BE: { code: "BE", nameKey: "countries.BE", flag: "🇧🇪", currency: "EUR", continentId: "europe" },
  BA: { code: "BA", nameKey: "countries.BA", flag: "🇧🇦", currency: "BAM", continentId: "europe" },
  BG: { code: "BG", nameKey: "countries.BG", flag: "🇧🇬", currency: "BGN", continentId: "europe" },
  HR: { code: "HR", nameKey: "countries.HR", flag: "🇭🇷", currency: "EUR", continentId: "europe" },
  CZ: { code: "CZ", nameKey: "countries.CZ", flag: "🇨🇿", currency: "CZK", continentId: "europe" },
  DK: { code: "DK", nameKey: "countries.DK", flag: "🇩🇰", currency: "DKK", continentId: "europe" },
  EE: { code: "EE", nameKey: "countries.EE", flag: "🇪🇪", currency: "EUR", continentId: "europe" },
  FI: { code: "FI", nameKey: "countries.FI", flag: "🇫🇮", currency: "EUR", continentId: "europe" },
  FR: { code: "FR", nameKey: "countries.FR", flag: "🇫🇷", currency: "EUR", continentId: "europe" },
  DE: { code: "DE", nameKey: "countries.DE", flag: "🇩🇪", currency: "EUR", continentId: "europe" },
  GR: { code: "GR", nameKey: "countries.GR", flag: "🇬🇷", currency: "EUR", continentId: "europe" },
  HU: { code: "HU", nameKey: "countries.HU", flag: "🇭🇺", currency: "HUF", continentId: "europe" },
  IS: { code: "IS", nameKey: "countries.IS", flag: "🇮🇸", currency: "ISK", continentId: "europe" },
  IE: { code: "IE", nameKey: "countries.IE", flag: "🇮🇪", currency: "EUR", continentId: "europe" },
  IT: { code: "IT", nameKey: "countries.IT", flag: "🇮🇹", currency: "EUR", continentId: "europe" },
  XK: { code: "XK", nameKey: "countries.XK", flag: "🇽🇰", currency: "EUR", continentId: "europe" },
  LV: { code: "LV", nameKey: "countries.LV", flag: "🇱🇻", currency: "EUR", continentId: "europe" },
  LI: { code: "LI", nameKey: "countries.LI", flag: "🇱🇮", currency: "CHF", continentId: "europe" },
  LT: { code: "LT", nameKey: "countries.LT", flag: "🇱🇹", currency: "EUR", continentId: "europe" },
  LU: { code: "LU", nameKey: "countries.LU", flag: "🇱🇺", currency: "EUR", continentId: "europe" },
  MT: { code: "MT", nameKey: "countries.MT", flag: "🇲🇹", currency: "EUR", continentId: "europe" },
  MD: { code: "MD", nameKey: "countries.MD", flag: "🇲🇩", currency: "MDL", continentId: "europe" },
  MC: { code: "MC", nameKey: "countries.MC", flag: "🇲🇨", currency: "EUR", continentId: "europe" },
  ME: { code: "ME", nameKey: "countries.ME", flag: "🇲🇪", currency: "EUR", continentId: "europe" },
  NL: { code: "NL", nameKey: "countries.NL", flag: "🇳🇱", currency: "EUR", continentId: "europe" },
  MK: { code: "MK", nameKey: "countries.MK", flag: "🇲🇰", currency: "MKD", continentId: "europe" },
  NO: { code: "NO", nameKey: "countries.NO", flag: "🇳🇴", currency: "NOK", continentId: "europe" },
  PL: { code: "PL", nameKey: "countries.PL", flag: "🇵🇱", currency: "PLN", continentId: "europe" },
  PT: { code: "PT", nameKey: "countries.PT", flag: "🇵🇹", currency: "EUR", continentId: "europe" },
  RO: { code: "RO", nameKey: "countries.RO", flag: "🇷🇴", currency: "RON", continentId: "europe" },
  RU: { code: "RU", nameKey: "countries.RU", flag: "🇷🇺", currency: "RUB", continentId: "europe" },
  SM: { code: "SM", nameKey: "countries.SM", flag: "🇸🇲", currency: "EUR", continentId: "europe" },
  RS: { code: "RS", nameKey: "countries.RS", flag: "🇷🇸", currency: "RSD", continentId: "europe" },
  SK: { code: "SK", nameKey: "countries.SK", flag: "🇸🇰", currency: "EUR", continentId: "europe" },
  SI: { code: "SI", nameKey: "countries.SI", flag: "🇸🇮", currency: "EUR", continentId: "europe" },
  ES: { code: "ES", nameKey: "countries.ES", flag: "🇪🇸", currency: "EUR", continentId: "europe" },
  SE: { code: "SE", nameKey: "countries.SE", flag: "🇸🇪", currency: "SEK", continentId: "europe" },
  CH: { code: "CH", nameKey: "countries.CH", flag: "🇨🇭", currency: "CHF", continentId: "europe" },
  UA: { code: "UA", nameKey: "countries.UA", flag: "🇺🇦", currency: "UAH", continentId: "europe" },
  GB: { code: "GB", nameKey: "countries.GB", flag: "🇬🇧", currency: "GBP", continentId: "europe" },
  VA: { code: "VA", nameKey: "countries.VA", flag: "🇻🇦", currency: "EUR", continentId: "europe" },

  // ─── North America (23) ────────────────────────────────────────────────────
  AG: { code: "AG", nameKey: "countries.AG", flag: "🇦🇬", currency: "XCD", continentId: "north-america" },
  BS: { code: "BS", nameKey: "countries.BS", flag: "🇧🇸", currency: "BSD", continentId: "north-america" },
  BB: { code: "BB", nameKey: "countries.BB", flag: "🇧🇧", currency: "BBD", continentId: "north-america" },
  BZ: { code: "BZ", nameKey: "countries.BZ", flag: "🇧🇿", currency: "BZD", continentId: "north-america" },
  CA: { code: "CA", nameKey: "countries.CA", flag: "🇨🇦", currency: "CAD", continentId: "north-america" },
  CR: { code: "CR", nameKey: "countries.CR", flag: "🇨🇷", currency: "CRC", continentId: "north-america" },
  CU: { code: "CU", nameKey: "countries.CU", flag: "🇨🇺", currency: "CUP", continentId: "north-america" },
  DM: { code: "DM", nameKey: "countries.DM", flag: "🇩🇲", currency: "XCD", continentId: "north-america" },
  DO: { code: "DO", nameKey: "countries.DO", flag: "🇩🇴", currency: "DOP", continentId: "north-america" },
  SV: { code: "SV", nameKey: "countries.SV", flag: "🇸🇻", currency: "USD", continentId: "north-america" },
  GD: { code: "GD", nameKey: "countries.GD", flag: "🇬🇩", currency: "XCD", continentId: "north-america" },
  GT: { code: "GT", nameKey: "countries.GT", flag: "🇬🇹", currency: "GTQ", continentId: "north-america" },
  HT: { code: "HT", nameKey: "countries.HT", flag: "🇭🇹", currency: "HTG", continentId: "north-america" },
  HN: { code: "HN", nameKey: "countries.HN", flag: "🇭🇳", currency: "HNL", continentId: "north-america" },
  JM: { code: "JM", nameKey: "countries.JM", flag: "🇯🇲", currency: "JMD", continentId: "north-america" },
  MX: { code: "MX", nameKey: "countries.MX", flag: "🇲🇽", currency: "MXN", continentId: "north-america" },
  NI: { code: "NI", nameKey: "countries.NI", flag: "🇳🇮", currency: "NIO", continentId: "north-america" },
  PA: { code: "PA", nameKey: "countries.PA", flag: "🇵🇦", currency: "PAB", continentId: "north-america" },
  KN: { code: "KN", nameKey: "countries.KN", flag: "🇰🇳", currency: "XCD", continentId: "north-america" },
  LC: { code: "LC", nameKey: "countries.LC", flag: "🇱🇨", currency: "XCD", continentId: "north-america" },
  VC: { code: "VC", nameKey: "countries.VC", flag: "🇻🇨", currency: "XCD", continentId: "north-america" },
  TT: { code: "TT", nameKey: "countries.TT", flag: "🇹🇹", currency: "TTD", continentId: "north-america" },
  US: { code: "US", nameKey: "countries.US", flag: "🇺🇸", currency: "USD", continentId: "north-america" },

  // ─── South America (12) ────────────────────────────────────────────────────
  AR: { code: "AR", nameKey: "countries.AR", flag: "🇦🇷", currency: "ARS", continentId: "south-america" },
  BO: { code: "BO", nameKey: "countries.BO", flag: "🇧🇴", currency: "BOB", continentId: "south-america" },
  BR: { code: "BR", nameKey: "countries.BR", flag: "🇧🇷", currency: "BRL", continentId: "south-america" },
  CL: { code: "CL", nameKey: "countries.CL", flag: "🇨🇱", currency: "CLP", continentId: "south-america" },
  CO: { code: "CO", nameKey: "countries.CO", flag: "🇨🇴", currency: "COP", continentId: "south-america" },
  EC: { code: "EC", nameKey: "countries.EC", flag: "🇪🇨", currency: "USD", continentId: "south-america" },
  GY: { code: "GY", nameKey: "countries.GY", flag: "🇬🇾", currency: "GYD", continentId: "south-america" },
  PY: { code: "PY", nameKey: "countries.PY", flag: "🇵🇾", currency: "PYG", continentId: "south-america" },
  PE: { code: "PE", nameKey: "countries.PE", flag: "🇵🇪", currency: "PEN", continentId: "south-america" },
  SR: { code: "SR", nameKey: "countries.SR", flag: "🇸🇷", currency: "SRD", continentId: "south-america" },
  UY: { code: "UY", nameKey: "countries.UY", flag: "🇺🇾", currency: "UYU", continentId: "south-america" },
  VE: { code: "VE", nameKey: "countries.VE", flag: "🇻🇪", currency: "VES", continentId: "south-america" },

  // ─── Oceania (14) ──────────────────────────────────────────────────────────
  AU: { code: "AU", nameKey: "countries.AU", flag: "🇦🇺", currency: "AUD", continentId: "oceania" },
  FJ: { code: "FJ", nameKey: "countries.FJ", flag: "🇫🇯", currency: "FJD", continentId: "oceania" },
  KI: { code: "KI", nameKey: "countries.KI", flag: "🇰🇮", currency: "AUD", continentId: "oceania" },
  MH: { code: "MH", nameKey: "countries.MH", flag: "🇲🇭", currency: "USD", continentId: "oceania" },
  FM: { code: "FM", nameKey: "countries.FM", flag: "🇫🇲", currency: "USD", continentId: "oceania" },
  NR: { code: "NR", nameKey: "countries.NR", flag: "🇳🇷", currency: "AUD", continentId: "oceania" },
  NZ: { code: "NZ", nameKey: "countries.NZ", flag: "🇳🇿", currency: "NZD", continentId: "oceania" },
  PW: { code: "PW", nameKey: "countries.PW", flag: "🇵🇼", currency: "USD", continentId: "oceania" },
  PG: { code: "PG", nameKey: "countries.PG", flag: "🇵🇬", currency: "PGK", continentId: "oceania" },
  WS: { code: "WS", nameKey: "countries.WS", flag: "🇼🇸", currency: "WST", continentId: "oceania" },
  SB: { code: "SB", nameKey: "countries.SB", flag: "🇸🇧", currency: "SBD", continentId: "oceania" },
  TO: { code: "TO", nameKey: "countries.TO", flag: "🇹🇴", currency: "TOP", continentId: "oceania" },
  TV: { code: "TV", nameKey: "countries.TV", flag: "🇹🇻", currency: "AUD", continentId: "oceania" },
  VU: { code: "VU", nameKey: "countries.VU", flag: "🇻🇺", currency: "VUV", continentId: "oceania" },
};

// Runtime store for custom countries (loaded from DB)
const customCountries: Record<string, Country> = {};

export function registerCustomCountry(
  code: string,
  name: string,
  flag: string,
  currency: string
): void {
  customCountries[code] = {
    code,
    nameKey: name, // Direct name, not i18n key
    flag,
    currency,
    continentId: "other",
  };
}

export function removeCustomCountry(code: string): void {
  delete customCountries[code];
}

export function getCountry(code: string): Country | undefined {
  return COUNTRIES[code] || customCountries[code];
}

export function getCustomCountries(): Country[] {
  return Object.values(customCountries);
}

export function getCountriesByContinent(continentId: string): Country[] {
  const standard = Object.values(COUNTRIES).filter(
    (country) => country.continentId === continentId
  );
  if (continentId === "other") {
    return [...standard, ...Object.values(customCountries)];
  }
  return standard;
}

export function getAllCountriesList(): Country[] {
  return [...Object.values(COUNTRIES), ...Object.values(customCountries)];
}
