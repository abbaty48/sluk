import { getArticles } from "@/api/fetchArticles";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ArticleSearchParams } from "@/lib/types/IArticle";

type ArticlesPageResponse = {
  page: number;
  limit: number;
  hasMore: boolean;
  articles: unknown[];
  total: number;
};

export function useFetchArticles<Params extends ArticleSearchParams>(
  params: Params,
) {
  return useInfiniteQuery({
    queryKey: ["articles", { ...params }],
    initialPageParam: 1,
    getNextPageParam: (lastPage: ArticlesPageResponse) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    queryFn: ({ pageParam }) =>
      getArticles({ ...params, page: pageParam as number }),
  });
}
