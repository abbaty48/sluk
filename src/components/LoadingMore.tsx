import { Loader2 } from "lucide-react";

export function LoadingMore({ isFetchingNextPage, hasNextPage }: { isFetchingNextPage: boolean; hasNextPage: boolean }) {
    return hasNextPage ? (
        <div className="flex items-center justify-center py-4 space-x-2">
            {isFetchingNextPage && (
                <>
                    <Loader2 className="animate-spin" size={16} />
                    <div className="text-muted-foreground animate-pulse">Loading more...</div>
                </>
            )}
        </div>
    ) : null;
}
