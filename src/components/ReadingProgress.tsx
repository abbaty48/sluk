// ReadingProgress Component - Shows reading progress for articles
// Implements accessibility best practices with ARIA labels and keyboard navigation
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface ReadingProgressProps {
  /**
   * Target element to track scroll progress
   * If not provided, uses window scroll
   */
  targetRef?: React.RefObject<HTMLElement>;

  /**
   * Show percentage indicator
   */
  showPercentage?: boolean;

  /**
   * Position of the progress bar
   */
  position?: "top" | "bottom";

  /**
   * Height of the progress bar in pixels
   */
  height?: number;

  /**
   * Custom color for the progress bar
   */
  color?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when reading is completed (100%)
   */
  onComplete?: () => void;

  /**
   * Show estimated time remaining
   */
  showTimeRemaining?: boolean;

  /**
   * Average words per minute for reading speed calculation
   */
  wordsPerMinute?: number;
}

export function ReadingProgress({
  targetRef,
  height = 4,
  onComplete,
  position = "top",
  className = "",
  wordsPerMinute = 200,
  showPercentage = false,
  color = "rgb(249, 115, 22)", // orange-500
  showTimeRemaining = false,
}: ReadingProgressProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const calculateProgress = useCallback(() => {
    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (targetRef?.current) {
      // Calculate progress for specific element
      const element = targetRef.current;
      scrollTop = element.scrollTop;
      scrollHeight = element.scrollHeight;
      clientHeight = element.clientHeight;
    } else {
      // Calculate progress for window
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = document.documentElement.clientHeight;
    }

    const totalScrollableHeight = scrollHeight - clientHeight;

    if (totalScrollableHeight <= 0) {
      return 0;
    }

    const progressPercentage = (scrollTop / totalScrollableHeight) * 100;
    return Math.min(Math.max(progressPercentage, 0), 100);
  }, [targetRef]);

  const calculateTimeRemaining = useCallback(() => {
    if (!showTimeRemaining) {
      return null;
    }

    try {
      const element = targetRef?.current || document;
      const text = element.textContent || "";
      const words = text.trim().split(/\s+/).length;
      const totalReadingTime = words / wordsPerMinute; // in minutes
      const remainingPercentage = (100 - progress) / 100;
      const remainingTime = totalReadingTime * remainingPercentage;

      return Math.ceil(remainingTime);
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return null;
    }
  }, [progress, showTimeRemaining, targetRef, wordsPerMinute]);

  const handleScroll = useCallback(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);

    // Trigger completion callback once
    if (newProgress >= 99.5 && !hasCompleted && onComplete) {
      setHasCompleted(true);
      onComplete();
    }

    // Calculate time remaining
    if (showTimeRemaining) {
      const time = calculateTimeRemaining();
      setTimeRemaining(time);
    }
  }, [
    onComplete,
    hasCompleted,
    calculateProgress,
    showTimeRemaining,
    calculateTimeRemaining,
  ]);

  useEffect(() => {
    // Set up scroll listener
    const scrollElement = targetRef?.current || document;
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    // Recalculate on resize
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial calculation with requestAnimationFrame to avoid cascading renders
    requestAnimationFrame(() => {
      handleScroll();
    });

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, targetRef]);

  const formatTimeRemaining = (minutes: number): string => {
    if (minutes < 1) {
      return t("readingProgress.lessThanMinute", "Less than 1 min");
    } else if (minutes === 1) {
      return t("readingProgress.oneMinute", "1 min");
    } else if (minutes < 60) {
      return t("readingProgress.minutes", {
        count: minutes,
        defaultValue: "{{count}} min",
      });
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) {
        return t("readingProgress.hours", {
          count: hours,
          defaultValue: "{{count}} hr",
        });
      }
      return t("readingProgress.hoursMinutes", {
        hours,
        minutes: mins,
        defaultValue: "{{hours}} hr {{minutes}} min",
      });
    }
  };

  const positionClasses = position === "top" ? "top-0" : "bottom-0";
  const roundedClasses =
    position === "top" ? "rounded-r-full" : "rounded-r-full";

  return (
    <>
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={t("readingProgress.label", "Reading progress")}
        aria-valuetext={`${Math.round(progress)}% ${t("readingProgress.complete", "complete")}`}
        className={`reading-progress fixed ${positionClasses} left-0 right-0 z-50 ${className}`}
      >
        <div
          className="bg-muted/80 backdrop-blur-sm"
          style={{ height: `${height}px` }}
          aria-hidden="true"
        >
          <div
            className={`h-full transition-all duration-150 ease-out ${roundedClasses}`}
            style={{
              width: `${progress}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Floating indicator (optional) */}
      {(showPercentage ||
        (showTimeRemaining && timeRemaining !== null && progress < 99)) && (
        <div
          className={`reading-progress-indicator fixed ${position === "top" ? "top-6" : "bottom-6"} right-4 z-50 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg transition-opacity duration-300 ${
            progress < 5 || progress > 98
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            {showPercentage && (
              <span aria-label={`${Math.round(progress)} percent complete`}>
                {Math.round(progress)}%
              </span>
            )}

            {showTimeRemaining && timeRemaining !== null && progress < 99 && (
              <>
                {showPercentage && (
                  <span className="text-muted-foreground">•</span>
                )}
                <span
                  className="text-muted-foreground"
                  aria-label={`Estimated time remaining: ${formatTimeRemaining(timeRemaining)}`}
                >
                  {formatTimeRemaining(timeRemaining)}{" "}
                  {t("readingProgress.remaining", "left")}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Completion celebration (optional) */}
      {progress >= 99.5 && hasCompleted && (
        <div
          className={`reading-progress-complete fixed ${position === "top" ? "top-6" : "bottom-6"} right-4 z-50 px-4 py-2 rounded-lg bg-primary text-primary-foreground shadow-lg animate-in fade-in slide-in-from-right-5 duration-500`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{t("readingProgress.finished", "Reading complete!")}</span>
          </div>
        </div>
      )}

      {/* Screen reader only live region for progress updates */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {Math.round(progress) % 25 === 0 && progress > 0 && progress < 100 && (
          <span>
            {t("readingProgress.milestone", {
              progress: Math.round(progress),
              defaultValue: "{{progress}}% of article read",
            })}
          </span>
        )}
      </div>
    </>
  );
}
