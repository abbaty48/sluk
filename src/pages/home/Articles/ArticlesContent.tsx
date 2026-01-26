import { useArticleContentState } from "./useArticleContent";
import { LoadingMore } from "@/components/LoadingMore";
import { ArticlesRenderer } from "./ArticlesRenderer";
import { ArticleSuspense } from "./ArticlesSuspense";

export function ArticlesContent() {
  const { isLoading, isSearching, showAlert,
    allArticles, loadMoreRef, isFetchingNextPage,
    hasNextPage, hasSearchTerm, hasResults, searchQuery,
    setShowAlert, previousArticles, changeQuery } = useArticleContentState()

  return (
    <article className="p-4 lg:p-8 md:col-start-2">
      {isLoading || isSearching ? (
        <ArticleSuspense />
      ) : showAlert && hasSearchTerm && !hasResults ? (
        <ArticlesRenderer
          inSearchMode={true}
          articles={previousArticles}
          setShowAlert={setShowAlert}
          searchTerm={searchQuery.term!}
          onBrowseAll={() => changeQuery({ term: null, searching: false })}
        />
      ) : (
        <>
          <ArticlesRenderer
            articles={allArticles}
            onBrowseAll={() => changeQuery({ term: null, searching: false })}
          />
          <div ref={loadMoreRef}>
            <LoadingMore
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
            />
          </div>
        </>
      )}
    </article>
  );
}
