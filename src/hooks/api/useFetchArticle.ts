import { getArticles } from "@/api/fetchArticles";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ArticleSearchParams } from "@/lib/types/IArticle";

export function useFetchArticles<Params extends ArticleSearchParams>(
  params: Params,
) {
  return useInfiniteQuery({
    queryKey: ["articles", { ...params }],
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    queryFn: ({ pageParam = 1 }) => getArticles({ ...params, page: pageParam }),
  });
}
