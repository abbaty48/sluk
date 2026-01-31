import { HomeContext } from "@/states/providers/homeContext";
import { useContext, useCallback, useMemo } from "react";
import { ArticleContext } from "./ArticleContext";

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const { articleFilters, updateFilterField, setArticleFilters } =
    useContext(HomeContext);

  const handleCategoryChange = useCallback(
    (value: string | number | readonly string[] | undefined) => {
      updateFilterField("category", value);
    },
    [updateFilterField],
  );

  const handleYearChange = useCallback(
    (newValue: number[]) => {
      updateFilterField("year", newValue);
    },
    [updateFilterField],
  );

  const handleFileTypeChange = useCallback(
    (value: string) => {
      updateFilterField("fileType", value);
    },
    [updateFilterField],
  );

  const handleAuthorChange = useCallback(
    (author: string) => {
      updateFilterField("author", author);
    },
    [updateFilterField],
  );

  const handleLanguageChange = useCallback(
    (language: string) => {
      updateFilterField("language", language);
    },
    [updateFilterField],
  );

  const resetFilter = useCallback(() => {
    setArticleFilters({
      category: "all",
      year: [1950, new Date().getFullYear()],
      fileType: "all",
      author: "",
      language: "all",
    });
  }, [setArticleFilters]);

  const value = useMemo(
    () => ({
      ...articleFilters,
      resetFilter,
      handleYearChange,
      handleAuthorChange,
      handleCategoryChange,
      handleFileTypeChange,
      handleLanguageChange,
    }),
    [
      articleFilters,
      resetFilter,
      handleYearChange,
      handleAuthorChange,
      handleCategoryChange,
      handleFileTypeChange,
      handleLanguageChange,
    ],
  );

  return <ArticleContext value={value}>{children}</ArticleContext>;
}
