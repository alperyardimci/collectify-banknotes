import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import type { SQLiteDatabase } from "expo-sqlite";
import { getAllBanknotes, getAllCustomCountries, insertCustomCountry } from "@/db/queries";
import { ensurePhotoDir, PHOTO_DIR_PATH } from "@/utils/photos";
import { registerCustomCountry } from "@/constants/countries";

interface BackupBanknote {
  country_code: string;
  denomination: string;
  currency: string;
  front_photo_base64: string;
  back_photo_base64: string | null;
  year_start: number;
  year_end: number | null;
  is_current: number;
  notes: string | null;
  serial_number?: string | null;
  created_at: string;
  updated_at: string;
}

interface BackupCustomCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

interface BackupFile {
  version: 1;
  app: "collectify-banknotes";
  exportedAt: string;
  banknotes: BackupBanknote[];
  customCountries: BackupCustomCountry[];
}

async function photoToBase64(uri: string): Promise<string> {
  if (!uri || uri === "") return "";
  try {
    const file = new File(uri);
    if (file.exists) {
      return await file.base64();
    }
  } catch (e) {
    console.warn("Failed to read photo:", uri, e);
  }
  return "";
}

export async function exportBackup(
  db: SQLiteDatabase,
  onProgress?: (msg: string) => void
): Promise<void> {
  onProgress?.("Reading collection...");

  const banknotes = getAllBanknotes(db);
  const customCountries = getAllCustomCountries(db);

  onProgress?.(`Preparing ${banknotes.length} banknotes...`);

  const backupBanknotes: BackupBanknote[] = [];
  for (let i = 0; i < banknotes.length; i++) {
    const bn = banknotes[i];
    onProgress?.(`Photo ${i + 1}/${banknotes.length}...`);

    let frontBase64 = "";
    let backBase64: string | null = null;

    try {
      frontBase64 = await photoToBase64(bn.front_photo);
    } catch {}
    try {
      backBase64 = bn.back_photo ? await photoToBase64(bn.back_photo) : null;
    } catch {}

    backupBanknotes.push({
      country_code: bn.country_code,
      denomination: bn.denomination,
      currency: bn.currency,
      front_photo_base64: frontBase64,
      back_photo_base64: backBase64,
      year_start: bn.year_start,
      year_end: bn.year_end,
      is_current: bn.is_current,
      notes: bn.notes,
      serial_number: bn.serial_number,
      created_at: bn.created_at,
      updated_at: bn.updated_at,
    });
  }

  const backup: BackupFile = {
    version: 1,
    app: "collectify-banknotes",
    exportedAt: new Date().toISOString(),
    banknotes: backupBanknotes,
    customCountries: customCountries.map((cc) => ({
      code: cc.code,
      name: cc.name,
      flag: cc.flag,
      currency: cc.currency,
    })),
  };

  onProgress?.("Creating file...");

  // Use async write for large files
  const json = JSON.stringify(backup);
  const exportFile = new File(Paths.cache, "collectify-backup.json");
  try {
    if (exportFile.exists) exportFile.delete();
  } catch {}
  exportFile.create();
  exportFile.write(json);

  onProgress?.("Sharing...");
  await Sharing.shareAsync(exportFile.uri, {
    mimeType: "application/json",
    dialogTitle: "Export Collectify Backup",
  });
}

export async function importBackup(
  db: SQLiteDatabase,
  onProgress?: (msg: string) => void
): Promise<{ banknoteCount: number; countryCount: number }> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "public.json", "*/*"],
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) {
    throw new Error("cancelled");
  }

  onProgress?.("Reading file...");

  const file = new File(result.assets[0].uri);
  const content = await file.text();
  let backup: BackupFile;
  try {
    backup = JSON.parse(content);
  } catch {
    throw new Error("invalid");
  }

  if (backup.app !== "collectify-banknotes" || !backup.banknotes) {
    throw new Error("invalid");
  }

  onProgress?.("Restoring custom countries...");

  for (const cc of backup.customCountries || []) {
    insertCustomCountry(db, { code: cc.code, name: cc.name, currency: cc.currency, flag: cc.flag });
    registerCustomCountry(cc.code, cc.name, cc.flag, cc.currency);
  }

  onProgress?.("Restoring banknotes...");

  db.runSync("DELETE FROM banknotes");

  const photoDir = PHOTO_DIR_PATH();

  for (let i = 0; i < backup.banknotes.length; i++) {
    const bn = backup.banknotes[i];
    onProgress?.(`Banknote ${i + 1}/${backup.banknotes.length}...`);

    let frontPhotoUri = "";
    let backPhotoUri: string | null = null;

    if (bn.front_photo_base64) {
      try {
        ensurePhotoDir();
        const filename = `import_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
        const photoFile = new File(Paths.document, "banknote-photos", filename);
        photoFile.create();

        // Decode base64 to bytes and write
        const bytes = Uint8Array.from(atob(bn.front_photo_base64), (c) => c.charCodeAt(0));
        const stream = photoFile.writableStream();
        const writer = stream.getWriter();
        await writer.write(bytes);
        await writer.close();

        frontPhotoUri = photoFile.uri;
      } catch (e) {
        console.warn("Failed to restore front photo:", e);
      }
    }

    if (bn.back_photo_base64) {
      try {
        ensurePhotoDir();
        const filename = `import_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_back.jpg`;
        const photoFile = new File(Paths.document, "banknote-photos", filename);
        photoFile.create();

        const bytes = Uint8Array.from(atob(bn.back_photo_base64), (c) => c.charCodeAt(0));
        const stream = photoFile.writableStream();
        const writer = stream.getWriter();
        await writer.write(bytes);
        await writer.close();

        backPhotoUri = photoFile.uri;
      } catch (e) {
        console.warn("Failed to restore back photo:", e);
      }
    }

    db.runSync(
      `INSERT INTO banknotes (country_code, denomination, currency, front_photo, back_photo, year_start, year_end, is_current, notes, serial_number, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        bn.serial_number ?? null,
        bn.created_at,
        bn.updated_at,
      ]
    );
  }

  onProgress?.("Done!");
  return {
    banknoteCount: backup.banknotes.length,
    countryCount: (backup.customCountries || []).length,
  };
}
