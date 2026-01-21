import { Bookmark } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";

export function HomeBookMark() {
    return (
        <Link to={'/bookmarks'} className="flex items-center justify-center hover:bg-sidebar-ring/20 hover:rounded-full max-w-20 max-h-20" aria-label="Checkout your bookmarks" title="Bookmarks">
            <Badge variant={'secondary'} className="relative p-6 bg-transparent">
                <span className="absolute top-4 right-4 block w-3.5 h-3.5 text-center bg-red-600 rounded-full text-xs z-10">2</span>
                <Bookmark data-icon="inline-end" className="relative" />
            </Badge>
        </Link>
    )
}
