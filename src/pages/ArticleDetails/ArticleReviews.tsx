import { Loader2, Star, AlertCircle } from "lucide-react";
import {
  useState,
  Suspense,
  useOptimistic,
  useTransition,
  type FormEvent,
} from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { IReview, TReview } from "@/lib/types/Review";
import { useLoadReviews, useSubmitReview } from "./useReviewSummary";

/* ---------------------------------- UI ---------------------------------- */

function Reviews({
  reviews,
}: {
  reviews: (TReview & { sending?: boolean })[];
}) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <article
          key={r.id}
          className={`space-y-2 border rounded-lg p-4 bg-background transition-all ${
            r.sending ? "animate-pulse opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating ? "fill-current" : "stroke-current fill-none"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{r.rating}/5</span>
            </div>
            <time className="text-xs text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <p className="text-sm leading-relaxed">{r.comment}</p>
          {r.sending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Posting review...</span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

/* ----------------------------- Review Form ------------------------------ */

function ReviewFeedback({
  articleId,
  onOptimisticAdd,
}: {
  articleId: string;
  onOptimisticAdd: (r: TReview & { sending: boolean }) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { submitReview, error } = useSubmitReview(articleId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || isPending) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticReview: TReview & { sending: boolean } = {
      id: tempId,
      articleId,
      comment: comment.trim(),
      rating,
      userId: "guest_id",
      createdAt: new Date().toISOString(),
      sending: true,
    };

    // Start transition for optimistic update
    startTransition(async () => {
      // Add optimistic review
      onOptimisticAdd(optimisticReview);
      // Delay for a second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        // Submit to server
        await submitReview(rating, comment.trim());
        // Clear form on success
        setComment("");
        setRating(5);
      } catch (err) {
        // Error is handled by useSubmitReview hook
        console.error("Failed to submit review:", err);
      }
    });
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4 border-t">
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium">Your Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoveredRating(n)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={`Rate ${n} stars`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  n <= displayRating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-medium">
            {displayRating} {displayRating === 1 ? "star" : "stars"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-comment" className="text-sm font-medium">
          Your Review
        </Label>
        <div className="relative">
          <Textarea
            id="review-comment"
            rows={4}
            value={comment}
            maxLength={255}
            placeholder="Share your thoughts about this article..."
            className="resize-none"
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
          />
          <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {comment.length}/255
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!comment.trim() || isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}

/* ----------------------------- Reviews View ----------------------------- */

function LoadReviews({
  isError,
  optimisticReviews,
}: {
  isError: boolean;
  optimisticReviews: IReview;
}) {
  const { avg, reviews } = optimisticReviews;
  if (isError) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm">
          Failed to load reviews. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>
      )}
      <Reviews reviews={reviews} />
    </div>
  );
}

/* --------------------------- Main Component ----------------------------- */

export function ArticleReviews({ articleId }: { articleId: string }) {
  const { data, isError } = useLoadReviews(articleId);

  const safeData: IReview = data ?? { avg: 0, reviews: [] };

  const [optimisticState, addOptimistic] = useOptimistic(
    safeData,
    (state, newReview: TReview & { sending: boolean }) => {
      // Calculate new average including the optimistic review
      const currentTotal = state.avg * state.reviews.length;
      const newTotal = currentTotal + newReview.rating;
      const newCount = state.reviews.length + 1;
      const newAvg = newCount > 0 ? newTotal / newCount : 0;

      return {
        reviews: [newReview, ...state.reviews],
        avg: newAvg,
      };
    },
  );

  return (
    <ErrorBoundary
      fallback={
        <div>Something went wrong, Please refresh the page or try again.</div>
      }
    >
      <section className="flex flex-col gap-6 border rounded-lg p-6 bg-card shadow-sm">
        <h2 className="text-xl font-semibold">Reviews</h2>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <LoadReviews isError={isError} optimisticReviews={optimisticState} />
        </Suspense>

        <ReviewFeedback articleId={articleId} onOptimisticAdd={addOptimistic} />
      </section>
    </ErrorBoundary>
  );
}
