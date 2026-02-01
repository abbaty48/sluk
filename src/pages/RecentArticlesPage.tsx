import { ArticleGridView, ArticleListView } from "@/components/ArticleView";
import { useArticlesHistory } from "@/hooks/useArticlesHistory";
import { ViewModeButton } from "@/components/ViewModeButton";
import { Articles } from "./home/Articles/Articles";
import { FileBox } from "lucide-react";
import { } from 'react-router'
import { useState } from "react";

function EmptyHistory() {
    return (
        <div className="text-center max-w-md mx-auto p-8 font-extralight">
            <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FileBox className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No History Articles Found
                </h3>
                <p className="text-gray-600 mb-6">
                    You've not viewed any articles recently. viewed articles will appear here for quick access,
                    view an article to get started.
                </p>
            </div>
        </div>
    );
}
/**
 *
 */
export const Component = function RecentArticlesPage() {

    const { paginatedHistory } = useArticlesHistory();
    const [viewMode, changeViewMode] = useState<"grid" | "list">("grid");

    const toggleViewMode = () => {
        changeViewMode(viewMode === "grid" ? "list" : "grid");
    }

    return <article className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Recent Articles { }</h1>
        <ViewModeButton toggleViewMode={toggleViewMode} viewMode={viewMode} />
        {paginatedHistory().length === 0 ? (
            <article>
                <div className="flex justify-center items-center h-full">
                    <EmptyHistory />
                </div>
                <Articles />
            </article>
        ) :
            viewMode === 'grid' ?
                <ArticleGridView articles={paginatedHistory()} /> :
                <ArticleListView articles={paginatedHistory()} />
        }
    </article>;
}
