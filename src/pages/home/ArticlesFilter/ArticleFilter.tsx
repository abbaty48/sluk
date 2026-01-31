import { ArticleRadioFilter, ArticleRadioOption } from "./ArticleRadioFilter";
import { ArticleListFilter, ArticleList } from "./ArtilceListFiter";
import { ArticleSeperatorFilter } from "./ArticleSeperatorFilter";
import { ArticleTextInputFilter } from "./ArticleTextInputFilter";
import { ArticleRangeFilter } from "./ArticleRangeFilter";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import {
  ArticleSelectFilter,
  ArticleSelectOptionFilter,
} from "./ArticleSelectFilter";

export type Props = {
  children: ReactNode;
  onShowFilter: () => void;
  onResetFilter: () => void;
};

export function ArticleFilter({
  children,
  onShowFilter,
  onResetFilter,
}: Props) {
  return (
    <div className="w-full md:row-start-1 md:row-span-2 lg:w-80 lg:shrink-0 lg:border-r lg:border-r-sidebar-border sticky top-0">
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] lg:max-h-full overflow-auto sticky top-0">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-lg sm:text-xl font-semibold">Filters</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onShowFilter}
            aria-label="Close filters"
            className="h-8 w-8 p-0 rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
        <Button
          variant="outline"
          className="flex-1 rounded-full hover:text-primary"
          onClick={onResetFilter}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
}

ArticleFilter.List = ArticleList;
ArticleFilter.ListFilter = ArticleListFilter;
ArticleFilter.RangeFilter = ArticleRangeFilter;
ArticleFilter.RadioFilter = ArticleRadioFilter;
ArticleFilter.RadioOption = ArticleRadioOption;
ArticleFilter.Select = ArticleSelectFilter;
ArticleFilter.Option = ArticleSelectOptionFilter;
ArticleFilter.TextInput = ArticleTextInputFilter;
ArticleFilter.Seperator = ArticleSeperatorFilter;
