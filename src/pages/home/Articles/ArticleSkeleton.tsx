export function ArticleSkeleton() {
    return (
        <article className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="w-full h-32 bg-muted rounded-md mb-3"></div>
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-1"></div>
            <div className="h-4 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded"></div>
        </article>
    );
}
