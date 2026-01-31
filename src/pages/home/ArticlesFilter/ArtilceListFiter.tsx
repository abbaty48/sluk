import { useId, type ReactElement, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { useArticle } from "./useArticle";

type ListProps = {
  name: string;
  icon?: ReactNode;
  value: string | number | readonly string[] | undefined;
};
export function ArticleList({ name, icon, value }: ListProps) {
  const { handleCategoryChange, category } = useArticle();
  return (
    <Badge
      key={name}
      defaultValue={value}
      onClick={() => handleCategoryChange(value)}
      variant={category === value ? "default" : "secondary"}
      className="cursor-pointer hover:bg-primary/80"
    >
      {icon}
      {name}
    </Badge>
  );
}

type Props = {
  children: ReactElement<ListProps, typeof ArticleList>[];
  name?: string;
  caption?: string;
};
export function ArticleListFilter({ children, name, caption }: Props) {
  const id = useId();
  return (
    <fieldset name={name} className="space-y-2" aria-label="">
      <legend>{caption}</legend>
      <ul className="flex flex-wrap gap-2">
        {children.map((list) => (
          <ArticleList key={`${list.props.value}_${id}`} {...list.props} />
        ))}
      </ul>
    </fieldset>
  );
}
