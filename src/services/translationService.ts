// Translation service using MyMemory Translation API (free, no API key required)
// You can also replace this with Google Translate API, DeepL, or other services

interface TranslationCache {
  [key: string]: string;
}

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
  responseStatus: number;
}

// In-memory cache to avoid redundant API calls
const translationCache: TranslationCache = {};

// Language code mapping for MyMemory API
const languageCodeMap: { [key: string]: string } = {
  en: "en-US",
  ar: "ar-SA",
  ha: "ha",
  fr: "fr-FR",
  ch: "zh-CN",
};

/**
 * Translates text from one language to another using MyMemory Translation API
 * @param text - Text to translate
 * @param targetLang - Target language code (en, ar, ha, fr, ch)
 * @param sourceLang - Source language code (default: 'en')
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  // If target language is the same as source, return original text
  if (targetLang === sourceLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Map language codes to MyMemory format
    const sourceCode = languageCodeMap[sourceLang] || sourceLang;
    const targetCode = languageCodeMap[targetLang] || targetLang;

    // MyMemory Translation API (free, no API key required)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceCode}|${targetCode}`;

    const response = await fetch(url);
    const data: TranslationResponse = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translatedText = data.responseData.translatedText;
      // Cache the translation
      translationCache[cacheKey] = translatedText;
      return translatedText;
    }

    // If translation fails, return original text
    console.warn(`Translation failed for: ${text}`);
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text on error
  }
}

/**
 * Translates multiple texts in batch
 * @param texts - Array of texts to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (default: 'en')
 * @returns Array of translated texts
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> {
  const promises = texts.map((text) =>
    translateText(text, targetLang, sourceLang)
  );
  return Promise.all(promises);
}

/**
 * Clears the translation cache
 */
export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach((key) => {
    delete translationCache[key];
  });
}

/**
 * Alternative: Use LibreTranslate API (self-hosted or public instance)
 * Uncomment and modify if you prefer LibreTranslate
 */
/*
export async function translateTextLibre(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  if (targetLang === sourceLang) {
    return text;
  }

  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    });

    const data = await response.json();
    if (data.translatedText) {
      translationCache[cacheKey] = data.translatedText;
      return data.translatedText;
    }

    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
*/
