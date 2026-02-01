import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { useShareSummary } from "./useShareSummary";
import { Articles } from "../home/Articles/Articles";
import { ArrowLeft, Link, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";

/**
 *
 */
export function ArticleDetailsLanguage({
    currentLanguage,
    changeLanguage,
}: {
    currentLanguage: string;
    changeLanguage: (lang: string) => void;
}) {
    return (
        <div className="flex items-center gap-1 border rounded-full p-1">
            {["en", "ar", "ha", "fr", "ch"].map((lang) => (
                <Button
                    key={lang}
                    size="sm"
                    className="rounded-full h-8 px-3"
                    onClick={() => changeLanguage(lang)}
                    variant={lang === currentLanguage ? "default" : "ghost"}
                >
                    {lang.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}
/**
 *
 */
export function ArticleDetailsSpeechButton(props: {
    lang: string;
    isSpeaking: boolean;
    isSpeechReady: boolean;
    isSpeechPaused: boolean;
    isSpeechLoading: boolean;
    stopSpeaking: () => void;
    pauseSpeaking: () => void;
    resumeSpeaking: () => void;
    t: TFunction<"translation", undefined>;
    speak: (text: string, lang: string) => void;
    translatedTitle: string;
    translatedAbstract: string;
}) {
    const {
        t,
        lang,
        speak,
        isSpeaking,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        isSpeechReady,
        isSpeechPaused,
        isSpeechLoading,
        translatedTitle,
        translatedAbstract,
    } = props;

    // Prepare the full text to speak (title + abstract)
    const textToSpeak = `${translatedTitle}. ${translatedAbstract}`;

    const handleSpeak = () => {
        speak(textToSpeak, lang);
    };

    const handlePauseResume = () => {
        if (isSpeechPaused) {
            resumeSpeaking();
        } else {
            pauseSpeaking();
        }
    };

    return (
        <div className="flex items-center gap-1">
            {isSpeaking || isSpeechPaused ? (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePauseResume}
                        disabled={!isSpeechReady || isSpeechLoading}
                        title={isSpeechPaused ? t("resumeReading") : t("pauseReading")}
                    >
                        {isSpeechPaused ? (
                            <Play className="h-4 w-4" />
                        ) : (
                            <Pause className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={stopSpeaking}
                        title={t("stopReading")}
                    >
                        <VolumeX className="h-4 w-4" />
                    </Button>
                </>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeak}
                    disabled={!isSpeechReady || isSpeechLoading}
                    title={t("readAloud")}
                >
                    <Volume2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("readAloud")}</span>
                </Button>
            )}
        </div>
    );
}
/**
 *
 */
export function ArticleDetailsShareButton(props: {
    articleTitle: string;
    articleAbstract: string;
    t: TFunction;
}) {
    const { share } = useShareSummary();
    const { t, articleTitle, articleAbstract } = props;
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => share(articleTitle, articleAbstract)}
        >
            <Share2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t("share")}</span>
        </Button>
    );
}
/**
 *
 */
export function ArticleDetail404() {
    const { t } = useTranslation();

    return (
        <div className="container-full mx-auto px-4 py-5 space-y-4 text-center">
            <SearchBar className="lg:w-1/2 mx-auto" />
            <h2 className="text-2xl font-bold text-muted-foreground">
                {t("notFound")}
            </h2>
            <Link to="/">
                <Button className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("backToHome")}
                </Button>
            </Link>
            <Articles />
        </div>
    );
}
