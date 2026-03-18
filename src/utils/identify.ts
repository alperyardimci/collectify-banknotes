import * as FileSystem from "expo-file-system/next";
import { File } from "expo-file-system/next";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

export interface BanknoteIdentification {
  countryCode: string;
  countryName: string;
  denomination: string;
  currency: string;
  yearStart?: number;
  yearEnd?: number;
  isCurrent?: boolean;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

export async function identifyBanknote(
  photoUri: string
): Promise<BanknoteIdentification | null> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  // Read image as base64
  const file = new File(photoUri);
  const base64 = file.base64();

  // Determine mime type
  const extension = photoUri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType =
    extension === "png" ? "image/png" : "image/jpeg";

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64,
            },
          },
          {
            text: `You are a banknote identification expert. Analyze this banknote image and identify:
1. The country of origin (ISO 3166-1 alpha-2 code AND country name in English)
2. The denomination (numeric value only)
3. The currency code (e.g., USD, EUR, TRY)
4. The approximate year or year range
5. Whether it's still in circulation

Respond ONLY with valid JSON in this exact format, no markdown, no code blocks:
{"countryCode":"XX","countryName":"Country Name","denomination":"100","currency":"XXX","yearStart":2000,"yearEnd":null,"isCurrent":true,"confidence":"high","notes":"Brief description"}

confidence should be "high", "medium", or "low".
If you cannot identify the banknote, respond with: {"error":"Cannot identify this banknote"}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

  // Parse JSON from response (handle potential markdown wrapping)
  let jsonStr = text;
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  }

  const result = JSON.parse(jsonStr);

  if (result.error) {
    return null;
  }

  return result as BanknoteIdentification;
}
