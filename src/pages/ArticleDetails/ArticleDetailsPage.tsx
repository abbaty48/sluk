import { Suspense } from "react";
import { useParams } from "react-router";
import { ArticleDetails } from "./ArticleDetails";
import { useArticleSummary } from "./useArticleSummary";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ArticleDetailShimmer } from "./ArticleDetailShimmer";
import { ArticleDetail404 } from "./ArticleDetailsComponents";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
/**
 *
 *
 */
export const Component = function ArticleDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    article,
    isLoadingArticle,
    ...rest
  } = useArticleSummary(id);

  return <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallback={
          <div className="text-center text-destructive p-4">
            <h2>Failed to load articles.</h2>
            <button onClick={() => { reset(); }} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded">
              Retry </button>
          </div>
        }
      >
        <Suspense fallback={<ArticleDetailShimmer />}>
          {!article ? (
            <ArticleDetail404 />
          ) : (
            <ArticleDetails article={article} {...rest} />
          )}
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>

}
