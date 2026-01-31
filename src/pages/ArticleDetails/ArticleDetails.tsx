import {
  Eye,
  User,
  Play,
  Pause,
  Clock,
  Share2,
  VolumeX,
  Volume2,
  Calendar,
  FileText,
  Bookmark,
  VideoIcon,
  ArrowLeft,
  Download as DownloadIcon,
} from "lucide-react";
import { Suspense, lazy } from "react";
import type { TFunction } from "i18next";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Articles } from "../home/Articles/Articles";
import { useTranslateSummary } from "./useTranslate";
import { SearchBar } from "@/components/SearchBar";
import { useShareSummary } from "./useShareSummary";
import { useArticleSummary } from "./useArticleSummary";
import { useSpeech } from "@/hooks/useSpeechController";
import { ArticleDetailShimmer } from "./ArticleDetailShimmer";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ReadingProgress } from "@/components/ReadingProgress";
import { useArticleTranslation } from "@/hooks/useArticleTranslation";
import type { CitationData, Author } from "@/components/Citation/types";
import { CitationGenerator } from "@/components/Citation/CitationGenerator";

// Lazy load heavy components
const ReactPlayer = lazy(() => import("react-player"));
const PDFViewer = lazy(() =>
  import("./PDFViewer").then((m) => ({ default: m.PDFViewer })),
);
const DocViewer = lazy(() =>
  import("./DocViewer").then((m) => ({ default: m.DocViewer })),
);

/**
 *
 */
