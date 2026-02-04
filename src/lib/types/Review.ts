export type TReview = {
  id: string;
  userId: string;
  articleId: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
};
export interface IReview {
  reviews: TReview[];
  avg: number;
}
