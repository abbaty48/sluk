import { use } from "react";
import { HomeContext } from "@/states/providers/homeProvider";

export function useViewMode() {
  const { viewMode, changeViewMode } = use(HomeContext);
  return { viewMode, changeViewMode };
}
