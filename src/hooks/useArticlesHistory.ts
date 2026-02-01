import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { useCallback, useEffect, useState } from "react";

export function useArticlesHistory() {
    const [history, setHistory] = useState<TEnrichedArticle[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem("sluk-articlesHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const updateHistory = useCallback((article: TEnrichedArticle) => {
        setHistory((prevHistory) => {
            const filteredHistory = prevHistory.filter(a => a.id !== article.id);
            const newHistory = [article, ...filteredHistory].slice(0, 20); // Keep only latest 20
            localStorage.setItem("sluk-articlesHistory", JSON.stringify(newHistory));
            return newHistory;
        });
    }, [])

    const paginatedHistory = () => {
        const pageSize = 10;
        const pages = [];
        for (let i = 0; i < history.length; i += pageSize) {
            pages.push(history.slice(i, i + pageSize));
        }
        return pages.flat();
    }

    return { history, updateHistory, paginatedHistory } as const;

}
