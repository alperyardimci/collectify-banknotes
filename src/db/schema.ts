import type { SQLiteDatabase } from "expo-sqlite";

export function initDatabase(db: SQLiteDatabase): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS banknotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_code TEXT NOT NULL,
      denomination TEXT NOT NULL,
      currency TEXT NOT NULL,
      front_photo TEXT NOT NULL,
      back_photo TEXT,
      year_start INTEGER NOT NULL,
      year_end INTEGER,
      is_current INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
  db.execSync(`
    CREATE INDEX IF NOT EXISTS idx_banknotes_country_code ON banknotes (country_code);
  `);
}
