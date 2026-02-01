import { FileBox, BookOpen } from "lucide-react";
import { useViewMode } from "@/hooks/useViewMode";
import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { ArticleGridView, ArticleListView } from "@/components/ArticleView";

type Props = Partial<{
  searchTerm: string;
  inSearchMode: boolean;
  onBrowseAll: () => void;
  articles: TEnrichedArticle[];
}>;

function EmptyState({ onBrowseAll }: Props) {
  return (
    <div className="">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileBox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Articles Found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any articles matching your criteria. Try adjusting
            your search terms or browse our collection.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={onBrowseAll}
            className="inline-flex rounded-full items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse All
          </button>
        </div>
      </div>
    </div>
  );
}


export function ArticlesRenderer({
  articles,
  inSearchMode,
  onBrowseAll: _onBrowseAll,
}: Props) {
  const { viewMode } = useViewMode();

  return articles?.length === 0 || inSearchMode ? (
    <>
      <EmptyState onBrowseAll={_onBrowseAll} />
      <ArticleGridView articles={articles?.slice(0, 9)} />
    </>
  ) : viewMode === "grid" ? (
    <ArticleGridView articles={articles} />
  ) : (
    <ArticleListView articles={articles} />
  );
}
