import { ArticleSkeleton } from "./ArticleSkeleton";

export function ArticleSuspense() {
    return (
        <article className="p-4 lg:p-8 md:col-start-2">
            <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] grid-flow-dense">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleSkeleton key={i} />
                ))}
            </div>
        </article>
    )
}
