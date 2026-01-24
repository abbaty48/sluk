import { use } from "react";
import { HomeContext } from "@/states/providers/homeProvider";

export function useViewMode() {
    const { viewMode, setViewMode } = use(HomeContext);
    return { viewMode, setViewMode }
}
