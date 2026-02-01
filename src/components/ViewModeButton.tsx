import { Grid3X3, List } from "lucide-react";
import { Button } from "./ui/button";

export function ViewModeButton({ toggleViewMode, viewMode }: { toggleViewMode: () => void; viewMode: "grid" | "list" }) {
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={toggleViewMode}
            className="hidden md:flex items-center gap-2 h-10 px-3 lg:px-4 rounded-full"
            title={
                viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"
            }
        >
            {viewMode === "grid" ? (
                <List className="h-4 w-4" />
            ) : (
                <Grid3X3 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
                {viewMode === "grid" ? "List" : "Grid"}
            </span>
        </Button>
    );
}
