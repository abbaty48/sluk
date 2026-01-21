import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    className?: string;
    onSearch?: (query: string, sortBy: string) => void;
    placeholder?: string;
}

const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "title-asc", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
    { value: "author-asc", label: "Author A-Z" },
    { value: "author-desc", label: "Author Z-A" },
] as const;

export function SearchBar({
    className,
    onSearch,
    placeholder = "Search for Theses, Dissertation, Journal Article, and more..."
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("relevance");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query, sortBy);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        if (query.trim()) {
            onSearch?.(query, value);
        }
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={cn(
                "flex-1 flex items-center elevation-1 rounded-full bg-input p-2 sm:p-3 gap-1 sm:gap-2",
                className
            )}
        >
            <div className="flex items-center flex-1 px-2 sm:px-3">
                <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 py-2 h-auto text-sm sm:text-base"
                    aria-label="Search input"
                />
            </div>

            <div className="flex items-center gap-1">
                <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-auto border-0 shadow-none focus:ring-0 bg-transparent px-2 py-1 sm:py-2 h-auto text-xs sm:text-sm">
                        <SortAsc className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mr-1" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    type="submit"
                    size="sm"
                    className="rounded-[calc(var(--radius)-2px)] px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
                    disabled={!query.trim()}
                >
                    <span className="hidden sm:inline">Search</span>
                    <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:hidden" />
                </Button>
            </div>
        </form>
    );
}
