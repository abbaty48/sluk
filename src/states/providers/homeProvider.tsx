import { useHomeContext } from "./useHomeContext";
import { HomeContext } from "./homeContext";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function HomeProvider({ children }: Props) {
  const {
    viewMode,
    searchQuery,
    articleFilters,
    changeQuery,
    showFilter,
    changeViewMode,
    changeSearching,
    changeShowFilter,
    toggleShowFilter,
    changeSearchTerm,
    changeSearchSortBy,
    setArticleFilters,
    updateFilterField,
  } = useHomeContext();

  return (
    <HomeContext
      value={{
        viewMode,
        showFilter,
        searchQuery,
        articleFilters,
        changeQuery,
        changeViewMode,
        changeSearching,
        changeShowFilter,
        toggleShowFilter,
        changeSearchTerm,
        changeSearchSortBy,
        setArticleFilters,
        updateFilterField,
      }}
    >
      {children}
    </HomeContext>
  );
}
