import { File } from "expo-file-system/next";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

export interface BanknoteIdentification {
  countryCode: string;
  countryName: string;
  denomination: string;
  currency: string;
  yearStart?: number;
  yearEnd?: number;
  isCurrent?: boolean;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

// ─── Local identification database ───────────────────────────────────────────
interface LocalPattern {
  keywords: string[];
  countryCode: string;
  countryName: string;
  currency: string;
}

const KNOWN_CURRENCIES: LocalPattern[] = [
  // ─── Latin Alphabet ─────────────────────────────────────────────────────
  { keywords: ["türkiye", "cumhuriyet", "merkez bankası", "türk lirası", "t.c."], countryCode: "TR", countryName: "Turkey", currency: "TRY" },
  { keywords: ["united states", "federal reserve", "in god we trust", "america"], countryCode: "US", countryName: "United States", currency: "USD" },
  { keywords: ["european central bank", "euro", "€", "bce", "ezb", "ekp", "ecb"], countryCode: "DE", countryName: "Germany", currency: "EUR" },
  { keywords: ["bank of england", "pound", "£", "sterling"], countryCode: "GB", countryName: "United Kingdom", currency: "GBP" },
  { keywords: ["bank of canada", "banque du canada", "canada"], countryCode: "CA", countryName: "Canada", currency: "CAD" },
  { keywords: ["reserve bank of australia", "australia", "commonwealth"], countryCode: "AU", countryName: "Australia", currency: "AUD" },
  { keywords: ["reserve bank of new zealand", "new zealand"], countryCode: "NZ", countryName: "New Zealand", currency: "NZD" },
  { keywords: ["swiss national bank", "schweizerische nationalbank", "franken", "banque nationale suisse"], countryCode: "CH", countryName: "Switzerland", currency: "CHF" },
  { keywords: ["banco de méxico", "mexico", "banco de mexico"], countryCode: "MX", countryName: "Mexico", currency: "MXN" },
  { keywords: ["banco central do brasil", "real", "reais", "brasil"], countryCode: "BR", countryName: "Brazil", currency: "BRL" },
  { keywords: ["banco central de la república argentina", "peso", "argentina", "banco central"], countryCode: "AR", countryName: "Argentina", currency: "ARS" },
  { keywords: ["banco central de chile", "chile"], countryCode: "CL", countryName: "Chile", currency: "CLP" },
  { keywords: ["banco central de colombia", "colombia"], countryCode: "CO", countryName: "Colombia", currency: "COP" },
  { keywords: ["banco central del peru", "peru", "perú"], countryCode: "PE", countryName: "Peru", currency: "PEN" },
  { keywords: ["banco central de venezuela", "venezuela", "bolívar"], countryCode: "VE", countryName: "Venezuela", currency: "VES" },
  { keywords: ["banco central del uruguay", "uruguay"], countryCode: "UY", countryName: "Uruguay", currency: "UYU" },
  { keywords: ["banco central del ecuador", "ecuador", "sucre"], countryCode: "EC", countryName: "Ecuador", currency: "USD" },
  { keywords: ["banco central de bolivia", "bolivia", "boliviano"], countryCode: "BO", countryName: "Bolivia", currency: "BOB" },
  { keywords: ["banco central del paraguay", "paraguay", "guaraní"], countryCode: "PY", countryName: "Paraguay", currency: "PYG" },
  { keywords: ["banco central de cuba", "cuba"], countryCode: "CU", countryName: "Cuba", currency: "CUP" },
  { keywords: ["banco central de costa rica", "costa rica", "colón"], countryCode: "CR", countryName: "Costa Rica", currency: "CRC" },
  { keywords: ["banco de guatemala", "guatemala", "quetzal"], countryCode: "GT", countryName: "Guatemala", currency: "GTQ" },
  { keywords: ["bank indonesia", "rupiah", "indonesia"], countryCode: "ID", countryName: "Indonesia", currency: "IDR" },
  { keywords: ["bangko sentral ng pilipinas", "piso", "philippines", "pilipinas"], countryCode: "PH", countryName: "Philippines", currency: "PHP" },
  { keywords: ["bank negara malaysia", "ringgit", "malaysia"], countryCode: "MY", countryName: "Malaysia", currency: "MYR" },
  { keywords: ["monetary authority of singapore", "singapore"], countryCode: "SG", countryName: "Singapore", currency: "SGD" },
  { keywords: ["central bank of nigeria", "naira", "₦", "nigeria"], countryCode: "NG", countryName: "Nigeria", currency: "NGN" },
  { keywords: ["south african reserve bank", "rand", "south africa"], countryCode: "ZA", countryName: "South Africa", currency: "ZAR" },
  { keywords: ["central bank of kenya", "shilling", "kenya"], countryCode: "KE", countryName: "Kenya", currency: "KES" },
  { keywords: ["bank of tanzania", "tanzania", "shilingi"], countryCode: "TZ", countryName: "Tanzania", currency: "TZS" },
  { keywords: ["bank of uganda", "uganda", "shilling"], countryCode: "UG", countryName: "Uganda", currency: "UGX" },
  { keywords: ["bank of ghana", "ghana", "cedi", "₵"], countryCode: "GH", countryName: "Ghana", currency: "GHS" },
  { keywords: ["banque centrale des états", "cfa", "bceao"], countryCode: "SN", countryName: "Senegal", currency: "XOF" },
  { keywords: ["banque des états de l'afrique centrale", "beac"], countryCode: "CM", countryName: "Cameroon", currency: "XAF" },
  { keywords: ["bank of zambia", "zambia", "kwacha"], countryCode: "ZM", countryName: "Zambia", currency: "ZMW" },
  { keywords: ["reserve bank of zimbabwe", "zimbabwe"], countryCode: "ZW", countryName: "Zimbabwe", currency: "ZWL" },
  { keywords: ["reserve bank of malawi", "malawi", "kwacha"], countryCode: "MW", countryName: "Malawi", currency: "MWK" },
  { keywords: ["bank of mozambique", "moçambique", "metical"], countryCode: "MZ", countryName: "Mozambique", currency: "MZN" },
  { keywords: ["banco nacional de angola", "angola", "kwanza"], countryCode: "AO", countryName: "Angola", currency: "AOA" },
  { keywords: ["banque centrale du congo", "congo", "franc"], countryCode: "CD", countryName: "DR Congo", currency: "CDF" },
  { keywords: ["national bank of rwanda", "rwanda", "franc"], countryCode: "RW", countryName: "Rwanda", currency: "RWF" },
  { keywords: ["norges bank", "norway", "krone", "norge"], countryCode: "NO", countryName: "Norway", currency: "NOK" },
  { keywords: ["sveriges riksbank", "sweden", "krona", "sverige"], countryCode: "SE", countryName: "Sweden", currency: "SEK" },
  { keywords: ["danmarks nationalbank", "denmark", "krone", "danmark"], countryCode: "DK", countryName: "Denmark", currency: "DKK" },
  { keywords: ["seðlabanki íslands", "iceland", "króna", "ísland"], countryCode: "IS", countryName: "Iceland", currency: "ISK" },
  { keywords: ["česká národní banka", "koruna", "kč", "česká"], countryCode: "CZ", countryName: "Czechia", currency: "CZK" },
  { keywords: ["magyar nemzeti bank", "forint", "magyar"], countryCode: "HU", countryName: "Hungary", currency: "HUF" },
  { keywords: ["narodowy bank polski", "złoty", "zł", "polska"], countryCode: "PL", countryName: "Poland", currency: "PLN" },
  { keywords: ["banca naţională a româniei", "lei", "romania", "românia"], countryCode: "RO", countryName: "Romania", currency: "RON" },
  { keywords: ["hrvatska narodna banka", "kuna", "hrvatska", "croatia"], countryCode: "HR", countryName: "Croatia", currency: "EUR" },
  { keywords: ["banka e shqipërisë", "albania", "lekë", "shqipëri"], countryCode: "AL", countryName: "Albania", currency: "ALL" },
  { keywords: ["fiji", "reserve bank of fiji", "dollar"], countryCode: "FJ", countryName: "Fiji", currency: "FJD" },
  { keywords: ["bank of papua new guinea", "kina", "papua"], countryCode: "PG", countryName: "Papua New Guinea", currency: "PGK" },
  { keywords: ["tonga", "pa'anga"], countryCode: "TO", countryName: "Tonga", currency: "TOP" },
  { keywords: ["samoa", "tala", "tālā"], countryCode: "WS", countryName: "Samoa", currency: "WST" },

  // ─── Arabic Script (عربي) ────────────────────────────────────────────────
  { keywords: ["المملكة العربية السعودية", "مؤسسة النقد", "ريال", "saudi", "riyal"], countryCode: "SA", countryName: "Saudi Arabia", currency: "SAR" },
  { keywords: ["البنك المركزي المصري", "مصر", "جنيه", "egypt"], countryCode: "EG", countryName: "Egypt", currency: "EGP" },
  { keywords: ["البنك المركزي العراقي", "العراق", "دينار", "iraq"], countryCode: "IQ", countryName: "Iraq", currency: "IQD" },
  { keywords: ["بانک مرکزی", "ایران", "ریال", "iran", "rial"], countryCode: "IR", countryName: "Iran", currency: "IRR" },
  { keywords: ["دولة الإمارات", "الإمارات", "درهم", "emirates", "dirham"], countryCode: "AE", countryName: "United Arab Emirates", currency: "AED" },
  { keywords: ["البنك المركزي الأردني", "الأردن", "دينار", "jordan"], countryCode: "JO", countryName: "Jordan", currency: "JOD" },
  { keywords: ["بنك الكويت المركزي", "الكويت", "دينار", "kuwait"], countryCode: "KW", countryName: "Kuwait", currency: "KWD" },
  { keywords: ["مصرف قطر المركزي", "قطر", "ريال", "qatar"], countryCode: "QA", countryName: "Qatar", currency: "QAR" },
  { keywords: ["البنك المركزي العماني", "عمان", "ريال", "oman"], countryCode: "OM", countryName: "Oman", currency: "OMR" },
  { keywords: ["مصرف البحرين المركزي", "البحرين", "دينار", "bahrain"], countryCode: "BH", countryName: "Bahrain", currency: "BHD" },
  { keywords: ["مصرف ليبيا المركزي", "ليبيا", "دينار", "libya"], countryCode: "LY", countryName: "Libya", currency: "LYD" },
  { keywords: ["البنك المركزي التونسي", "تونس", "دينار", "tunisie"], countryCode: "TN", countryName: "Tunisia", currency: "TND" },
  { keywords: ["بنك الجزائر", "الجزائر", "دينار", "algérie"], countryCode: "DZ", countryName: "Algeria", currency: "DZD" },
  { keywords: ["بنك المغرب", "المغرب", "درهم", "maroc"], countryCode: "MA", countryName: "Morocco", currency: "MAD" },
  { keywords: ["البنك المركزي اليمني", "اليمن", "ريال", "yemen"], countryCode: "YE", countryName: "Yemen", currency: "YER" },
  { keywords: ["مصرف سوريا المركزي", "سوريا", "ليرة", "syria"], countryCode: "SY", countryName: "Syria", currency: "SYP" },
  { keywords: ["مصرف لبنان", "لبنان", "ليرة", "liban"], countryCode: "LB", countryName: "Lebanon", currency: "LBP" },
  { keywords: ["سلطة النقد الفلسطينية", "فلسطين", "palestine"], countryCode: "PS", countryName: "Palestine", currency: "ILS" },
  { keywords: ["البنك المركزي السوداني", "السودان", "جنيه", "sudan"], countryCode: "SD", countryName: "Sudan", currency: "SDG" },
  { keywords: ["بنك الصومال المركزي", "الصومال", "شلن", "somalia"], countryCode: "SO", countryName: "Somalia", currency: "SOS" },
  { keywords: ["البنك المركزي الموريتاني", "موريتانيا", "أوقية", "mauritanie"], countryCode: "MR", countryName: "Mauritania", currency: "MRU" },
  { keywords: ["پاکستان", "اسٹیٹ بینک", "روپیہ", "pakistan", "state bank"], countryCode: "PK", countryName: "Pakistan", currency: "PKR" },
  { keywords: ["د افغانستان بانک", "افغانی", "afghanistan", "afghani"], countryCode: "AF", countryName: "Afghanistan", currency: "AFN" },

  // ─── Cyrillic Script (Кириллица) ─────────────────────────────────────────
  { keywords: ["банк россии", "центральный банк", "рубль", "россия", "russia", "ruble"], countryCode: "RU", countryName: "Russia", currency: "RUB" },
  { keywords: ["національний банк україни", "гривня", "україна", "ukraine", "hryvnia"], countryCode: "UA", countryName: "Ukraine", currency: "UAH" },
  { keywords: ["национальный банк", "беларусь", "рубль", "belarus"], countryCode: "BY", countryName: "Belarus", currency: "BYN" },
  { keywords: ["народна банка србије", "динар", "србија", "serbia", "dinar"], countryCode: "RS", countryName: "Serbia", currency: "RSD" },
  { keywords: ["българска народна банка", "лев", "българия", "bulgaria", "lev"], countryCode: "BG", countryName: "Bulgaria", currency: "BGN" },
  { keywords: ["народна банка", "македонија", "денар", "macedonia"], countryCode: "MK", countryName: "North Macedonia", currency: "MKD" },
  { keywords: ["централна банка на босна", "марка", "bosnia"], countryCode: "BA", countryName: "Bosnia and Herzegovina", currency: "BAM" },
  { keywords: ["централна банка црне горе", "црна гора", "montenegro"], countryCode: "ME", countryName: "Montenegro", currency: "EUR" },
  { keywords: ["национальный банк", "сўм", "сум", "o'zbekiston", "uzbekistan"], countryCode: "UZ", countryName: "Uzbekistan", currency: "UZS" },
  { keywords: ["қазақстан ұлттық банкі", "тенге", "казахстан", "kazakhstan"], countryCode: "KZ", countryName: "Kazakhstan", currency: "KZT" },
  { keywords: ["кыргыз банкы", "сом", "кыргызстан", "kyrgyzstan"], countryCode: "KG", countryName: "Kyrgyzstan", currency: "KGS" },
  { keywords: ["бонки миллии тоҷикистон", "сомонӣ", "tajikistan", "тоҷикистон"], countryCode: "TJ", countryName: "Tajikistan", currency: "TJS" },
  { keywords: ["түркменистан", "манат", "turkmenistan"], countryCode: "TM", countryName: "Turkmenistan", currency: "TMT" },
  { keywords: ["монголбанк", "төгрөг", "монгол", "mongolia", "tugrik"], countryCode: "MN", countryName: "Mongolia", currency: "MNT" },
  { keywords: ["национальный банк грузии", "ლარი", "საქართველო", "georgia", "lari"], countryCode: "GE", countryName: "Georgia", currency: "GEL" },
  { keywords: ["armenia", "dram", "armenian"], countryCode: "AM", countryName: "Armenia", currency: "AMD" },
  { keywords: ["azərbaycan mərkəzi bankı", "manat", "azerbaycan", "azerbaijan"], countryCode: "AZ", countryName: "Azerbaijan", currency: "AZN" },
  { keywords: ["советский", "ссср", "рубль", "soviet", "cccp"], countryCode: "SU", countryName: "Soviet Union", currency: "SUR" },
  { keywords: ["югославија", "jugoslavija", "динар", "yugoslavia"], countryCode: "YU", countryName: "Yugoslavia", currency: "YUD" },

  // ─── CJK (中日韓) ────────────────────────────────────────────────────────
  { keywords: ["日本銀行", "日本銀行券", "円", "nippon", "japan", "yen", "¥"], countryCode: "JP", countryName: "Japan", currency: "JPY" },
  { keywords: ["中国人民银行", "人民币", "元", "yuan", "renminbi", "china"], countryCode: "CN", countryName: "China", currency: "CNY" },
  { keywords: ["中華民國", "台灣銀行", "圓", "taiwan"], countryCode: "TW", countryName: "Taiwan", currency: "TWD" },
  { keywords: ["한국은행", "원", "대한민국", "korea", "won"], countryCode: "KR", countryName: "South Korea", currency: "KRW" },
  { keywords: ["조선민주주의인민공화국", "조선중앙은행", "원", "north korea"], countryCode: "KP", countryName: "North Korea", currency: "KPW" },

  // ─── South Asian Scripts (दक्षिण एशिया) ──────────────────────────────────
  { keywords: ["भारतीय रिज़र्व बैंक", "रिज़र्व बैंक", "रुपया", "₹", "india", "rupee"], countryCode: "IN", countryName: "India", currency: "INR" },
  { keywords: ["বাংলাদেশ ব্যাংক", "টাকা", "বাংলাদেশ", "bangladesh", "taka"], countryCode: "BD", countryName: "Bangladesh", currency: "BDT" },
  { keywords: ["නේපාල राष्ट्र बैंक", "नेपाल", "रुपैयाँ", "nepal", "rupee"], countryCode: "NP", countryName: "Nepal", currency: "NPR" },
  { keywords: ["ශ්‍රී ලංකා මහ බැංකුව", "ශ්‍රී ලංකා", "රුපියල්", "sri lanka", "rupee"], countryCode: "LK", countryName: "Sri Lanka", currency: "LKR" },
  { keywords: ["རྒྱལ་ཡོངས་དངུལ་ལྷན", "འབྲུག", "ngultrum", "bhutan"], countryCode: "BT", countryName: "Bhutan", currency: "BTN" },
  { keywords: ["ދިވެހިރާއްޖޭގެ", "ރުފިޔާ", "maldives", "rufiyaa"], countryCode: "MV", countryName: "Maldives", currency: "MVR" },
  { keywords: ["မြန်မာနိုင်ငံတော်ဗဟိုဘဏ်", "ကျပ်", "myanmar", "kyat"], countryCode: "MM", countryName: "Myanmar", currency: "MMK" },

  // ─── Southeast Asian Scripts ──────────────────────────────────────────────
  { keywords: ["ธนาคารแห่งประเทศไทย", "บาท", "ประเทศไทย", "baht", "thailand"], countryCode: "TH", countryName: "Thailand", currency: "THB" },
  { keywords: ["ngân hàng nhà nước", "việt nam", "đồng", "vietnam"], countryCode: "VN", countryName: "Vietnam", currency: "VND" },
  { keywords: ["ធនាគារជាតិនៃកម្ពុជា", "រៀល", "cambodia", "riel"], countryCode: "KH", countryName: "Cambodia", currency: "KHR" },
  { keywords: ["ທະນາຄານແຫ່ງ", "ກີບ", "laos", "kip"], countryCode: "LA", countryName: "Laos", currency: "LAK" },

  // ─── Ethiopian Script (ግዕዝ) ──────────────────────────────────────────────
  { keywords: ["ብሔራዊ ባንክ", "ኢትዮጵያ", "ብር", "ethiopia", "birr"], countryCode: "ET", countryName: "Ethiopia", currency: "ETB" },
  { keywords: ["ናቕፋ", "ኤርትራ", "eritrea", "nakfa"], countryCode: "ER", countryName: "Eritrea", currency: "ERN" },

  // ─── Hebrew Script (עברית) ────────────────────────────────────────────────
  { keywords: ["בנק ישראל", "שקל", "ישראל", "israel", "shekel", "₪"], countryCode: "IL", countryName: "Israel", currency: "ILS" },

  // ─── Historical / Defunct ─────────────────────────────────────────────────
  { keywords: ["deutsche mark", "bundesbank", "dm", "deutsche bundesbank"], countryCode: "DE", countryName: "Germany", currency: "DEM" },
  { keywords: ["banque de france", "franc", "france", "république française"], countryCode: "FR", countryName: "France", currency: "FRF" },
  { keywords: ["banca d'italia", "lire", "lira", "italia", "mille"], countryCode: "IT", countryName: "Italy", currency: "ITL" },
  { keywords: ["banco de españa", "peseta", "españa"], countryCode: "ES", countryName: "Spain", currency: "ESP" },
  { keywords: ["de nederlandsche bank", "gulden", "nederland"], countryCode: "NL", countryName: "Netherlands", currency: "NLG" },
  { keywords: ["banco de portugal", "escudo", "portugal"], countryCode: "PT", countryName: "Portugal", currency: "PTE" },
  { keywords: ["oesterreichische nationalbank", "schilling", "österreich"], countryCode: "AT", countryName: "Austria", currency: "ATS" },
  { keywords: ["nationale bank van belgië", "franc", "belgique", "belgië"], countryCode: "BE", countryName: "Belgium", currency: "BEF" },
  { keywords: ["τράπεζα της ελλάδος", "δραχμή", "ελλάς", "greece", "drachma"], countryCode: "GR", countryName: "Greece", currency: "GRD" },
  { keywords: ["suomen pankki", "markka", "finland", "finlands bank"], countryCode: "FI", countryName: "Finland", currency: "FIM" },
  { keywords: ["central bank of ireland", "punt", "éire", "ireland"], countryCode: "IE", countryName: "Ireland", currency: "IEP" },
  { keywords: ["ottoman", "osmanlı", "عثمانية", "kuruş"], countryCode: "TR", countryName: "Ottoman Empire", currency: "OTT" },
  { keywords: ["československo", "koruna", "czechoslovakia"], countryCode: "CZ", countryName: "Czechoslovakia", currency: "CSK" },
  { keywords: ["deutsche demokratische", "ddr", "mark", "east germany"], countryCode: "DE", countryName: "East Germany", currency: "DDM" },
];

// ─── Image compression ──────────────────────────────────────────────────────

async function imageToBase64(uri: string): Promise<string> {
  const file = new File(uri);
  return await file.base64();
}

// ─── Gemini identification ──────────────────────────────────────────────────

async function identifyWithGemini(
  base64: string
): Promise<BanknoteIdentification | null> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64,
            },
          },
          {
            text: `You are a banknote identification expert. Analyze this banknote image and identify:
1. The country of origin (ISO 3166-1 alpha-2 code AND country name in English)
2. The denomination (numeric value only)
3. The currency code (e.g., USD, EUR, TRY)
4. The approximate year or year range
5. Whether it's still in circulation

Respond ONLY with valid JSON in this exact format, no markdown, no code blocks:
{"countryCode":"XX","countryName":"Country Name","denomination":"100","currency":"XXX","yearStart":2000,"yearEnd":null,"isCurrent":true,"confidence":"high","notes":"Brief description"}

confidence should be "high", "medium", or "low".
If you cannot identify the banknote, respond with: {"error":"Cannot identify this banknote"}`,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 256,
    },
  };

  let response: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
    if (response.status === 429) {
      await new Promise((r) => setTimeout(r, (attempt + 1) * 5000));
      continue;
    }
    break;
  }

  if (!response || !response.ok) {
    throw new Error(`Gemini API error: ${response?.status || "unknown"}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

  let jsonStr = text;
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  }

  const result = JSON.parse(jsonStr);

  if (result.error) {
    return null;
  }

  return result as BanknoteIdentification;
}

// ─── Main identify function ─────────────────────────────────────────────────

export async function identifyBanknote(
  photoUri: string
): Promise<BanknoteIdentification | null> {
  // Step 1: Read image
  const base64 = await imageToBase64(photoUri);

  // Step 2: Try Gemini AI
  try {
    const geminiResult = await identifyWithGemini(base64);
    if (geminiResult) return geminiResult;
  } catch (e) {
    console.warn("Gemini failed, continuing without AI:", e);
  }

  // Step 3: If Gemini fails, return null (user can manually enter)
  return null;
}
