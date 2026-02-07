import { File, Directory, Paths } from "expo-file-system/next";
import { PHOTO_DIR } from "@/constants/theme";

function getPhotoDirectory(): Directory {
  return new Directory(Paths.document, PHOTO_DIR);
}

export function ensurePhotoDir(): void {
  const dir = getPhotoDirectory();
  if (!dir.exists) {
    dir.create();
  }
}

export function savePhoto(uri: string): string {
  ensurePhotoDir();
  const extension = uri.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const sourceFile = new File(uri);
  const targetDir = getPhotoDirectory();
  const sourceName = sourceFile.uri.split("/").pop() || "photo";
  sourceFile.copy(targetDir);
  // Rename to our unique filename
  const copiedFile = new File(targetDir, sourceName);
  const finalFile = new File(targetDir, filename);
  if (copiedFile.uri !== finalFile.uri) {
    copiedFile.move(finalFile);
  }
  return finalFile.uri;
}

export function deletePhoto(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // File may already be deleted
  }
}

export function getPhotoUri(filename: string): string {
  const file = new File(Paths.document, PHOTO_DIR, filename);
  return file.uri;
}
