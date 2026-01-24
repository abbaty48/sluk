import { Article } from "./Article"
import { useViewMode } from "@/hooks/useViewMode"
import type { TEnrichedArticle } from "@/lib/types/TArticle"
import Masonry from 'react-masonry-css'

type Props = {
    articles?: TEnrichedArticle[]
}
export function ArticlesRenderer({ articles }: Props) {
    const { viewMode } = useViewMode()

    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        768: 2,
        500: 1
    };

    return viewMode === 'grid' ? (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
        >
            {articles?.map((article) => (
                <Article key={article.id} item={article} />
            ))}
        </Masonry>
    ) : (
        <div className="flex flex-col gap-4">
            {articles?.map((article) => (
                <Article key={article.id} item={article} />
            ))}
        </div>
    )
}
