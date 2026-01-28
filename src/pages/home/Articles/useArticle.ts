import type { ArticleSearchParams } from "@/lib/types/IArticle";
import { useFetchArticles } from "@/hooks/api/useFetchArticle";
import useIntersection from "@/hooks/useIntersection";
import { useEffect, useRef } from "react";
import type { TEnrichedArticle } from "@/lib/types/TArticle";

type ArticlesPageResponse = {
  page: number;
  limit: number;
  hasMore: boolean;
  articles: TEnrichedArticle[];
  total: number;
};

export function useArticle<Params extends ArticleSearchParams>(params: Params) {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    ...rest
  } = useFetchArticles(params);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(loadMoreRef);

  // Ref to prevent multiple simultaneous fetch attempts
  const isFetchingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only proceed if element is visible and conditions are met
    if (
      !isIntersecting ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchingRef.current
    ) {
      return;
    }

    // Use a small debounce to prevent rapid re-triggers
    timeoutRef.current = setTimeout(() => {
      // Double-check conditions haven't changed during timeout
      if (hasNextPage && !isFetchingNextPage && !isFetchingRef.current) {
        isFetchingRef.current = true;

        fetchNextPage().finally(() => {
          // Reset after a delay to ensure React Query state has updated
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 300);
        });
      }
    }, 150);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset ref when fetch completes
  useEffect(() => {
    if (!isFetchingNextPage) {
      isFetchingRef.current = false;
    }
  }, [isFetchingNextPage]);

  const allArticles =
    data?.pages.flatMap((page: ArticlesPageResponse) => page.articles ?? []) ||
    [];

  return {
    ...rest,
    isLoading,
    hasNextPage,
    allArticles,
    loadMoreRef,
    isIntersecting,
    fetchNextPage,
    isFetchingNextPage,
  };
}
