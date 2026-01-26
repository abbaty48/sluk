import type { ArticleSearchParams } from "@/lib/types/IArticle";
import { useFetchArticles } from "@/hooks/api/useFetchArticle";
import useIntersection from "@/hooks/useIntersection";
import { useEffect, useRef } from "react";

export function useArticle<Params extends ArticleSearchParams>(params: Params) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, ...rest } =
    useFetchArticles(params);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersected = useIntersection(loadMoreRef);

  useEffect(() => {
    if (isIntersected && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allArticles =
    data?.pages.flatMap((page: any) => page.articles ?? []) || [];

  return {
    ...rest,
    isLoading,
    hasNextPage,
    allArticles,
    loadMoreRef,
    isIntersected,
    fetchNextPage,
    isFetchingNextPage,
  };
}
