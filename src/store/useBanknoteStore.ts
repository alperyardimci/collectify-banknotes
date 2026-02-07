import { create } from "zustand";
import type { SQLiteDatabase } from "expo-sqlite";
import { initDatabase } from "@/db/schema";
import {
  getAllBanknotes,
  getCountryBanknoteCounts,
  insertBanknote,
  updateBanknote as updateBanknoteQuery,
  deleteBanknote as deleteBanknoteQuery,
  type BanknoteRow,
  type InsertBanknoteData,
  type UpdateBanknoteData,
} from "@/db/queries";
import { deletePhoto } from "@/utils/photos";
import { CONTINENTS } from "@/constants/continents";

interface BanknoteStore {
  banknotes: BanknoteRow[];
  countryStats: Record<string, number>;
  isLoaded: boolean;

  initialize: (db: SQLiteDatabase) => void;
  loadBanknotes: (db: SQLiteDatabase) => void;
  addBanknote: (db: SQLiteDatabase, data: InsertBanknoteData) => BanknoteRow;
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
}

export const useBanknoteStore = create<BanknoteStore>((set, get) => ({
  banknotes: [],
  countryStats: {},
  isLoaded: false,

  initialize: (db: SQLiteDatabase) => {
    initDatabase(db);
    const banknotes = getAllBanknotes(db);
    const counts = getCountryBanknoteCounts(db);
    const countryStats: Record<string, number> = {};
    for (const row of counts) {
      countryStats[row.country_code] = row.count;
    }
    set({ banknotes, countryStats, isLoaded: true });
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
    const newBanknote = insertBanknote(db, data);
    const { banknotes, countryStats } = get();
    const newStats = { ...countryStats };
    newStats[data.country_code] = (newStats[data.country_code] || 0) + 1;
    set({
      banknotes: [newBanknote, ...banknotes],
      countryStats: newStats,
    });
    return newBanknote;
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
}));
