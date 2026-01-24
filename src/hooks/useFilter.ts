import type { ArticleFilters } from "@/lib/types/IArticle";
import { useState } from "react";

export function useFilter() {
    const [filters, setFilters] = useState<ArticleFilters>({
        category: 'All',
        year: [1950, 2026],
        fileType: 'All',
        language: 'All',
        author: '',
    });

    const onFilterChange = (newFilters: ArticleFilters) => {
        setFilters(newFilters);
    };

    const handleCategoryChange = (category: string) => {
        onFilterChange({ ...filters, category });
    };

    const handleYearChange = (newValue: number[]) => {
        onFilterChange({ ...filters, year: newValue });
    };

    const handleFileTypeChange = (value: string) => {
        onFilterChange({ ...filters, fileType: value });
    };

    const handleAuthorChange = (author: string) => {
        onFilterChange({ ...filters, author });
    };

    const handleLanguageChange = (language: string) => {
        onFilterChange({ ...filters, language });
    };

    return {
        filters,
        onFilterChange,
        handleYearChange,
        handleAuthorChange,
        handleCategoryChange,
        handleLanguageChange,
        handleFileTypeChange
    }

}
