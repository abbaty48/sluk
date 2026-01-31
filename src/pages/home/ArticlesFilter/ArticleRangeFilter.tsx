import { Slider } from "@/components/ui/slider";
import { ArticleContext } from "./ArticleContext";
import { use } from "react";

type Props = {
  end: number;
  start: number;
  value?: number[];
  caption?: string;
};
export function ArticleRangeFilter({ end, start, caption }: Props) {
  const { year, handleYearChange } = use(ArticleContext);
  return (
    <fieldset className="space-y-2">
      <legend className="text-left">{caption}</legend>
      <Slider
        value={year}
        min={start}
        max={end}
        step={1}
        className="w-full"
        onValueChange={handleYearChange}
      />
      <p className="flex justify-between text-xs text-muted-foreground mt-1.5">
        <span>{year[0]}</span>
        <span>{year[1]}</span>
      </p>
    </fieldset>
  );
}
