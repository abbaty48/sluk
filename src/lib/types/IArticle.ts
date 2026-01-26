export interface ArticleFilters {
  category: string;
  year: number[];
  fileType: string;
  author: string;
  language: string;
}

export type SortOption =
  | "relevance"
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "author-asc"
  | "author-desc";

export type ArticleSearchParams = Partial<{
  term: string;
  limit: number;
  sortBy: SortOption;
  filter: ArticleFilters;
}>;

export const defaultArticleFilters: ArticleFilters = {
  category: "",
  year: [],
  fileType: "",
  author: "",
  language: "",
};
