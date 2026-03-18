import type { BanknoteRow } from "@/db/queries";
import { getCountry } from "@/constants/countries";
import { CONTINENTS } from "@/constants/continents";
import type { TFunction } from "i18next";

interface SearchFilters {
  continentId?: string;
  hasBackPhoto?: boolean;
}

const countryToContinentMap = new Map<string, string>();
for (const continent of CONTINENTS) {
  for (const code of continent.countryCodes) {
    countryToContinentMap.set(code, continent.id);
  }
}

export function searchBanknotes(
  banknotes: BanknoteRow[],
  query: string,
  filters: SearchFilters,
  t: TFunction
): BanknoteRow[] {
  let results = banknotes;

  if (filters.continentId) {
    const cid = filters.continentId;
    results = results.filter(
      (b) => countryToContinentMap.get(b.country_code) === cid
    );
  }

  if (filters.hasBackPhoto) {
    results = results.filter((b) => b.back_photo !== null);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((b) => {
      const country = getCountry(b.country_code);
      const countryName = country ? t(country.nameKey).toLowerCase() : "";
      const denomination = b.denomination.toLowerCase();
      const currency = b.currency.toLowerCase();
      const notes = (b.notes || "").toLowerCase();

      return (
        countryName.includes(q) ||
        denomination.includes(q) ||
        currency.includes(q) ||
        notes.includes(q)
      );
    });
  }

  return results;
}
