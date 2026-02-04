import {
  useMutation,
  useInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { TReview } from "@/lib/types/Review";
import { getArticles } from "@/api/fetchArticles";
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

export function useFetchArticleReviews(articleId: string) {
  return useSuspenseQuery({
    queryKey: ["articleReviews", articleId],
    queryFn: async () => {
      try {
        const result = await fetch(`http://localhost:3000/reviews?${articleId}`)
          .then((res) => res.json())
          .then((json) => json);
        const reviews = result.filter(
          (review: TReview) => review.articleId === articleId,
        );
        if (reviews.length > 0) {
          const avg =
            Math.round(
              (reviews.reduce((s: number, r: TReview) => s + r.rating, 0) /
                reviews.length) *
                10,
            ) / 10;
          return { reviews, avg };
        }
        return { reviews: [], avg: 0 };
      } catch {
        return { reviews: [], avg: 0 };
      }
    },
  });
}

export function useAddArticleReview() {
  return useMutation({
    mutationFn: async (reviewData: {
      rating: number;
      comment: string;
      articleId: string;
    }) => {
      try {
        return await fetch("http://localhost:3000/reviews", {
          method: "POST",
          body: JSON.stringify(reviewData),
        })
          .then((res) => res.json())
          .then((json) => json);
      } catch {
        return { reviews: [], avg: 0 };
      }
    },
    // createArticleReview(articleId, reviewData) as unknown as Promise<TReview>,
  });
}
