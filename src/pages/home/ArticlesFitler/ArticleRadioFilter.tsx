import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { use, useId, type ReactElement, type ReactNode } from "react";
import { ArticleContext } from "./ArticleContext";
import { Label } from "@/components/ui/label";

type RadioOptionProps = {
  value: string;
  label: string;
  icon?: ReactNode;
  selected?: boolean;
};

export function ArticleRadioOption({
  value,
  label,
  icon,
  selected,
}: RadioOptionProps) {
  return (
    <>
      <Label className="flex items-center space-x-2 text-sm cursor-pointer">
        {icon}
        <RadioGroupItem value={value} checked={selected} />
        {label}
      </Label>
    </>
  );
}

type Props = {
  children: ReactElement<RadioOptionProps, typeof ArticleRadioOption>[];
  onSelected?: ((value: string) => void) | undefined;
  value: string | null | undefined;
  caption: string;
  name: string;
};
export function ArticleRadioFilter({ name, caption, children }: Props) {
  const { fileType, handleFileTypeChange } = use(ArticleContext);
  const id = useId();
  return (
    <fieldset className="space-y-2">
      <legend>{caption}</legend>
      <RadioGroup
        name={name}
        value={fileType}
        onValueChange={handleFileTypeChange}
      >
        {children.map(({ props }) => (
          <ArticleRadioOption
            key={`${props.value}-${id}`}
            {...props}
            selected={fileType === props.value}
          />
        ))}
      </RadioGroup>
    </fieldset>
  );
}
