import { LoadingMore } from "@/components/LoadingMore";
import { ArticlesRenderer } from "./ArticlesRenderer";
import { useArticle } from "./useArticle";

export function ArticlesContent() {
    const { loadMoreRef, allArticles, isFetchingNextPage, hasNextPage } = useArticle()

    return (
        <article className="p-4 lg:p-8 md:col-start-2">
            <ArticlesRenderer articles={allArticles} />
            <div ref={loadMoreRef}>
                <LoadingMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} />
            </div>
        </article>
    );
}
