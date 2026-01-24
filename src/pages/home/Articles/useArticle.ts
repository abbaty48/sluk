import { useFetchArticles } from "@/hooks/api/useFetchArticle";
import useIntersection from "@/hooks/useIntersection";
import { useEffect, useRef } from "react";


export function useArticle() {
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchArticles();

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isIntersected = useIntersection(loadMoreRef);

    useEffect(() => {
        if (isIntersected && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allArticles = data?.pages.flatMap((page: any) => page.articles) || [];

    return {
        ...fetch,
        allArticles,
        loadMoreRef,
        isIntersected,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    }

}
