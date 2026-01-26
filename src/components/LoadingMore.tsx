import { Loader2 } from "lucide-react";

export function LoadingMore({ isFetchingNextPage, hasNextPage }: { isFetchingNextPage: boolean; hasNextPage: boolean }) {
    if (!hasNextPage) return null;

    return (
        <div className="flex items-center justify-center py-4 space-x-2 min-h-12.5">
            {isFetchingNextPage && (
                <>
                    <Loader2 className="animate-spin" size={32} />
                    <div className="text-muted-foreground animate-pulse">Loading more...</div>
                </>
            )}
        </div>
    );
}
