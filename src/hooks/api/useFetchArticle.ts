import { getArticles, type SortOption } from "@/api/fetchArticles";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { ArticleFilters } from "@/lib/types/IArticle";

export function useFetchArticles(term?: string, filter?: ArticleFilters, limit: number = 10, sortBy: SortOption = 'date-desc') {
    return useSuspenseInfiniteQuery({
        queryKey: ['articles', term, filter, limit, sortBy],
        queryFn: ({ pageParam = 1 }) => getArticles(term, filter, pageParam, limit, sortBy),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    });
}
