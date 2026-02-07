import type { SQLiteDatabase } from "expo-sqlite";

export interface BanknoteRow {
  id: number;
  country_code: string;
  denomination: string;
  currency: string;
  front_photo: string;
  back_photo: string | null;
  year_start: number;
  year_end: number | null;
  is_current: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsertBanknoteData {
  country_code: string;
  denomination: string;
  currency: string;
  front_photo: string;
  year_start: number;
  year_end?: number | null;
  is_current?: number;
  back_photo?: string | null;
  notes?: string | null;
}

export interface UpdateBanknoteData {
  denomination?: string;
  front_photo?: string;
  back_photo?: string | null;
  year_start?: number;
  year_end?: number | null;
  is_current?: number;
  notes?: string | null;
}

export function getAllBanknotes(db: SQLiteDatabase): BanknoteRow[] {
  return db.getAllSync<BanknoteRow>("SELECT * FROM banknotes ORDER BY created_at DESC");
}

export function getBanknotesByCountry(db: SQLiteDatabase, countryCode: string): BanknoteRow[] {
  return db.getAllSync<BanknoteRow>(
    "SELECT * FROM banknotes WHERE country_code = ? ORDER BY created_at DESC",
    [countryCode]
  );
}

export function getBanknoteById(db: SQLiteDatabase, id: number): BanknoteRow | null {
  return db.getFirstSync<BanknoteRow>("SELECT * FROM banknotes WHERE id = ?", [id]);
}

export function getCountryBanknoteCounts(
  db: SQLiteDatabase
): { country_code: string; count: number }[] {
  return db.getAllSync<{ country_code: string; count: number }>(
    "SELECT country_code, COUNT(*) as count FROM banknotes GROUP BY country_code"
  );
}

export function insertBanknote(db: SQLiteDatabase, data: InsertBanknoteData): BanknoteRow {
  const result = db.runSync(
    `INSERT INTO banknotes (country_code, denomination, currency, front_photo, back_photo, year_start, year_end, is_current, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.country_code,
      data.denomination,
      data.currency,
      data.front_photo,
      data.back_photo ?? null,
      data.year_start,
      data.year_end ?? null,
      data.is_current ?? 0,
      data.notes ?? null,
    ]
  );
  return getBanknoteById(db, result.lastInsertRowId)!;
}

export function updateBanknote(
  db: SQLiteDatabase,
  id: number,
  data: UpdateBanknoteData
): BanknoteRow | null {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.denomination !== undefined) {
    fields.push("denomination = ?");
    values.push(data.denomination);
  }
  if (data.front_photo !== undefined) {
    fields.push("front_photo = ?");
    values.push(data.front_photo);
  }
  if (data.back_photo !== undefined) {
    fields.push("back_photo = ?");
    values.push(data.back_photo);
  }
  if (data.year_start !== undefined) {
    fields.push("year_start = ?");
    values.push(data.year_start);
  }
  if (data.year_end !== undefined) {
    fields.push("year_end = ?");
    values.push(data.year_end);
  }
  if (data.is_current !== undefined) {
    fields.push("is_current = ?");
    values.push(data.is_current);
  }
  if (data.notes !== undefined) {
    fields.push("notes = ?");
    values.push(data.notes);
  }

  if (fields.length === 0) return getBanknoteById(db, id);

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.runSync(`UPDATE banknotes SET ${fields.join(", ")} WHERE id = ?`, values);
  return getBanknoteById(db, id);
}

export function deleteBanknote(db: SQLiteDatabase, id: number): void {
  db.runSync("DELETE FROM banknotes WHERE id = ?", [id]);
}
