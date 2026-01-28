import { HomeContext } from "@/states/providers/homeContext";
import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { useEffect, useState, useContext } from "react";
import type { SortOption } from "@/lib/types/IArticle";
import { useArticle } from "./useArticle";

export function useArticleContentState() {
  const { searchQuery, changeQuery, articleFilters } = useContext(HomeContext);
  const [previousArticles, setPreviousArticles] = useState<TEnrichedArticle[]>(
    [],
  );
  const {
    isLoading,
    loadMoreRef,
    allArticles,
    hasNextPage,
    isFetchingNextPage,
  } = useArticle({
    term: searchQuery.term ?? "",
    sortBy: searchQuery.sortBy as SortOption,
    filter: articleFilters,
  });

  /**
   *
   */
  useEffect(() => {
    if (
      !isLoading &&
      !searchQuery.term &&
      allArticles.length > 0 &&
      previousArticles.length === 0
    ) {
      (() => {
        setPreviousArticles(allArticles);
      })();
    }
  }, [isLoading, searchQuery.term, allArticles, previousArticles.length]);

  /**
   *
   */
  useEffect(() => {
    if (
      searchQuery.term &&
      searchQuery.searching &&
      previousArticles.length === 0
    ) {
      (() => {
        setPreviousArticles(allArticles);
      })();
    }
  }, [
    searchQuery.term,
    searchQuery.searching,
    allArticles,
    previousArticles.length,
  ]);

  const isSearching = searchQuery.searching;
  const hasSearchTerm = searchQuery.term && searchQuery.term.trim() !== "";
  const hasResults = allArticles.length > 0;

  /**
   *
   */
  useEffect(() => {
    // Set false isSearching is still searching but the searching has ended.
    if (searchQuery.searching && !isLoading) {
      changeQuery({ searching: false });
    }
  }, [isLoading, searchQuery.searching, changeQuery]);

  return {
    hasResults,
    isLoading,
    searchQuery,
    changeQuery,
    loadMoreRef,
    allArticles,
    isSearching,
    hasNextPage,
    hasSearchTerm,
    previousArticles,
    isFetchingNextPage,
    setPreviousArticles,
  };
}
