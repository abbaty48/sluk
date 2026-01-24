import { getArticles } from "@/api/fetchArticles";
import type { ArticleFilters } from "@/lib/types/IArticle";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export function useFetchArticles(term?: string, filter?: ArticleFilters, limit: number = 10) {
    return useSuspenseInfiniteQuery({
        queryKey: ['articles', term, filter, limit],
        queryFn: ({ pageParam = 1 }) => getArticles(term, filter, pageParam, limit),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    });
}
