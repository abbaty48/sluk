import { useState, useEffect } from "react";
import { translateText, translateBatch } from "@/services/translationService";

interface TranslatedContent {
  title: string;
  abstract: string;
  isTranslating: boolean;
  error: string | null;
}

/**
 * Custom hook for translating article content (title and abstract)
 * @param originalTitle - Original article title
 * @param originalAbstract - Original article abstract
 * @param targetLang - Target language for translation
 * @param sourceLang - Source language (default: 'en')
 * @returns Translated content with loading and error states
 */
export function useArticleTranslation(
  originalTitle: string,
  originalAbstract: string,
  targetLang: string,
  sourceLang: string = "en"
): TranslatedContent {
  const [translatedTitle, setTranslatedTitle] = useState<string>(originalTitle);
  const [translatedAbstract, setTranslatedAbstract] = useState<string>(originalAbstract);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset to original content if target language is same as source
    if (targetLang === sourceLang) {
      setTranslatedTitle(originalTitle);
      setTranslatedAbstract(originalAbstract);
      setIsTranslating(false);
      setError(null);
      return;
    }

    // Translate content when language changes
    const translateContent = async () => {
      setIsTranslating(true);
      setError(null);

      try {
        // Translate both title and abstract in batch
        const [title, abstract] = await translateBatch(
          [originalTitle, originalAbstract],
          targetLang,
          sourceLang
        );

        setTranslatedTitle(title);
        setTranslatedAbstract(abstract);
      } catch (err) {
        console.error("Translation error:", err);
        setError("Failed to translate content");
        // Fallback to original content on error
        setTranslatedTitle(originalTitle);
        setTranslatedAbstract(originalAbstract);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [originalTitle, originalAbstract, targetLang, sourceLang]);

  return {
    title: translatedTitle,
    abstract: translatedAbstract,
    isTranslating,
    error,
  };
}

/**
 * Hook for translating a single text field
 * @param originalText - Original text to translate
 * @param targetLang - Target language
 * @param sourceLang - Source language (default: 'en')
 * @returns Translated text with loading state
 */
export function useTextTranslation(
  originalText: string,
  targetLang: string,
  sourceLang: string = "en"
): { text: string; isTranslating: boolean } {
  const [translatedText, setTranslatedText] = useState<string>(originalText);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (targetLang === sourceLang) {
      setTranslatedText(originalText);
      setIsTranslating(false);
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      try {
        const translated = await translateText(
          originalText,
          targetLang,
          sourceLang
        );
        setTranslatedText(translated);
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedText(originalText);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [originalText, targetLang, sourceLang]);

  return { text: translatedText, isTranslating };
}
