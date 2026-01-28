import { use, useMemo } from "react";
import { HomeContext } from "@/states/providers/homeContext";

export function useSearchQuery() {
  const {
    searchQuery,
    changeQuery,
    changeSearching,
    changeSearchTerm,
    changeSearchSortBy,
  } = use(HomeContext);
  return useMemo(
    () => ({
      searchQuery,
      changeQuery,
      changeSearching,
      changeSearchTerm,
      changeSearchSortBy,
    }),
    [
      searchQuery,
      changeQuery,
      changeSearching,
      changeSearchTerm,
      changeSearchSortBy,
    ],
  );
}
