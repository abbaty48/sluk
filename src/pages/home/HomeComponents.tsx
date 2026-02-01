import { Filter, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useViewMode } from "@/hooks/useViewMode";
import { useFilterState } from "@/hooks/useFilterState";
import { ViewModeButton } from "@/components/ViewModeButton";


export function HomeViewModeButton() {
    const { viewMode, changeViewMode } = useViewMode();

    const toggleViewMode = () => {
        changeViewMode(viewMode === "grid" ? "list" : "grid");
    }

    return (
        <ViewModeButton viewMode={viewMode} toggleViewMode={toggleViewMode} />
    );
}

export function FilterButton() {
    const { showFilter, changeShowFilter } = useFilterState();
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() => changeShowFilter(!showFilter)}
            title={showFilter ? "Close Filters" : "Open Filters"}
            aria-label={showFilter ? "Close filters" : "Open filters"}
            className="flex items-center gap-2 h-10 px-3 lg:px-4 rounded-full"
        >
            {showFilter ? (
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
    );
}
