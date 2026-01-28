import type { ArticleFilters } from "@/lib/types/IArticle";
import { createContext } from "react";

export type ArticleState = ArticleFilters & {
  handleYearChange: (newValue: number[]) => void;
  handleAuthorChange: (author: string) => void;
  handleFileTypeChange: (value: string) => void;
  handleLanguageChange: (language: string) => void;
  handleCategoryChange: (
    value: string | number | readonly string[] | undefined,
  ) => void;
  resetFilter: () => void;
};

export const initialArticleState: ArticleState = {
  author: "",
  fileType: "all",
  category: "all",
  language: "all",
  year: [1950, new Date().getFullYear()],
  resetFilter: () => void 0,
  handleYearChange: () => void 0,
  handleAuthorChange: () => void 0,
  handleCategoryChange: () => void 0,
  handleFileTypeChange: () => void 0,
  handleLanguageChange: () => void 0,
};

export type ArticleFilterAction =
  | { type: "SET_FILE_TYPE"; payload: string }
  | { type: "SET_AUTHOR"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_YEARS"; payload: number[] }
  | { type: "RESET" }
  | {
      type: "SET_CATEGORY";
      payload: string | number | readonly string[] | undefined;
    };

export function articleFilterReducer(
  state: ArticleState,
  action: ArticleFilterAction,
) {
  switch (action.type) {
    case "SET_FILE_TYPE":
      return { ...state, fileType: action.payload };
    case "SET_AUTHOR":
      return { ...state, author: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_YEARS":
      return { ...state, year: action.payload };
    case "RESET":
      return { ...initialArticleState };
    default:
      return state;
  }
}

export const ArticleContext = createContext<ArticleState>(initialArticleState);
