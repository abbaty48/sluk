import { Article } from "./Article";
import Masonry from "react-masonry-css";
import { FileBox, BookOpen } from "lucide-react";
import { useViewMode } from "@/hooks/useViewMode";
import type { Dispatch, SetStateAction } from "react";
import type { TEnrichedArticle } from "@/lib/types/TArticle";

type Props = Partial<{
  searchTerm: string;
  inSearchMode: boolean;
  onBrowseAll: () => void;
  articles: TEnrichedArticle[];
  setShowAlert: Dispatch<SetStateAction<boolean>>
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
            We couldn't find any articles matching your criteria. Try adjusting your search terms or browse our collection.
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

function GridView({ articles }: { articles: TEnrichedArticle[] | undefined }) {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    768: 2,
    500: 1,
  };

  return <Masonry
    breakpointCols={breakpointColumnsObj}
    className="flex gap-4"
    columnClassName="flex flex-col gap-4"
  >
    {articles?.map((article) => (
      <Article key={article.id} item={article} />
    ))}
  </Masonry>
}

function ListView({ articles }: { articles: TEnrichedArticle[] | undefined }) {
  return (
    <div className="flex flex-col gap-4">
      {articles?.map((article) => (
        <Article key={article.id} item={article} />
      ))}
    </div>
  )
}

export function ArticlesRenderer({ articles, inSearchMode, onBrowseAll: _onBrowseAll }: Props) {
  const { viewMode } = useViewMode();

  return articles?.length === 0 || inSearchMode ? (
    <>
      <EmptyState onBrowseAll={_onBrowseAll} />
      <GridView articles={articles?.slice(0, 9)} />
    </>
  ) : viewMode === "grid" ? <GridView articles={articles} />
    : <ListView articles={articles} />;
}
