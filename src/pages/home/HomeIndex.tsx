import { HomeBookMark } from "@/components/HeaderBookmark";
import { SearchFilter } from "@/pages/home/SearchFilter";
import { Library, Filter, FilterX } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useState } from "react";

export function Home() {
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen lg:gap-10">
            {/* Filters section - full width on mobile, sidebar on desktop */}
            {isFilterOpen && (
                <div className="w-full order-2 md:order-0 lg:w-80 lg:shrink-0 lg:border-r lg:border-r-sidebar-border">
                    <SearchFilter onClose={() => setIsFilterOpen(false)} />
                </div>
            )}

            {/* Mobile-first: Header at top */}
            <header className="w-full lg:flex-1 lg:mx-4 lg:my-8 lg:max-h-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-10 p-4 lg:p-0">
                <Link to={"/"} className="shrink-0">
                    <h1 className="flex items-center text-slate-700 text-xl sm:text-2xl lg:text-3xl gap-1">
                        <Library color="orange" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                        <span>Sluk</span>
                    </h1>
                    <p className="hidden sm:inline-block text-xs text-slate-500 mt-1">
                        Sule lamido university library.
                    </p>
                </Link>

                {/* Mobile: Stack search and controls vertically */}
                <div className="flex flex-col lg:flex-1 sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <SearchBar className="w-full sm:w-auto sm:flex-1 lg:w-3/4 xl:w-1/2" />
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 h-10 px-3 lg:px-4"
                            title={isFilterOpen ? "Close Filters" : "Open Filters"}
                            aria-label={isFilterOpen ? "Close filters" : "Open filters"}
                        >
                            {isFilterOpen ? (
                                <>
                                    <FilterX className="h-4 w-4" />
                                    <span className="hidden sm:inline">Close</span>
                                </>
                            ) : (
                                <>
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                </>
                            )}
                        </Button>
                        <HomeBookMark />
                    </div>
                </div>
            </header>
        </div>
    )
}
