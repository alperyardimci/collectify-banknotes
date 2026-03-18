import { File, Paths } from "expo-file-system/next";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import type { BanknoteRow } from "@/db/queries";
import { getCountry } from "@/constants/countries";
import { CONTINENTS } from "@/constants/continents";
import type { TFunction } from "i18next";

export async function exportCSV(
  banknotes: BanknoteRow[],
  t: TFunction
): Promise<string> {
  const headers = [
    "Country",
    "Denomination",
    "Currency",
    "Year Start",
    "Year End",
    "In Circulation",
    "Notes",
    "Date Added",
  ].join(",");

  const rows = banknotes.map((b) => {
    const country = getCountry(b.country_code);
    const name = country ? t(country.nameKey) : b.country_code;
    const yearEnd = b.is_current ? "Present" : b.year_end ?? "";
    const notes = (b.notes || "").replace(/"/g, '""');
    return [
      `"${name}"`,
      `"${b.denomination}"`,
      b.currency,
      b.year_start,
      yearEnd,
      b.is_current ? "Yes" : "No",
      `"${notes}"`,
      b.created_at,
    ].join(",");
  });

  const csv = [headers, ...rows].join("\n");
  const file = new File(Paths.cache, "collectify-collection.csv");
  file.write(csv);
  return file.uri;
}

export async function exportPDF(
  banknotes: BanknoteRow[],
  t: TFunction
): Promise<string> {
  const totalCountries = new Set(banknotes.map((b) => b.country_code)).size;

  const countryToContinentMap = new Map<string, string>();
  for (const continent of CONTINENTS) {
    for (const code of continent.countryCodes) {
      countryToContinentMap.set(code, continent.id);
    }
  }

  const grouped = new Map<string, BanknoteRow[]>();
  for (const b of banknotes) {
    const cid = countryToContinentMap.get(b.country_code) || "other";
    if (!grouped.has(cid)) grouped.set(cid, []);
    grouped.get(cid)!.push(b);
  }

  let tableRows = "";
  for (const continent of CONTINENTS) {
    const items = grouped.get(continent.id);
    if (!items || items.length === 0) continue;
    tableRows += `<tr class="continent-row"><td colspan="5">${continent.emoji} ${t(continent.nameKey)} (${items.length})</td></tr>`;
    for (const b of items) {
      const country = getCountry(b.country_code);
      const name = country ? `${country.flag} ${t(country.nameKey)}` : b.country_code;
      const yearEnd = b.is_current ? t("banknote.present") : b.year_end ?? "";
      tableRows += `<tr>
        <td>${name}</td>
        <td>${b.denomination}</td>
        <td>${b.currency}</td>
        <td>${b.year_start}${yearEnd ? " - " + yearEnd : ""}</td>
        <td>${b.notes || ""}</td>
      </tr>`;
    }
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; background: #14161E; color: #F0EBE3; padding: 24px; }
  h1 { color: #D4A843; text-align: center; font-size: 28px; letter-spacing: 4px; }
  .summary { display: flex; justify-content: center; gap: 32px; margin: 16px 0 24px; }
  .stat { text-align: center; }
  .stat-value { font-size: 24px; color: #D4A843; font-weight: bold; }
  .stat-label { font-size: 12px; color: #8B8D9E; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #1E2030; color: #D4A843; padding: 8px; text-align: left; font-size: 12px; border-bottom: 1px solid #2A2C3E; }
  td { padding: 6px 8px; font-size: 11px; border-bottom: 1px solid #2A2C3E; }
  tr:nth-child(even) { background: rgba(30, 32, 48, 0.5); }
  .continent-row td { background: #1E2030; color: #D4A843; font-weight: bold; font-size: 13px; padding: 10px 8px; }
  .footer { text-align: center; color: #555770; font-size: 10px; margin-top: 24px; }
</style>
</head>
<body>
  <h1>COLLECTIFY</h1>
  <div class="summary">
    <div class="stat"><div class="stat-value">${banknotes.length}</div><div class="stat-label">${t("statistics.totalBanknotes")}</div></div>
    <div class="stat"><div class="stat-value">${totalCountries}</div><div class="stat-label">${t("statistics.totalCountries")}</div></div>
  </div>
  <table>
    <thead><tr><th>${t("banknote.denomination") === "Denomination" ? "Country" : "\u00dclke"}</th><th>${t("banknote.denomination")}</th><th>${t("banknote.currency")}</th><th>${t("banknote.yearStart")}</th><th>${t("banknote.notes")}</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="footer">Collectify Banknotes - ${new Date().toLocaleDateString()}</div>
</body>
</html>`;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}

export async function shareFile(fileUri: string): Promise<void> {
  await Sharing.shareAsync(fileUri);
}
