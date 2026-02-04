import {
  useFetchArticleReviews,
  useAddArticleReview,
} from "@/hooks/api/useFetchArticle";

export function useLoadReviews(articleId: string) {
  return useFetchArticleReviews(articleId);
}

export function useSubmitReview(articleId: string) {
  const { mutateAsync, error: submitError } = useAddArticleReview();

  const submitReview = async (rating: number, comment: string) => {
    return await mutateAsync({ articleId, rating, comment });
  };
  return { submitReview, error: submitError };
}
