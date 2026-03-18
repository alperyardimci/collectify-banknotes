import { File, Paths } from "expo-file-system/next";
import type { SQLiteDatabase } from "expo-sqlite";
import {
  getAllBanknotes,
  getAllCustomCountries,
  insertCustomCountry,
} from "@/db/queries";
import { ensurePhotoDir } from "@/utils/photos";
import { registerCustomCountry } from "@/constants/countries";
import {
  uploadCollection,
  downloadCollection,
  type CloudBanknote,
  type CloudCustomCountry,
} from "./firebase";

async function photoToBase64(uri: string): Promise<string> {
  try {
    const file = new File(uri);
    if (file.exists) {
      return await file.base64();
    }
  } catch {}
  return "";
}

export async function syncUpload(
  db: SQLiteDatabase,
  userId: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  onProgress?.("Reading local data...");

  const banknotes = getAllBanknotes(db);
  const customCountries = getAllCustomCountries(db);

  onProgress?.("Preparing photos...");

  const cloudBanknotes: CloudBanknote[] = [];
  for (const bn of banknotes) {
    const frontBase64 = await photoToBase64(bn.front_photo);
    const backBase64 = bn.back_photo ? await photoToBase64(bn.back_photo) : null;
    cloudBanknotes.push({
      id: bn.id,
      country_code: bn.country_code,
      denomination: bn.denomination,
      currency: bn.currency,
      front_photo_base64: frontBase64,
      back_photo_base64: backBase64,
      year_start: bn.year_start,
      year_end: bn.year_end,
      is_current: bn.is_current,
      notes: bn.notes,
      created_at: bn.created_at,
      updated_at: bn.updated_at,
    });
  }

  const cloudCountries: CloudCustomCountry[] = customCountries.map((cc) => ({
    code: cc.code,
    name: cc.name,
    flag: cc.flag,
    currency: cc.currency,
  }));

  onProgress?.("Uploading to cloud...");
  await uploadCollection(userId, cloudBanknotes, cloudCountries);
  onProgress?.("Done!");
}

export async function syncDownload(
  db: SQLiteDatabase,
  userId: string,
  onProgress?: (msg: string) => void
): Promise<{ banknoteCount: number; countryCount: number }> {
  onProgress?.("Downloading from cloud...");

  const { banknotes, customCountries } = await downloadCollection(userId);

  onProgress?.("Restoring custom countries...");

  for (const cc of customCountries) {
    insertCustomCountry(db, {
      code: cc.code,
      name: cc.name,
      currency: cc.currency,
      flag: cc.flag,
    });
    registerCustomCountry(cc.code, cc.name, cc.flag, cc.currency);
  }

  onProgress?.("Restoring banknotes...");

  // Clear existing banknotes
  db.runSync("DELETE FROM banknotes");

  for (const bn of banknotes) {
    let frontPhotoUri = "";
    let backPhotoUri: string | null = null;

    if (bn.front_photo_base64) {
      ensurePhotoDir();
      const filename = `restore_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
      const file = new File(Paths.document, "banknote-photos", filename);
      file.write(atob(bn.front_photo_base64));
      frontPhotoUri = file.uri;
    }

    if (bn.back_photo_base64) {
      ensurePhotoDir();
      const filename = `restore_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_back.jpg`;
      const file = new File(Paths.document, "banknote-photos", filename);
      file.write(atob(bn.back_photo_base64));
      backPhotoUri = file.uri;
    }

    db.runSync(
      `INSERT INTO banknotes (country_code, denomination, currency, front_photo, back_photo, year_start, year_end, is_current, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bn.country_code,
        bn.denomination,
        bn.currency,
        frontPhotoUri,
        backPhotoUri,
        bn.year_start,
        bn.year_end,
        bn.is_current,
        bn.notes,
        bn.created_at,
        bn.updated_at,
      ]
    );
  }

  onProgress?.("Done!");
  return { banknoteCount: banknotes.length, countryCount: customCountries.length };
}
