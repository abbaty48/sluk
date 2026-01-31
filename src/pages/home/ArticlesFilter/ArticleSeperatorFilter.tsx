import type { SeparatorProps } from "@radix-ui/react-separator";
import { Separator } from "@/components/ui/separator";
import type { RefAttributes } from "react";

export function ArticleSeperatorFilter(
  props: SeparatorProps & RefAttributes<HTMLDivElement>,
) {
  return <Separator {...props} />;
}
