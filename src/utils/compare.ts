import { File } from "expo-file-system/next";
import * as DocumentPicker from "expo-document-picker";
import type { BanknoteRow } from "@/db/queries";
import { getCountry, type Country } from "@/constants/countries";
import { CONTINENTS } from "@/constants/continents";
import type { TFunction } from "i18next";

interface BackupBanknote {
  country_code: string;
  denomination: string;
  currency: string;
  year_start: number;
  year_end: number | null;
  is_current: number;
  notes: string | null;
}

interface BackupFile {
  version: 1;
  app: "collectify-banknotes";
  banknotes: BackupBanknote[];
  customCountries?: { code: string; name: string; flag: string; currency: string }[];
}

export interface CompareReport {
  myTotal: number;
  theirTotal: number;
  myCountries: number;
  theirCountries: number;
  commonCountries: string[];
  onlyMine: string[];
  onlyTheirs: string[];
  myUniqueNotes: { country: string; denomination: string; currency: string }[];
  theirUniqueNotes: { country: string; denomination: string; currency: string }[];
  continentComparison: {
    nameKey: string;
    emoji: string;
    myCount: number;
    theirCount: number;
  }[];
  myTopDenominations: { denomination: string; currency: string; count: number }[];
  theirTopDenominations: { denomination: string; currency: string; count: number }[];
}

function getCountriesSet(banknotes: { country_code: string }[]): Set<string> {
  return new Set(banknotes.map((b) => b.country_code));
}

function getDenomKey(b: { denomination: string; currency: string; country_code: string }): string {
  return `${b.country_code}:${b.denomination}:${b.currency}`;
}

function getTopDenoms(banknotes: { denomination: string; currency: string }[], limit = 5) {
  const map = new Map<string, { denomination: string; currency: string; count: number }>();
  for (const b of banknotes) {
    const key = `${b.denomination}-${b.currency}`;
    const entry = map.get(key);
    if (entry) entry.count++;
    else map.set(key, { denomination: b.denomination, currency: b.currency, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, limit);
}

function getCountryName(code: string, t: TFunction): string {
  const country = getCountry(code);
  return country ? t(country.nameKey, { defaultValue: country.nameKey }) : code;
}

export async function pickAndCompare(
  myBanknotes: BanknoteRow[],
  t: TFunction
): Promise<CompareReport | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const file = new File(result.assets[0].uri);
  const content = await file.text();
  const backup: BackupFile = JSON.parse(content);

  if (backup.app !== "collectify-banknotes" || !backup.banknotes) {
    throw new Error("invalid");
  }

  const theirBanknotes = backup.banknotes;

  const myCountriesSet = getCountriesSet(myBanknotes);
  const theirCountriesSet = getCountriesSet(theirBanknotes);

  const commonCountries = [...myCountriesSet].filter((c) => theirCountriesSet.has(c));
  const onlyMine = [...myCountriesSet].filter((c) => !theirCountriesSet.has(c));
  const onlyTheirs = [...theirCountriesSet].filter((c) => !myCountriesSet.has(c));

  // Find unique banknotes (by country+denomination+currency)
  const myDenomSet = new Set(myBanknotes.map(getDenomKey));
  const theirDenomSet = new Set(theirBanknotes.map(getDenomKey));

  const myUniqueNotes = myBanknotes
    .filter((b) => !theirDenomSet.has(getDenomKey(b)))
    .reduce((acc, b) => {
      const key = getDenomKey(b);
      if (!acc.seen.has(key)) {
        acc.seen.add(key);
        acc.items.push({
          country: getCountryName(b.country_code, t),
          denomination: b.denomination,
          currency: b.currency,
        });
      }
      return acc;
    }, { seen: new Set<string>(), items: [] as { country: string; denomination: string; currency: string }[] })
    .items.slice(0, 20);

  const theirUniqueNotes = theirBanknotes
    .filter((b) => !myDenomSet.has(getDenomKey(b)))
    .reduce((acc, b) => {
      const key = getDenomKey(b);
      if (!acc.seen.has(key)) {
        acc.seen.add(key);
        acc.items.push({
          country: getCountryName(b.country_code, t),
          denomination: b.denomination,
          currency: b.currency,
        });
      }
      return acc;
    }, { seen: new Set<string>(), items: [] as { country: string; denomination: string; currency: string }[] })
    .items.slice(0, 20);

  // Continent comparison
  const countryToContinent = new Map<string, string>();
  for (const c of CONTINENTS) {
    for (const code of c.countryCodes) {
      countryToContinent.set(code, c.id);
    }
  }

  const continentComparison = CONTINENTS.filter((c) => c.id !== "other").map((continent) => {
    const myCount = myBanknotes.filter(
      (b) => countryToContinent.get(b.country_code) === continent.id
    ).length;
    const theirCount = theirBanknotes.filter(
      (b) => countryToContinent.get(b.country_code) === continent.id
    ).length;
    return {
      nameKey: continent.nameKey,
      emoji: continent.emoji,
      myCount,
      theirCount,
    };
  });

  return {
    myTotal: myBanknotes.length,
    theirTotal: theirBanknotes.length,
    myCountries: myCountriesSet.size,
    theirCountries: theirCountriesSet.size,
    commonCountries: commonCountries.map((c) => getCountryName(c, t)),
    onlyMine: onlyMine.map((c) => getCountryName(c, t)),
    onlyTheirs: onlyTheirs.map((c) => getCountryName(c, t)),
    myUniqueNotes,
    theirUniqueNotes,
    continentComparison,
    myTopDenominations: getTopDenoms(myBanknotes),
    theirTopDenominations: getTopDenoms(theirBanknotes),
  };
}
