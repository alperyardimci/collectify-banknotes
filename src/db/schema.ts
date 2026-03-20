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
      serial_number TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
  db.execSync(`
    CREATE INDEX IF NOT EXISTS idx_banknotes_country_code ON banknotes (country_code);
  `);
  // Migration: add serial_number column if it doesn't exist
  try {
    db.runSync("ALTER TABLE banknotes ADD COLUMN serial_number TEXT");
  } catch {
    // Column already exists
  }
  db.execSync(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      unlocked_at TEXT DEFAULT NULL
    );
  `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS custom_countries (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      flag TEXT DEFAULT '🏳️',
      currency TEXT NOT NULL,
      continent_id TEXT DEFAULT 'other'
    );
  `);
}
