import { Library, Filter, FilterX, Grid3X3, List } from "lucide-react";
import { HomeProvider } from "@/states/providers/homeProvider";
import { HomeBookMark } from "@/components/HeaderBookmark";
import { SearchFilter } from "@/pages/home/SearchFilter";
import { Articles } from "@/pages/home/Articles/Articles";
import { useFilterState } from "@/hooks/useFilterState";
import { SearchBar } from "@/components/SearchBar";
import { useViewMode } from "@/hooks/useViewMode";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function ViewModeButton() {
    const { viewMode, setViewMode } = useViewMode()
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="hidden md:flex items-center gap-2 h-10 px-3 lg:px-4 rounded-full"
            title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
        >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            <span className="hidden sm:inline">{viewMode === 'grid' ? 'List' : 'Grid'}</span>
        </Button>
    )
}

function FilterButton() {
    const { isFilterOpen, setIsFilterOpen } = useFilterState()
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFilterOpen(() => !isFilterOpen)}
            className="flex items-center gap-2 h-10 px-3 lg:px-4 rounded-full"
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
    )
}

function HomeHeader() {
    return (
        <header className="sticky top-0 bg-background z-10 md:col-start-2 md:col-end-2 lg:flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-10 p-4">
            <Link to={"/"} className="shrink-0">
                <h1 className="flex items-center text-slate-700 dark:text-slate-300 text-xl sm:text-2xl lg:text-3xl gap-1">
                    <Library color="orange" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <span>Sluk</span>
                </h1>
                <p className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Sule lamido university library.
                </p>
            </Link>

            {/* Mobile: Stack search and controls vertically */}
            <div className="flex flex-col lg:flex-1 sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <SearchBar className="w-full sm:flex-1 lg:w-3/4 xl:w-1/2 min-w-0" />
                <div className="flex items-center md:justify-between sm:justify-end gap-2">
                    <ViewModeButton />
                    <FilterButton />
                    <HomeBookMark />
                </div>
            </div>
        </header>
    )
}

export function Home() {
    return (
        <HomeProvider>
            <div className="grid md:grid-cols-[max-content]">
                <HomeHeader />
                <SearchFilter />
                <Articles />
            </div>
        </HomeProvider>
    )
}
