import { CONTINENTS } from "./continents";

export interface CollectionStats {
  totalBanknotes: number;
  uniqueCountries: number;
  continentsTouched: number;
  continentsCompleted: number;
  banknotesWithBackPhoto: number;
}

export interface AchievementDef {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  icon: string;
  check: (stats: CollectionStats) => boolean;
}

export function computeCollectionStats(
  countryStats: Record<string, number>,
  banknotes: { back_photo: string | null }[]
): CollectionStats {
  const uniqueCountries = Object.keys(countryStats).length;
  const totalBanknotes = banknotes.length;
  let continentsTouched = 0;
  let continentsCompleted = 0;

  for (const continent of CONTINENTS) {
    if (continent.id === "other") continue;
    let hasAny = false;
    let hasAll = true;
    for (const code of continent.countryCodes) {
      if (countryStats[code] && countryStats[code] > 0) {
        hasAny = true;
      } else {
        hasAll = false;
      }
    }
    if (hasAny) continentsTouched++;
    if (hasAll && continent.countryCodes.length > 0) continentsCompleted++;
  }

  const banknotesWithBackPhoto = banknotes.filter(
    (b) => b.back_photo !== null
  ).length;

  return {
    totalBanknotes,
    uniqueCountries,
    continentsTouched,
    continentsCompleted,
    banknotesWithBackPhoto,
  };
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: "first_banknote",
    titleKey: "achievements.first_banknote.title",
    descriptionKey: "achievements.first_banknote.description",
    emoji: "\uD83C\uDF1F",
    icon: "star",
    check: (s) => s.totalBanknotes >= 1,
  },
  {
    id: "ten_banknotes",
    titleKey: "achievements.ten_banknotes.title",
    descriptionKey: "achievements.ten_banknotes.description",
    emoji: "\uD83D\uDCDA",
    icon: "library",
    check: (s) => s.totalBanknotes >= 10,
  },
  {
    id: "twentyfive_banknotes",
    titleKey: "achievements.twentyfive_banknotes.title",
    descriptionKey: "achievements.twentyfive_banknotes.description",
    emoji: "\uD83D\uDC8E",
    icon: "diamond",
    check: (s) => s.totalBanknotes >= 25,
  },
  {
    id: "fifty_banknotes",
    titleKey: "achievements.fifty_banknotes.title",
    descriptionKey: "achievements.fifty_banknotes.description",
    emoji: "\uD83C\uDFC6",
    icon: "trophy",
    check: (s) => s.totalBanknotes >= 50,
  },
  {
    id: "hundred_banknotes",
    titleKey: "achievements.hundred_banknotes.title",
    descriptionKey: "achievements.hundred_banknotes.description",
    emoji: "\uD83D\uDC51",
    icon: "ribbon",
    check: (s) => s.totalBanknotes >= 100,
  },
  {
    id: "five_countries",
    titleKey: "achievements.five_countries.title",
    descriptionKey: "achievements.five_countries.description",
    emoji: "\uD83C\uDF0D",
    icon: "globe-outline",
    check: (s) => s.uniqueCountries >= 5,
  },
  {
    id: "ten_countries",
    titleKey: "achievements.ten_countries.title",
    descriptionKey: "achievements.ten_countries.description",
    emoji: "\uD83D\uDDFA\uFE0F",
    icon: "map-outline",
    check: (s) => s.uniqueCountries >= 10,
  },
  {
    id: "twentyfive_countries",
    titleKey: "achievements.twentyfive_countries.title",
    descriptionKey: "achievements.twentyfive_countries.description",
    emoji: "\u2708\uFE0F",
    icon: "airplane",
    check: (s) => s.uniqueCountries >= 25,
  },
  {
    id: "all_continents",
    titleKey: "achievements.all_continents.title",
    descriptionKey: "achievements.all_continents.description",
    emoji: "\uD83C\uDF0E",
    icon: "earth",
    check: (s) => s.continentsTouched >= 6,
  },
  {
    id: "continent_complete",
    titleKey: "achievements.continent_complete.title",
    descriptionKey: "achievements.continent_complete.description",
    emoji: "\u2B50",
    icon: "checkmark-done",
    check: (s) => s.continentsCompleted >= 1,
  },
  {
    id: "photographer",
    titleKey: "achievements.photographer.title",
    descriptionKey: "achievements.photographer.description",
    emoji: "\uD83D\uDCF8",
    icon: "camera",
    check: (s) => s.banknotesWithBackPhoto >= 10,
  },
  {
    id: "world_explorer",
    titleKey: "achievements.world_explorer.title",
    descriptionKey: "achievements.world_explorer.description",
    emoji: "\uD83E\uDDED",
    icon: "compass-outline",
    check: (s) => s.uniqueCountries >= 50,
  },
] as const;
