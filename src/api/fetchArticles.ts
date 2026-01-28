import type {
  SortOption,
  ArticleFilters,
  ArticleSearchParams,
} from "@/lib/types/IArticle";
import db from "@/api/db.json";
import { defaultArticleFilters } from "@/lib/types/IArticle";
import type { TArticle, TEnrichedArticle } from "@/lib/types/TArticle";

export function searchArticles(term: string, sortBy: SortOption = "relevance") {
  const filtered = (db.items as TArticle[]).filter(
    (article) =>
      article.title.toLowerCase().includes(term.toLowerCase()) ||
      article.abstract.toLowerCase().includes(term.toLowerCase()),
  );
  return sortArticles(filtered, sortBy, term);
}

function sortArticles(
  articles: TArticle[],
  sortBy: SortOption,
  searchTerm?: string,
): TArticle[] {
  const sorted = [...articles];

  switch (sortBy) {
    case "relevance":
      if (searchTerm) {
        // Sort by relevance: title matches first, then abstract matches
        return sorted.sort((a, b) => {
          const aTitleMatch = a.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const bTitleMatch = b.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const aAbstractMatch = a.abstract
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const bAbstractMatch = b.abstract
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          // Title matches get higher priority
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;

          // If both have title matches or neither, sort by position in title
          if (aTitleMatch && bTitleMatch) {
            const aIndex = a.title
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase());
            const bIndex = b.title
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase());
            return aIndex - bIndex;
          }

          // Abstract matches after title matches
          if (aAbstractMatch && !bAbstractMatch) return -1;
          if (!aAbstractMatch && bAbstractMatch) return 1;

          // If both have abstract matches, sort by position in abstract
          if (aAbstractMatch && bAbstractMatch) {
            const aIndex = a.abstract
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase());
            const bIndex = b.abstract
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase());
            return aIndex - bIndex;
          }

          return 0;
        });
      }
      // If no search term, fall back to date-desc
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    case "date-desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    case "date-asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    case "author-asc":
      return sorted.sort((a, b) => {
        const aAuthor =
          db.users.find((user) => user.id === a.submitter_id)?.full_name || "";
        const bAuthor =
          db.users.find((user) => user.id === b.submitter_id)?.full_name || "";
        return aAuthor.localeCompare(bAuthor);
      });

    case "author-desc":
      return sorted.sort((a, b) => {
        const aAuthor =
          db.users.find((user) => user.id === a.submitter_id)?.full_name || "";
        const bAuthor =
          db.users.find((user) => user.id === b.submitter_id)?.full_name || "";
        return bAuthor.localeCompare(aAuthor);
      });

    default:
      return sorted;
  }
}

export function applyArticleFilters(
  articles: TArticle[],
  filter: ArticleFilters,
) {
  const articleTypes = db.item_types;
  const files = db.files;
  const users = db.users;

  let filtered = articles;

  if (filter.category && filter.category !== "all") {
    const type = articleTypes.find(
      (item) =>
        item.name.toLowerCase() === (filter.category as string).toLowerCase(),
    );
    if (type) {
      filtered = filtered.filter((article) => article.item_type_id === type.id);
    }
  }

  if (filter.fileType && filter.fileType !== "all") {
    filtered = filtered.filter((article) => {
      const articleFiles = files.filter((file) => file.item_id === article.id);
      return articleFiles.some((file) =>
        file.mime_type.toLowerCase().includes(filter.fileType.toLowerCase()),
      );
    });
  }

  if (filter.author && filter.author.trim() !== "") {
    filtered = filtered.filter((article) => {
      const user = users.find((u) => u.id === article.submitter_id);
      return (
        user &&
        user.full_name.toLowerCase().includes(filter.author.toLowerCase())
      );
    });
  }

  if (filter.year && filter.year.length === 2) {
    const [minYear, maxYear] = filter.year;
    filtered = filtered.filter((article) => {
      const articleYear = new Date(article.created_at).getFullYear();
      return articleYear >= minYear && articleYear <= maxYear;
    });
  }

  if (filter.language && filter.language !== "all") {
    // Language filter implementation - this would need a language field in the database
    // For now, we'll skip this filter as the database doesn't have language information
    // You can add this once the database schema supports it
  }

  return filtered;
}

export function getArticles<
  Params extends ArticleSearchParams & { page: number },
>({
  page,
  term = "",
  limit = 10,
  sortBy = "relevance",
  filter = defaultArticleFilters,
}: Params): Promise<{
  page: number;
  limit: number;
  hasMore: boolean;
  articles: TEnrichedArticle[];
  total: number;
}> {
  const allArticles = db.items as TArticle[];

  let filteredArticles = allArticles;

  if (term) {
    filteredArticles = searchArticles(term, sortBy);
  }

  if (filter) {
    filteredArticles = applyArticleFilters(filteredArticles, filter);
  }

  // Apply sorting
  filteredArticles = sortArticles(filteredArticles, sortBy, term);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredArticles.length;

  const enrichedArticles: TEnrichedArticle[] = paginatedArticles.map(
    (article) => {
      const files = db.files.filter((file) => file.item_id === article.id);
      const fileType = files.length > 0 ? files[0].mime_type : "";
      const submitter =
        db.users.find((user) => user.id === article.submitter_id)?.full_name ||
        "";
      const imageFile = files.find((file) =>
        file.mime_type.startsWith("image/"),
      );
      const imageUrl = imageFile
        ? imageFile.file_path
        : article.thumbnail || null;
      const itemType = db.item_types.find(
        (type) => type.id === article.item_type_id,
      );
      const itemTypeName = itemType ? itemType.name : "";
      const collection = db.collections.find(
        (col) => col.id === article.collection_id,
      );
      const collectionName = collection ? collection.name : "";
      const community = db.communities.find(
        (com) => com.id === collection?.community_id,
      );
      const communityName = community ? community.name : "";

      return {
        ...article,
        fileType,
        submitter,
        imageUrl,
        itemTypeName,
        collectionName,
        communityName,
      };
    },
  );

  const result = {
    page,
    limit,
    hasMore,
    articles: enrichedArticles,
    total: filteredArticles.length,
  };

  return new Promise((resolve) => setTimeout(() => resolve(result), 3000));
}

export function getArticleById(id: string): TArticle | undefined {
  const allArticles = db.items as TArticle[];
  return allArticles.find((article) => article.id === id);
}

export function getArticleFiles(articleId: string) {
  return db.files.filter((file) => file.item_id === articleId);
}

export function getArticleAuthor(articleId: string) {
  const article = getArticleById(articleId);
  if (!article) return null;
  return db.users.find((user) => user.id === article.submitter_id);
}

export function getCategories() {
  return db.item_types.map((type) => type.name);
}

export function getAuthors() {
  return db.users.map((user) => user.full_name);
}

export function getYears() {
  const allArticles = db.items as TArticle[];
  const years = allArticles.map((article) =>
    new Date(article.created_at).getFullYear(),
  );
  return [...new Set(years)].sort((a, b) => b - a);
}
