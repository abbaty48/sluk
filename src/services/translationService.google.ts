// Alternative Translation Service using Google Cloud Translation API
// This provides better translation quality than MyMemory
// Requires API key - see .env.example for setup

interface GoogleTranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

interface TranslationCache {
  [key: string]: string;
}

// In-memory cache
const translationCache: TranslationCache = {};

// Get API key from environment variables
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

// Language code mapping (Google uses ISO 639-1 codes)
const languageCodeMap: { [key: string]: string } = {
  en: "en",
  ar: "ar",
  ha: "ha",
  fr: "fr",
  ch: "zh-CN", // Chinese Simplified
};

/**
 * Check if Google Translate API is configured
 */
export function isGoogleTranslateConfigured(): boolean {
  return !!GOOGLE_API_KEY;
}

/**
 * Translates text using Google Cloud Translation API
 * @param text - Text to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (default: 'en')
 * @returns Translated text
 */
export async function translateTextGoogle(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  // Check if API key is configured
  if (!GOOGLE_API_KEY) {
    console.warn(
      "Google Translate API key not configured. Add VITE_GOOGLE_TRANSLATE_API_KEY to your .env file."
    );
    return text;
  }

  // If target language is the same as source, return original text
  if (targetLang === sourceLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `google-${sourceLang}-${targetLang}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Map language codes
    const targetCode = languageCodeMap[targetLang] || targetLang;
    const sourceCode = languageCodeMap[sourceLang] || sourceLang;

    // Google Cloud Translation API endpoint
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceCode,
        target: targetCode,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Translate API error:", errorData);
      return text;
    }

    const data: GoogleTranslationResponse = await response.json();

    if (data.data?.translations?.[0]?.translatedText) {
      const translatedText = data.data.translations[0].translatedText;
      // Cache the translation
      translationCache[cacheKey] = translatedText;
      return translatedText;
    }

    // If translation fails, return original text
    console.warn(`Google translation failed for: ${text}`);
    return text;
  } catch (error) {
    console.error("Google translation error:", error);
    return text; // Return original text on error
  }
}

/**
 * Translates multiple texts in batch using Google API
 * @param texts - Array of texts to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (default: 'en')
 * @returns Array of translated texts
 */
export async function translateBatchGoogle(
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> {
  // Check if API key is configured
  if (!GOOGLE_API_KEY) {
    console.warn("Google Translate API key not configured");
    return texts;
  }

  // If target language is the same as source, return original texts
  if (targetLang === sourceLang) {
    return texts;
  }

  try {
    // Map language codes
    const targetCode = languageCodeMap[targetLang] || targetLang;
    const sourceCode = languageCodeMap[sourceLang] || sourceLang;

    // Check cache for all texts
    const results: string[] = [];
    const textsToTranslate: string[] = [];
    const indicesToTranslate: number[] = [];

    texts.forEach((text, index) => {
      const cacheKey = `google-${sourceLang}-${targetLang}-${text}`;
      if (translationCache[cacheKey]) {
        results[index] = translationCache[cacheKey];
      } else {
        textsToTranslate.push(text);
        indicesToTranslate.push(index);
      }
    });

    // If all texts are cached, return cached results
    if (textsToTranslate.length === 0) {
      return results;
    }

    // Google Cloud Translation API endpoint
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: textsToTranslate,
        source: sourceCode,
        target: targetCode,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Translate API error:", errorData);
      return texts;
    }

    const data: GoogleTranslationResponse = await response.json();

    if (data.data?.translations) {
      data.data.translations.forEach((translation, idx) => {
        const originalIndex = indicesToTranslate[idx];
        const translatedText = translation.translatedText;
        results[originalIndex] = translatedText;

        // Cache the translation
        const cacheKey = `google-${sourceLang}-${targetLang}-${textsToTranslate[idx]}`;
        translationCache[cacheKey] = translatedText;
      });

      return results;
    }

    // If translation fails, return original texts
    console.warn("Google batch translation failed");
    return texts;
  } catch (error) {
    console.error("Google batch translation error:", error);
    return texts; // Return original texts on error
  }
}

/**
 * Detects the language of the given text
 * @param text - Text to detect language for
 * @returns Detected language code
 */
export async function detectLanguageGoogle(text: string): Promise<string> {
  if (!GOOGLE_API_KEY) {
    console.warn("Google Translate API key not configured");
    return "en";
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
      }),
    });

    if (!response.ok) {
      console.error("Language detection failed");
      return "en";
    }

    const data = await response.json();

    if (data.data?.detections?.[0]?.[0]?.language) {
      return data.data.detections[0][0].language;
    }

    return "en";
  } catch (error) {
    console.error("Language detection error:", error);
    return "en";
  }
}

/**
 * Gets list of supported languages
 * @returns Array of supported language codes
 */
export async function getSupportedLanguagesGoogle(): Promise<string[]> {
  if (!GOOGLE_API_KEY) {
    console.warn("Google Translate API key not configured");
    return ["en", "ar", "ha", "fr", "zh-CN"];
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2/languages?key=${GOOGLE_API_KEY}&target=en`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch supported languages");
      return ["en", "ar", "ha", "fr", "zh-CN"];
    }

    const data = await response.json();

    if (data.data?.languages) {
      return data.data.languages.map((lang: { language: string }) => lang.language);
    }

    return ["en", "ar", "ha", "fr", "zh-CN"];
  } catch (error) {
    console.error("Error fetching supported languages:", error);
    return ["en", "ar", "ha", "fr", "zh-CN"];
  }
}

/**
 * Clears the Google translation cache
 */
export function clearGoogleTranslationCache(): void {
  Object.keys(translationCache).forEach((key) => {
    if (key.startsWith("google-")) {
      delete translationCache[key];
    }
  });
}

/**
 * Get cache statistics
 */
export function getGoogleCacheStats(): {
  size: number;
  entries: number;
} {
  const googleEntries = Object.keys(translationCache).filter((key) =>
    key.startsWith("google-")
  );
  const size = googleEntries.reduce(
    (acc, key) => acc + translationCache[key].length,
    0
  );

  return {
    size,
    entries: googleEntries.length,
  };
}

// Export default translation functions
export default {
  translateText: translateTextGoogle,
  translateBatch: translateBatchGoogle,
  detectLanguage: detectLanguageGoogle,
  getSupportedLanguages: getSupportedLanguagesGoogle,
  clearCache: clearGoogleTranslationCache,
  getCacheStats: getGoogleCacheStats,
  isConfigured: isGoogleTranslateConfigured,
};
