import { Bookmark } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface HeaderBookmarkProps {
    count?: number;
    className?: string;
    showCount?: boolean;
}

export function HomeBookMark({
    count = 0,
    className,
    showCount = true
}: HeaderBookmarkProps) {
    return (
        <Link
            to={'/bookmarks'}
            title={`Bookmarks (${count})`}
            aria-label={`View ${count} bookmarks`}
            className={cn(
                "flex items-center justify-center hover:bg-(--state-layer-hover) hover:rounded-full max-w-20 max-h-20 transition-all duration-200 group",
                className
            )}
        >
            <Badge
                variant={'outline'}
                className="relative p-4 bg-transparent shadow-none hover:bg-transparent group-hover:scale-105 transition-transform duration-200"
            >
                {showCount && count > 0 && (
                    <span className="absolute top-2 right-3 w-4 h-4 text-center bg-destructive text-white rounded-full text-[0.5rem] font-semibold z-10 flex items-center justify-center animate-pulse">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
                <Bookmark
                    data-icon="inline-end"
                    className="relative w-6 h-6 text-primary group-hover:text-primary/80 transition-colors duration-200"
                    fill={count > 0 ? "currentColor" : "none"}
                />
            </Badge>
        </Link>
    )
}
