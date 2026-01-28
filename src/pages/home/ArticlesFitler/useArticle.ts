import { use } from "react";
import { ArticleContext } from "./ArticleContext";

export const useArticle = () => {
  return use(ArticleContext);
};
