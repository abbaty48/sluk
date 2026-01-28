import type { ArticleFilters } from "@/lib/types/IArticle";
import { createContext } from "react";

/**
 *
 */
export interface IHomeStates {
  showFilter: boolean;
  viewMode: "grid" | "list";
  searchQuery: { term: string | null; sortBy: string; searching: boolean };
  articleFilters: ArticleFilters;
  toggleShowFilter: () => void;
  changeShowFilter: (isOpen: boolean) => void;
  changeSearchSortBy: (sortBy: string) => void;
  changeSearchTerm: (term: string | null) => void;
  changeSearching: (isSearching: boolean) => void;
  changeViewMode: (view: "grid" | "list") => void;
  setArticleFilters: (filters: ArticleFilters) => void;
  changeQuery: (query: Partial<IHomeStates["searchQuery"]>) => void;
  updateFilterField: (
    field: keyof ArticleFilters,
    value: string | number | readonly string[] | number[] | undefined,
  ) => void;
}

export const InitialHomeStates: IHomeStates = {
  viewMode: "grid",
  showFilter: true,
  searchQuery: { term: null, sortBy: "relevance", searching: false },
  articleFilters: {
    author: "",
    category: "all",
    fileType: "all",
    language: "all",
    year: [1950, new Date().getFullYear()],
  },
  changeQuery: () => void 0,
  changeViewMode: () => void 0,
  changeSearching: () => void 0,
  changeShowFilter: () => void 0,
  changeSearchTerm: () => void 0,
  toggleShowFilter: () => void 0,
  changeSearchSortBy: () => void 0,
  setArticleFilters: () => void 0,
  updateFilterField: () => void 0,
};
/**
 *
 */
export type HomeStateAction =
  | {
      type: "SET_QUERY";
      payload: Partial<{
        term: string | null;
        sortBy: string;
        searching: boolean;
      }>;
    }
  | {
      type: "SET_VIEWMODE";
      payload: "grid" | "list";
    }
  | {
      type: "SET_SHOW_FILTER";
      payload: boolean;
    }
  | {
      type: "SET_SEARCHTERM";
      payload: string | null;
    }
  | {
      type: "SET_SEARCHING";
      payload: boolean;
    }
  | {
      type: "SET_SORTBY";
      payload: string;
    }
  | {
      type: "SET_ARTICLE_FILTER";
      payload: ArticleFilters;
    }
  | {
      type: "UPDATE_FILTER_FIELD";
      payload: {
        field: keyof ArticleFilters;
        value: string | number | readonly string[] | number[] | undefined;
      };
    };

/**
 *
 * @param states IHomeStates
 * @param action HomeStateAction
 * @returns IHomeStates
 */
export function homeReducer(
  states: IHomeStates,
  action: HomeStateAction,
): IHomeStates {
  switch (action.type) {
    case "SET_VIEWMODE":
      return { ...states, viewMode: action.payload };
    case "SET_SHOW_FILTER":
      return { ...states, showFilter: action.payload };
    case "SET_SEARCHTERM": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          term: action.payload,
        }),
      };
    }
    case "SET_SEARCHING": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          searching: action.payload,
        }),
      };
    }
    case "SET_SORTBY": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          sortBy: action.payload,
        }),
      };
    }
    case "SET_QUERY": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, action.payload),
      };
    }
    case "SET_ARTICLE_FILTER":
      return { ...states, articleFilters: action.payload };
    case "UPDATE_FILTER_FIELD":
      return {
        ...states,
        articleFilters: {
          ...states.articleFilters,
          [action.payload.field]: action.payload.value,
        },
      };
    default:
      return states;
  }
}
/**
 *
 */
export const HomeContext = createContext<IHomeStates>(InitialHomeStates);
