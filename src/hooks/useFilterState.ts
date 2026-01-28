import { use } from "react";
import { HomeContext } from "@/states/providers/homeContext";

export function useFilterState() {
  const { changeShowFilter, toggleShowFilter, showFilter } = use(HomeContext);
  return { showFilter, changeShowFilter, toggleShowFilter };
}
