import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { ArticleContext } from "./ArticleContext";
import { use, useId, type ReactElement } from "react";

type ArticleSelectOptionProp = {
  value: string;
  label: string;
};

export function ArticleSelectOptionFilter({
  value,
  label,
}: ArticleSelectOptionProp) {
  return <SelectItem value={value}>{label}</SelectItem>;
}

type Props = {
  value: string;
  label: string;
  placeholder: string;
  onValueChange?: (value: string) => void;
  children: ReactElement<
    ArticleSelectOptionProp,
    typeof ArticleSelectOptionFilter
  >[];
};

export function ArticleSelectFilter(props: Props) {
  const { label, children, placeholder } = props;
  const { language, handleLanguageChange } = use(ArticleContext);
  const id = useId();
  return (
    <fieldset className="space-y-2">
      <legend className="text-left">{label}</legend>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children.map((option) => (
            <ArticleSelectOptionFilter
              key={`${option.props.value}-${id}`}
              {...option.props}
            />
          ))}
        </SelectContent>
      </Select>
    </fieldset>
  );
}
