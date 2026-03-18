import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };

// Auth functions
export async function signUp(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Sync types
export interface CloudBanknote {
  id: number;
  country_code: string;
  denomination: string;
  currency: string;
  front_photo_base64: string;
  back_photo_base64: string | null;
  year_start: number;
  year_end: number | null;
  is_current: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CloudCustomCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

// Firestore sync functions
export async function uploadCollection(
  userId: string,
  banknotes: CloudBanknote[],
  customCountries: CloudCustomCountry[]
): Promise<void> {
  const userRef = doc(db, "users", userId);

  // Clear existing banknotes
  const existingSnap = await getDocs(
    collection(db, "users", userId, "banknotes")
  );
  const batch1 = writeBatch(db);
  existingSnap.docs.forEach((d) => batch1.delete(d.ref));
  await batch1.commit();

  // Clear existing custom countries
  const existingCountries = await getDocs(
    collection(db, "users", userId, "custom_countries")
  );
  const batch2 = writeBatch(db);
  existingCountries.docs.forEach((d) => batch2.delete(d.ref));
  await batch2.commit();

  // Upload banknotes in batches of 500 (Firestore limit)
  for (let i = 0; i < banknotes.length; i += 400) {
    const batch = writeBatch(db);
    const chunk = banknotes.slice(i, i + 400);
    for (const bn of chunk) {
      const bnRef = doc(db, "users", userId, "banknotes", bn.id.toString());
      batch.set(bnRef, bn);
    }
    await batch.commit();
  }

  // Upload custom countries
  if (customCountries.length > 0) {
    const batch = writeBatch(db);
    for (const cc of customCountries) {
      const ccRef = doc(db, "users", userId, "custom_countries", cc.code);
      batch.set(ccRef, cc);
    }
    await batch.commit();
  }

  // Save sync timestamp
  await setDoc(userRef, { lastSync: new Date().toISOString() }, { merge: true });
}

export async function downloadCollection(
  userId: string
): Promise<{ banknotes: CloudBanknote[]; customCountries: CloudCustomCountry[] }> {
  const banknotesSnap = await getDocs(
    collection(db, "users", userId, "banknotes")
  );
  const banknotes = banknotesSnap.docs.map((d) => d.data() as CloudBanknote);

  const countriesSnap = await getDocs(
    collection(db, "users", userId, "custom_countries")
  );
  const customCountries = countriesSnap.docs.map(
    (d) => d.data() as CloudCustomCountry
  );

  return { banknotes, customCountries };
}
