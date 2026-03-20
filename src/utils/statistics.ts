import type { BanknoteRow } from "@/db/queries";
import { CONTINENTS } from "@/constants/continents";
import { getCountry } from "@/constants/countries";
import type { TFunction } from "i18next";

export function getCollectionAge(banknotes: BanknoteRow[]): number {
  if (banknotes.length === 0) return 0;
  const oldest = banknotes.reduce((min, b) =>
    b.created_at < min.created_at ? b : min
  );
  const start = new Date(oldest.created_at).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
}

export function getContinentDistribution(
  banknotes: BanknoteRow[],
  countryStats?: Record<string, number>
): { continentId: string; nameKey: string; emoji: string; count: number; collected: number; total: number }[] {
  const countryToContinentMap = new Map<string, string>();
  for (const continent of CONTINENTS) {
    for (const code of continent.countryCodes) {
      countryToContinentMap.set(code, continent.id);
    }
  }

  const counts = new Map<string, number>();
  for (const b of banknotes) {
    const cid = countryToContinentMap.get(b.country_code) || "other";
    counts.set(cid, (counts.get(cid) || 0) + 1);
  }

  return CONTINENTS.map((c) => {
    let collected = 0;
    const total = c.id === "other" ? 0 : c.countryCodes.length;
    if (countryStats && c.id !== "other") {
      for (const code of c.countryCodes) {
        if (countryStats[code] && countryStats[code] > 0) collected++;
      }
    }
    return {
      continentId: c.id,
      nameKey: c.nameKey,
      emoji: c.emoji,
      count: counts.get(c.id) || 0,
      collected,
      total,
    };
  });
}

export function getTopDenominations(
  banknotes: BanknoteRow[],
  limit = 5
): { denomination: string; currency: string; count: number }[] {
  const map = new Map<string, { denomination: string; currency: string; count: number }>();
  for (const b of banknotes) {
    const key = `${b.denomination}-${b.currency}`;
    const entry = map.get(key);
    if (entry) {
      entry.count++;
    } else {
      map.set(key, { denomination: b.denomination, currency: b.currency, count: 1 });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getSerialPrefixStats(
  banknotes: BanknoteRow[],
  limit = 5
): { prefix: string; count: number }[] {
  const map = new Map<string, number>();
  for (const b of banknotes) {
    if (b.serial_number && b.serial_number.trim()) {
      // Extract all leading letters as the series prefix
      const match = b.serial_number.trim().match(/^([A-Za-z]+)/);
      if (match) {
        const prefix = match[1].toUpperCase();
        map.set(prefix, (map.get(prefix) || 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([prefix, count]) => ({ prefix, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getRecentActivity(
  banknotes: BanknoteRow[],
  limit = 10
): BanknoteRow[] {
  return [...banknotes]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit);
}

export function formatRelativeTime(dateString: string, t: TFunction): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t("statistics.justNow");
  if (diffMins < 60) return t("statistics.minutesAgo", { count: diffMins });
  if (diffHours < 24) return t("statistics.hoursAgo", { count: diffHours });
  if (diffDays < 30) return t("statistics.daysAgo", { count: diffDays });
  return t("statistics.daysAgo", { count: diffDays });
}

export function getCountryNameForBanknote(
  countryCode: string,
  t: TFunction
): { name: string; flag: string } {
  const country = getCountry(countryCode);
  if (!country) return { name: countryCode, flag: "" };
  return { name: t(country.nameKey), flag: country.flag };
}
