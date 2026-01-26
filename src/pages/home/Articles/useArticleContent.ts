import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import type { SortOption } from "@/lib/types/IArticle";
import { useEffect, useState } from "react";
import { useArticle } from "./useArticle";

export function useArticleContentState() {
    const { searchQuery, changeQuery } = useSearchQuery();
    const [previousArticles, setPreviousArticles] = useState<TEnrichedArticle[]>([]);
    const [showAlert, setShowAlert] = useState(true);
    const {
        isLoading,
        loadMoreRef,
        allArticles,
        hasNextPage,
        isFetchingNextPage,
    } = useArticle({ term: searchQuery.term ?? "", sortBy: searchQuery.sortBy as SortOption });

    /**
     *
     */
    useEffect(() => {
        if (!isLoading && !searchQuery.term && allArticles.length > 0 && previousArticles.length === 0) {
            setPreviousArticles(allArticles);
        }
    }, [isLoading, searchQuery.term, allArticles, previousArticles.length]);

    /**
     *
     */
    useEffect(() => {
        if (searchQuery.term && searchQuery.searching && previousArticles.length === 0) {
            setPreviousArticles(allArticles);
        }
    }, [searchQuery.term, searchQuery.searching, allArticles, previousArticles.length]);

    const isSearching = searchQuery.searching;
    const hasSearchTerm = searchQuery.term && searchQuery.term.trim() !== "";
    const hasResults = allArticles.length > 0;

    /**
     *
     */
    useEffect(() => {
        if (hasSearchTerm && !hasResults && !isSearching) {
            setShowAlert(true);
        }
    }, [hasSearchTerm, hasResults, isSearching]);

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
        hasResults, isLoading,
        showAlert, setShowAlert,
        searchQuery, changeQuery,
        loadMoreRef, allArticles,
        isSearching, hasSearchTerm,
        hasNextPage, isFetchingNextPage,
        previousArticles, setPreviousArticles
    }
}
