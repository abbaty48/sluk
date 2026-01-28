import {
  homeReducer,
  type IHomeStates,
  InitialHomeStates,
} from "./homeContext";
import { useReducer, useEffect } from "react";
import type { ArticleFilters } from "@/lib/types/IArticle";

export function useHomeContext() {
  const [{ viewMode, showFilter, searchQuery, articleFilters }, dispatch] =
    useReducer(homeReducer, InitialHomeStates);
  // Automatically hide filters on mobile/tablet on initial load
  useEffect(() => {
    const checkScreenSize = () => {
      // Hide filters on screens smaller than 1024px (tablet and mobile)
      const shouldHideFilters = window.innerWidth < 1024;
      dispatch({ type: "SET_SHOW_FILTER", payload: !shouldHideFilters });
    };
    // Check on mount
    checkScreenSize();
    // Add resize listener to handle orientation changes
    window.addEventListener("resize", checkScreenSize);
    //
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  //
  const changeShowFilter = (show: boolean) =>
    dispatch({ type: "SET_SHOW_FILTER", payload: show });
  const toggleShowFilter = () =>
    dispatch({ type: "SET_SHOW_FILTER", payload: !showFilter });
  //
  const changeSearchTerm = (term: string | null) =>
    dispatch({ type: "SET_SEARCHTERM", payload: term });
  //
  const changeSearchSortBy = (sortBy: string) =>
    dispatch({ type: "SET_SORTBY", payload: sortBy });
  //
  const changeSearching = (isSearching: boolean) =>
    dispatch({ type: "SET_SEARCHING", payload: isSearching });
  //
  const changeQuery = (query: Partial<IHomeStates["searchQuery"]>) =>
    dispatch({ type: "SET_QUERY", payload: query });
  //
  const changeViewMode = (view: "grid" | "list") =>
    dispatch({ type: "SET_VIEWMODE", payload: view });
  //
  const setArticleFilters = (filters: ArticleFilters) =>
    dispatch({ type: "SET_ARTICLE_FILTER", payload: filters });
  //
  const updateFilterField = (
    field: keyof ArticleFilters,
    value: string | number | readonly string[] | number[] | undefined,
  ) => dispatch({ type: "UPDATE_FILTER_FIELD", payload: { field, value } });

  return {
    viewMode,
    showFilter,
    searchQuery,
    articleFilters,
    changeQuery,
    changeViewMode,
    changeSearching,
    changeSearchTerm,
    toggleShowFilter,
    changeShowFilter,
    setArticleFilters,
    updateFilterField,
    changeSearchSortBy,
  };
}