function Language({
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
function SpeechButton(props: {
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
function ShareButton(props: {
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

export function ArticleDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    article,
    files,
    docFile,
    pdfFile,
    videoFile,
    imageFile,
    isLoadingArticle,
  } = useArticleSummary(id);
  const {
    speak,
    isSpeaking,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeechReady,
    isSpeechPaused,
    isSpeechLoading,
  } = useSpeech();
  // Ref for reading progress tracking
  const { t, i18n, lang, changeLanguage } = useTranslateSummary(stopSpeaking);
  // Dynamic translation for article content
  const {
    isTranslating,
    title: translatedTitle,
    abstract: translatedAbstract,
  } = useArticleTranslation(
    article?.title || "",
    article?.abstract || "",
    i18n.language,
    "en",
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoadingArticle) {
    return <ArticleDetailShimmer />;
  }

  if (!article) {
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

  const displayImage = imageFile?.file_path || article.thumbnail;

  // Prepare citation data
  const citationData: CitationData = {
    title: article.title,
    url: window.location.href,
    publisher: article.publisher,
    abstract: article.abstract,
    pages: article.pages?.toString(),
    itemType: article.item_type_id?.toString(),
    year: new Date(article.created_at).getFullYear().toString(),
    authors: [{ firstName: "Unknown", lastName: "Author" }] as Author[],
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <ReadingProgress
        showTimeRemaining={true}
        showPercentage={true}
        position="top"
        height={3}
      />

      {/* Header with back button and actions */}
      <header className=" sticky top-0 z-1 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
        <div className="container-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </Button>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Switcher */}
              <Language
                currentLanguage={i18n.language}
                changeLanguage={changeLanguage}
              />

              {/* Read Aloud Button */}
              <SpeechButton
                t={t}
                lang={lang}
                speak={speak}
                isSpeaking={isSpeaking}
                stopSpeaking={stopSpeaking}
                pauseSpeaking={pauseSpeaking}
                resumeSpeaking={resumeSpeaking}
                isSpeechReady={isSpeechReady}
                isSpeechPaused={isSpeechPaused}
                isSpeechLoading={isSpeechLoading}
                translatedTitle={translatedTitle}
                translatedAbstract={translatedAbstract}
              />

              {/* Share Button */}
              <ShareButton
                t={t}
                articleTitle={translatedTitle}
                articleAbstract={translatedAbstract}
              />

              {/* Bookmark Button */}
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("bookmark")}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="container-full max-w-6xl  mx-auto px-4 py-8">
        {/* Hero Image */}
        {displayImage && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-muted">
            <img
              src={displayImage}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {isTranslating ? (
              <span className="animate-pulse">{article.title}</span>
            ) : (
              translatedTitle
            )}
          </h1>

          {/* Metadata Pills */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>
                {article.views.toLocaleString()} {t("views")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              <span>
                {article.downloads.toLocaleString()} {t("downloads")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            {article.pages && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>
                  {article.pages} {t("pages")}
                </span>
              </div>
            )}
            {videoFile && (
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Has Video</span>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {t("abstract")}
                {isTranslating && (
                  <span className="text-xs text-muted-foreground animate-pulse ml-2">
                    ({t("loading")})
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {isTranslating ? (
                  <span className="animate-pulse">{article.abstract}</span>
                ) : (
                  translatedAbstract
                )}
              </p>
            </section>

            {/* Video Player */}
            {videoFile && (
              <section className="bg-card rounded-xl p-6 shadow-sm border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <VideoIcon className="h-6 w-6 text-primary" />
                  {t("watchVideo")}
                </h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <div className="text-white">{t("loading")}</div>
                        </div>
                      </div>
                    }
                  >
                    <ReactPlayer
                      // url={videoFile.file_path}
                      controls
                      width="100%"
                      height="100%"
                      playing={false}
                      config={
                        {
                          // file: {
                          //   attributes: {
                          //     controlsList: "nodownload",
                          //     playsInline: true,
                          //   },
                          // },
                        }
                      }
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </Suspense>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {videoFile.mime_type} • Click play to start watching
                </p>
              </section>
            )}

            {/* PDF Viewer */}
            {pdfFile && (
              <section className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">
                    {t("viewDocument")}
                  </h2>
                  <a
                    href={pdfFile.file_path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      {t("download")}
                    </Button>
                  </a>
                </div>
                <div className="border rounded-lg overflow-hidden bg-muted min-h-150">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p>{t("loadingDocument")}</p>
                        </div>
                      </div>
                    }
                  >
                    <PDFViewer fileUrl={pdfFile.file_path} />
                  </Suspense>
                </div>
              </section>
            )}

            {/* DOC Viewer */}
            {docFile && !pdfFile && (
              <section className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">
                    {t("viewDocument")}
                  </h2>
                  <a
                    href={docFile.file_path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      {t("download")}
                    </Button>
                  </a>
                </div>
                <div className="border rounded-lg overflow-hidden bg-muted min-h-150">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p>{t("loadingDocument")}</p>
                        </div>
                      </div>
                    }
                  >
                    <DocViewer fileUrl={docFile.file_path} />
                  </Suspense>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Details Card */}
            <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-24">
              <h3 className="text-xl font-semibold mb-4">{t("details")}</h3>

              <div className="space-y-4">
                {/* Author */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{t("author")}</span>
                  </div>
                  <p className="text-sm ml-6">
                    {article.submitter_id || "Unknown"}
                  </p>
                </div>

                {/* Publisher */}
                {article.publisher && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{t("publisher")}</span>
                    </div>
                    <p className="text-sm ml-6">{article.publisher}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{t("status")}</span>
                  </div>
                  <p className="text-sm ml-6 capitalize">{article.status}</p>
                </div>

                {/* Last Updated */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{t("lastUpdated")}</span>
                  </div>
                  <p className="text-sm ml-6">
                    {formatDate(article.updated_at)}
                  </p>
                </div>

                {/* File Type */}
                {files && files.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{t("fileType")}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-6">
                      {files.map((file, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {file.mime_type.split("/")[1]?.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {pdfFile && (
                <a
                  href={pdfFile.file_path}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-6"
                >
                  <Button className="w-full" size="lg">
                    <DownloadIcon className="mr-2 h-5 w-5" />
                    {t("download")}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Citation Generator Section */}
        <div className="mt-12">
          <CitationGenerator data={citationData} />
        </div>

        {/* Related Articles Section */}
        <div className="mt-12">
          <RelatedArticles
            currentArticleId={article.id}
            collectionId={article.collection_id}
            itemTypeId={article.item_type_id}
            maxItems={6}
          />
        </div>
      </article>
    </article>
  );
}
