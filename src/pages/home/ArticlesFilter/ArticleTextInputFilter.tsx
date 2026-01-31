import { ArticleContext } from "./ArticleContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use } from "react";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};
export function ArticleTextInputFilter(props: Props) {
  const { author, handleAuthorChange } = use(ArticleContext);
  return (
    <Label>
      {props.label}
      <Input
        {...props}
        value={author}
        className="rounded-full"
        onChange={(e) => handleAuthorChange(e.target.value)}
      />
    </Label>
  );
}
