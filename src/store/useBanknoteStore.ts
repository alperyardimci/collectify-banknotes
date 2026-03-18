import { create } from "zustand";
import type { SQLiteDatabase } from "expo-sqlite";
import { initDatabase } from "@/db/schema";
import {
  getAllBanknotes,
  getCountryBanknoteCounts,
  insertBanknote,
  updateBanknote as updateBanknoteQuery,
  deleteBanknote as deleteBanknoteQuery,
  getUnlockedAchievements,
  unlockAchievement,
  getAllCustomCountries,
  type BanknoteRow,
  type InsertBanknoteData,
  type UpdateBanknoteData,
} from "@/db/queries";
import { deletePhoto } from "@/utils/photos";
import { CONTINENTS } from "@/constants/continents";
import { registerCustomCountry, getCustomCountries } from "@/constants/countries";
import {
  ACHIEVEMENTS,
  computeCollectionStats,
} from "@/constants/achievements";

export interface MilestoneEvent {
  type: "new_country" | "count_milestone" | "achievement";
  achievementId?: string;
  count?: number;
}

interface BanknoteStore {
  banknotes: BanknoteRow[];
  countryStats: Record<string, number>;
  isLoaded: boolean;
  unlockedAchievements: Set<string>;

  initialize: (db: SQLiteDatabase) => void;
  loadBanknotes: (db: SQLiteDatabase) => void;
  addBanknote: (
    db: SQLiteDatabase,
    data: InsertBanknoteData
  ) => { banknote: BanknoteRow; milestones: MilestoneEvent[] };
  updateBanknote: (
    db: SQLiteDatabase,
    id: number,
    data: UpdateBanknoteData
  ) => BanknoteRow | null;
  deleteBanknote: (
    db: SQLiteDatabase,
    id: number,
    frontPhoto?: string,
    backPhoto?: string | null
  ) => void;
  getBanknotesByCountry: (countryCode: string) => BanknoteRow[];
  getContinentProgress: (continentId: string) => {
    collected: number;
    total: number;
    percentage: number;
  };
  checkAchievements: (db: SQLiteDatabase) => string[];
}

export const useBanknoteStore = create<BanknoteStore>((set, get) => ({
  banknotes: [],
  countryStats: {},
  isLoaded: false,
  unlockedAchievements: new Set<string>(),

  initialize: (db: SQLiteDatabase) => {
    initDatabase(db);
    const banknotes = getAllBanknotes(db);
    const counts = getCountryBanknoteCounts(db);
    const countryStats: Record<string, number> = {};
    for (const row of counts) {
      countryStats[row.country_code] = row.count;
    }
    const unlocked = getUnlockedAchievements(db);
    const unlockedSet = new Set(unlocked.map((a) => a.id));
    // Load custom countries
    const customs = getAllCustomCountries(db);
    for (const c of customs) {
      registerCustomCountry(c.code, c.name, c.flag, c.currency);
    }
    set({ banknotes, countryStats, isLoaded: true, unlockedAchievements: unlockedSet });
  },

  loadBanknotes: (db: SQLiteDatabase) => {
    const banknotes = getAllBanknotes(db);
    const counts = getCountryBanknoteCounts(db);
    const countryStats: Record<string, number> = {};
    for (const row of counts) {
      countryStats[row.country_code] = row.count;
    }
    set({ banknotes, countryStats });
  },

  addBanknote: (db: SQLiteDatabase, data: InsertBanknoteData) => {
    const prevStats = get().countryStats;
    const prevCount = get().banknotes.length;
    const isNewCountry = !prevStats[data.country_code] || prevStats[data.country_code] === 0;

    const newBanknote = insertBanknote(db, data);
    const { banknotes } = get();
    const newBanknotes = [newBanknote, ...banknotes];
    const newCountryStats = { ...prevStats };
    newCountryStats[data.country_code] = (newCountryStats[data.country_code] || 0) + 1;

    set({
      banknotes: newBanknotes,
      countryStats: newCountryStats,
    });

    // Detect milestones
    const milestones: MilestoneEvent[] = [];

    if (isNewCountry) {
      milestones.push({ type: "new_country" });
    }

    const newCount = prevCount + 1;
    if ([10, 25, 50, 100].includes(newCount)) {
      milestones.push({ type: "count_milestone", count: newCount });
    }

    // Check achievements
    const newlyUnlocked = get().checkAchievements(db);
    for (const id of newlyUnlocked) {
      milestones.push({ type: "achievement", achievementId: id });
    }

    return { banknote: newBanknote, milestones };
  },

  updateBanknote: (db: SQLiteDatabase, id: number, data: UpdateBanknoteData) => {
    const updated = updateBanknoteQuery(db, id, data);
    if (updated) {
      const banknotes = get().banknotes.map((b) => (b.id === id ? updated : b));
      set({ banknotes });
    }
    return updated;
  },

  deleteBanknote: (
    db: SQLiteDatabase,
    id: number,
    frontPhoto?: string,
    backPhoto?: string | null
  ) => {
    const banknote = get().banknotes.find((b) => b.id === id);
    if (!banknote) return;

    deleteBanknoteQuery(db, id);

    if (frontPhoto) deletePhoto(frontPhoto);
    if (backPhoto) deletePhoto(backPhoto);

    const { banknotes, countryStats } = get();
    const newStats = { ...countryStats };
    const currentCount = newStats[banknote.country_code] || 0;
    if (currentCount <= 1) {
      delete newStats[banknote.country_code];
    } else {
      newStats[banknote.country_code] = currentCount - 1;
    }

    set({
      banknotes: banknotes.filter((b) => b.id !== id),
      countryStats: newStats,
    });
  },

  getBanknotesByCountry: (countryCode: string) => {
    return get().banknotes.filter((b) => b.country_code === countryCode);
  },

  getContinentProgress: (continentId: string) => {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    if (!continent) return { collected: 0, total: 0, percentage: 0 };

    const { countryStats } = get();

    if (continentId === "other") {
      const customs = getCustomCountries();
      const total = customs.length;
      let collected = 0;
      for (const c of customs) {
        if (countryStats[c.code] && countryStats[c.code] > 0) collected++;
      }
      return { collected, total, percentage: total > 0 ? collected / total : 0 };
    }

    const total = continent.countryCodes.length;
    let collected = 0;
    for (const code of continent.countryCodes) {
      if (countryStats[code] && countryStats[code] > 0) {
        collected++;
      }
    }
    const percentage = total > 0 ? collected / total : 0;
    return { collected, total, percentage };
  },

  checkAchievements: (db: SQLiteDatabase) => {
    const { banknotes, countryStats, unlockedAchievements } = get();
    const stats = computeCollectionStats(countryStats, banknotes);
    const newlyUnlocked: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedAchievements.has(achievement.id)) continue;
      if (achievement.check(stats)) {
        unlockAchievement(db, achievement.id);
        newlyUnlocked.push(achievement.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = new Set(unlockedAchievements);
      for (const id of newlyUnlocked) updated.add(id);
      set({ unlockedAchievements: updated });
    }

    return newlyUnlocked;
  },
}));
