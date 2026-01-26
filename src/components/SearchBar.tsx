import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { Button } from "@/components/ui/button";
import { Search, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string, sortBy: string) => void;
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
  placeholder = "Search for Theses, Dissertation, Journal Article, and more...",
}: SearchBarProps) {
  const {
    searchQuery,
    changeQuery,
    changeSearchSortBy: _changeSearchSortBy,
    changeSearching: _changeSearching,
  } = useSearchQuery();
  const [searchInput, setSearchInput] = useState<string>("")

  const handleSubmit = (formData: FormData) => {
    const term = formData.get("term")?.toString();
    if (term) {
      changeQuery({
        term,
        searching: true,
        sortBy: formData.get("sortBy")?.toString() || "relevance",
      });
      setSearchInput('')
    }
  };

  const handleSortChange = (value: string) => {
    changeQuery({
      term: searchQuery.term,
      sortBy: value,
    });
  };

  return (
    <form
      role="search"
      action={handleSubmit}
      className={cn(
        "flex-1 flex items-center elevation-1 rounded-full bg-input p-2 sm:p-3 gap-1 sm:gap-2",
        className,
      )}
    >
      <div className="flex items-center flex-1 px-2 sm:px-3">
        <Search
          aria-hidden
          className="w-4 h-4 text-muted-foreground mr-2 shrink-0"
        />
        <Input
          type="search"
          name="term"
          value={searchInput}
          placeholder={placeholder}
          aria-label="Search input"
          disabled={searchQuery.searching}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border-0 shadow-none focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 py-2 h-auto text-sm sm:text-base"
        />
      </div>

      <div className="flex items-center gap-1">
        <Select name="sortBy" onValueChange={handleSortChange}>
          <SelectTrigger className="w-auto border-0 shadow-none focus:ring-0 bg-transparent px-2 py-1 sm:py-2 h-auto text-xs sm:text-sm">
            <SortAsc className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs sm:text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="submit"
          size="sm"
          disabled={searchQuery.searching || !searchInput}
          className="disabled:group-user-invalid rounded-[calc(var(--radius)-4px)] px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:hidden" />
        </Button>
      </div>
    </form>
  );
}
