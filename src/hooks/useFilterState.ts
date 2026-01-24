import { use } from "react";
import { HomeContext } from "@/states/providers/homeProvider";

export function useFilterState() {
    const { isFilterOpen, setIsFilterOpen } = use(HomeContext);
    return { isFilterOpen, setIsFilterOpen };
}
