import { getArticleById, getArticleFiles } from "@/api/fetchArticles";
import type { TArticle } from "@/lib/types/TArticle";
import { useQuery } from "@tanstack/react-query";

export function useArticleSummary(id: string | undefined) {
  // Fetch article data
  const { data: article, isLoading: isLoadingArticle } = useQuery<TArticle>({
    queryKey: ["article", id],
    queryFn: () => {
      if (!id) throw new Error("Article ID is required");
      const article = getArticleById(id);
      if (!article) throw new Error("Article not found");
      return article;
    },
    enabled: !!id,
  });

  // Fetch article files
  const { data: files } = useQuery({
    queryKey: ["article-files", id],
    queryFn: () => {
      if (!id) return [];
      return getArticleFiles(id);
    },
    enabled: !!id,
  });

  // Get file information
  const pdfFile = files?.find((f) => f.mime_type.toLowerCase().includes("pdf"));
  const docFile = files?.find(
    (f) =>
      f.mime_type.toLowerCase().includes("doc") ||
      f.mime_type.toLowerCase().includes("word"),
  );
  const videoFile = files?.find((f) =>
    f.mime_type.toLowerCase().includes("video"),
  );
  const imageFile = files?.find((f) =>
    f.mime_type.toLowerCase().includes("image"),
  );

  return {
    article,
    files,
    pdfFile,
    docFile,
    videoFile,
    imageFile,
    isLoadingArticle,
  };
}
