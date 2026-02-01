import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { Article } from "@/pages/home/Articles/Article";
import Masonry from "react-masonry-css";

export function ArticleGridView({ articles }: { articles: TEnrichedArticle[] | undefined }) {
    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        768: 2,
        500: 1,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
        >
            {articles?.map((article) => (
                <Article key={article.id} {...article} />
            ))}
        </Masonry>
    );
}

export function ArticleListView({ articles }: { articles: TEnrichedArticle[] | undefined }) {
    return (
        <div className="flex flex-col gap-4">
            {articles?.map((article) => (
                <Article key={article.id} {...article} />
            ))}
        </div>
    );
}
