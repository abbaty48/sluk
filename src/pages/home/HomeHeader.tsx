import { Link } from "react-router";
import { Library } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { HomeBookMark } from "@/components/HeaderBookmark";
import { FilterButton, HomeViewModeButton } from "./HomeComponents";

export function HomeHeader() {

    return (
        <header className="sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 md:col-start-2 md:col-end-2 lg:flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-10 p-4 max-h-max">
            <Link to={"/"} className="shrink-0">
                <h1 className="flex items-center text-slate-700 dark:text-slate-300 text-xl sm:text-2xl lg:text-3xl gap-1">
                    <Library
                        color="orange"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                    />
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
                    <HomeViewModeButton />
                    <FilterButton />
                    <HomeBookMark />
                </div>
            </div>
        </header>
    );
}
