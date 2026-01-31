import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCitationFormatter } from "./formatters";
import { useState, useRef, useEffect } from "react";
import type { CitationData, CitationFormat } from "./types";
import { Copy, Check, Download, Share2, BookOpen } from "lucide-react";

interface CitationGeneratorProps {
  data: CitationData;
  className?: string;
}

export function CitationGenerator({
  data,
  className = "",
}: CitationGeneratorProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const citationRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const copyTimeoutRef = useRef<number | undefined>(undefined);
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>("APA");

  const formats: CitationFormat[] = [
    "APA",
    "MLA",
    "Chicago",
    "Harvard",
    "BibTeX",
    "IEEE",
  ];

  // Generate citation text
  const formatter = getCitationFormatter(selectedFormat);
  const citationText = formatter.format(data);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Copy to clipboard with accessibility feedback
  const handleCopy = async () => {
    try {
      // Create plain text version (strip HTML)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = citationText;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";

      await navigator.clipboard.writeText(plainText);
      setCopied(true);

      // Announce to screen readers
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.className = "sr-only";
      announcement.textContent = t(
        "citation.copied",
        "Citation copied to clipboard",
      );
      document.body.appendChild(announcement);

      // Clear timeout if exists
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Reset after 2 seconds
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        document.body.removeChild(announcement);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy citation:", error);
    }
  };

  // Download citation as .txt file
  const handleDownload = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = citationText;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `citation-${selectedFormat.toLowerCase()}-${data.title.slice(0, 30).replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Announce to screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.className = "sr-only";
    announcement.textContent = t("citation.downloaded", "Citation downloaded");
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 2000);
  };

  // Share citation
  const handleShare = async () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = citationText;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Citation: ${data.title}`,
          text: plainText,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  // Keyboard navigation for expand/collapse
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <section
      className={`citation-generator border rounded-lg p-4 md:p-6 bg-card ${className}`}
      aria-labelledby="citation-heading"
    >
      {/* Header with icon and title */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2
          id="citation-heading"
          className="text-lg md:text-xl font-semibold text-foreground"
        >
          {t("citation.title", "Cite This Work")}
        </h2>
      </div>

      {/* Summary - Always visible */}
      <div className="space-y-4">
        {/* Format selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Label
            htmlFor="citation-format"
            className="text-sm font-medium text-foreground"
          >
            {t("citation.format", "Citation Format")}:
          </Label>
          <Select
            value={selectedFormat}
            onValueChange={(value) =>
              setSelectedFormat(value as CitationFormat)
            }
          >
            <SelectTrigger
              id="citation-format"
              className="w-full sm:w-50 rounded-full"
              aria-label={t("citation.selectFormat", "Select citation format")}
            >
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => {
                const formatter = getCitationFormatter(format);
                return (
                  <SelectItem
                    key={format}
                    value={format}
                    aria-label={`${format} - ${formatter.getDescription()}`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{format}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {formatter.getDescription()}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Citation preview - Collapsible */}
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={handleKeyDown}
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-expanded={isExpanded}
            aria-controls="citation-text"
          >
            {isExpanded
              ? t("citation.hidePreview", "▼ Hide Preview")
              : t("citation.showPreview", "▶ Show Preview")}
          </button>

          {isExpanded && (
            <div
              id="citation-text"
              ref={citationRef}
              className="p-4 bg-muted rounded-md border border-border overflow-x-auto"
              role="region"
              aria-label={t("citation.preview", "Citation preview")}
              tabIndex={0}
            >
              <p
                className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word"
                dangerouslySetInnerHTML={{ __html: citationText }}
              />
            </div>
          )}
        </div>

        {/* Action buttons - Composite pattern */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t("citation.actions", "Citation actions")}
        >
          <Button
            onClick={handleCopy}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            aria-label={
              copied
                ? t("citation.copied", "Citation copied")
                : t("citation.copyToClipboard", "Copy citation to clipboard")
            }
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>{t("citation.copied", "Copied!")}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>{t("citation.copy", "Copy")}</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            aria-label={t(
              "citation.downloadFile",
              "Download citation as text file",
            )}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {t("citation.download", "Download")}
            </span>
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            aria-label={t("citation.shareVia", "Share citation")}
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {t("citation.share", "Share")}
            </span>
          </Button>
        </div>

        {/* Format description - Summary pattern */}
        <p className="text-xs text-muted-foreground" role="note">
          {formatter.getDescription()}
        </p>
      </div>

      {/* Hidden live region for screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </section>
  );
}
