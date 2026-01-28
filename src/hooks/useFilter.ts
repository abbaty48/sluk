// import { useArticle } from "@/pages/home/Articles/useArticle";
import type {
  ArticleState,
  ArticleFilterAction,
} from "@/pages/home/ArticlesFitler/ArticleContext";
import { useCallback, useMemo, type ActionDispatch } from "react";

export function useFilter(
  state: ArticleState,
  dispatch: ActionDispatch<[action: ArticleFilterAction]>,
) {
  const handleCategoryChange = useCallback(
    (value: string | number | readonly string[] | undefined) => {
      dispatch({
        type: "SET_CATEGORY",
        payload: value,
      });
    },
    [dispatch],
  );

  const handleYearChange = useCallback(
    (newValue: number[]) => {
      dispatch({
        type: "SET_YEARS",
        payload: newValue,
      });
    },
    [dispatch],
  );

  const handleFileTypeChange = useCallback(
    (value: string) => {
      dispatch({
        type: "SET_FILE_TYPE",
        payload: value,
      });
    },
    [dispatch],
  );

  const handleAuthorChange = useCallback(
    (author: string) => {
      dispatch({
        type: "SET_AUTHOR",
        payload: author,
      });
    },
    [dispatch],
  );

  const handleLanguageChange = useCallback(
    (language: string) => {
      dispatch({
        type: "SET_LANGUAGE",
        payload: language,
      });
    },
    [dispatch],
  );

  const resetFilter = useCallback(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return useMemo(
    () => ({
      ...state,
      resetFilter,
      handleYearChange,
      handleAuthorChange,
      handleCategoryChange,
      handleFileTypeChange,
      handleLanguageChange,
    }),
    [
      state,
      resetFilter,
      handleAuthorChange,
      handleCategoryChange,
      handleFileTypeChange,
      handleLanguageChange,
      handleYearChange,
    ],
  );
}
