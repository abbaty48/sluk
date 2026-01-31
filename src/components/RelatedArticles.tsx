// RelatedArticles Component - Shows related articles with accessibility
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { BookOpen, Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  abstract: string;
  item_type_id: number;
  collection_id: number;
  views: number;
  thumbnail?: string;
  created_at: string;
}

interface RelatedArticlesProps {
  currentArticleId: string;
  collectionId: number;
  itemTypeId: number;
  maxItems?: number;
  className?: string;
}

export function RelatedArticles({
  currentArticleId,
  collectionId,
  itemTypeId,
  maxItems = 6,
  className = '',
}: RelatedArticlesProps) {
  const { t } = useTranslation();

  // Fetch related articles based on collection and item type
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['related-articles', currentArticleId, collectionId, itemTypeId],
    queryFn: async () => {
      // Fetch articles from the same collection or type
      const response = await fetch(
        `http://localhost:3000/items?collection_id=${collectionId}&_limit=${maxItems + 5}`
      );
      const items = await response.json();

      // Filter out current article and prioritize same item type
      const filtered = items
        .filter((item: Article) => item.id !== currentArticleId)
        .sort((a: Article, b: Article) => {
          // Prioritize same item type
          if (a.item_type_id === itemTypeId && b.item_type_id !== itemTypeId) return -1;
          if (a.item_type_id !== itemTypeId && b.item_type_id === itemTypeId) return 1;
          // Then sort by views
          return b.views - a.views;
        })
        .slice(0, maxItems);

      return filtered;
    },
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return t('relatedArticles.today', 'Today');
    } else if (diffInDays === 1) {
      return t('relatedArticles.yesterday', 'Yesterday');
    } else if (diffInDays < 7) {
      return t('relatedArticles.daysAgo', { days: diffInDays, defaultValue: '{{days}} days ago' });
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return t('relatedArticles.weeksAgo', { weeks, defaultValue: '{{weeks}} weeks ago' });
    } else {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <section
        className={`related-articles ${className}`}
        aria-labelledby="related-articles-heading"
        aria-busy="true"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" aria-hidden="true" />
          <h2
            id="related-articles-heading"
            className="text-xl md:text-2xl font-semibold text-foreground"
          >
            {t('relatedArticles.title', 'Related Articles')}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse border border-border rounded-lg p-4 bg-card"
              aria-label={t('relatedArticles.loading', 'Loading related article')}
            >
              <div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-5/6 mb-4" />
              <div className="flex gap-2">
                <div className="h-3 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <section
        className={`related-articles ${className}`}
        aria-labelledby="related-articles-heading"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2
            id="related-articles-heading"
            className="text-xl md:text-2xl font-semibold text-foreground"
          >
            {t('relatedArticles.title', 'Related Articles')}
          </h2>
        </div>
        <div
          className="text-center py-8 text-muted-foreground"
          role="status"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
          <p>{t('relatedArticles.noResults', 'No related articles found.')}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`related-articles ${className}`}
      aria-labelledby="related-articles-heading"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2
          id="related-articles-heading"
          className="text-xl md:text-2xl font-semibold text-foreground"
        >
          {t('relatedArticles.title', 'Related Articles')}
        </h2>
      </div>

      {/* Articles Grid */}
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label={t('relatedArticles.list', 'List of related articles')}
      >
        {articles.map((article) => (
          <article
            key={article.id}
            className="group border border-border rounded-lg overflow-hidden bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
            role="listitem"
          >
            <Link
              to={`/article/${article.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
              aria-label={t('relatedArticles.viewArticle', {
                title: article.title,
                defaultValue: 'View article: {{title}}',
              })}
            >
              {/* Thumbnail */}
              {article.thumbnail ? (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                  <BookOpen
                    className="w-12 h-12 text-muted-foreground/30"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Abstract */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.abstract}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1" aria-label={`${article.views} views`}>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{formatViews(article.views)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <time dateTime={article.created_at}>
                      {formatDate(article.created_at)}
                    </time>
                  </span>
                </div>

                {/* Read more indicator */}
                <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t('relatedArticles.readMore', 'Read more')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Screen reader only summary */}
      <div className="sr-only" role="status" aria-live="polite">
        {t('relatedArticles.summary', {
          count: articles.length,
          defaultValue: '{{count}} related articles available',
        })}
      </div>
    </section>
  );
}

// Compact variant for sidebars
export function RelatedArticlesCompact({
  currentArticleId,
  collectionId,
  itemTypeId,
  maxItems = 3,
  className = '',
}: RelatedArticlesProps) {
  const { t } = useTranslation();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['related-articles-compact', currentArticleId, collectionId, itemTypeId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/items?collection_id=${collectionId}&_limit=${maxItems + 3}`
      );
      const items = await response.json();

      return items
        .filter((item: Article) => item.id !== currentArticleId)
        .sort((a: Article, b: Article) => b.views - a.views)
        .slice(0, maxItems);
    },
  });

  if (isLoading || !articles || articles.length === 0) {
    return null;
  }

  return (
    <aside
      className={`related-articles-compact ${className}`}
      aria-labelledby="related-articles-compact-heading"
    >
      <h3
        id="related-articles-compact-heading"
        className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        {t('relatedArticles.youMayAlsoLike', 'You May Also Like')}
      </h3>
      <nav aria-label={t('relatedArticles.navigation', 'Related articles navigation')}>
        <ul className="space-y-2">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                to={`/article/${article.id}`}
                className="block p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t('relatedArticles.viewArticle', {
                  title: article.title,
                  defaultValue: 'View article: {{title}}',
                })}
              >
                <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    <span>{article.views}</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
