import type { ArticleFilters } from '@/lib/types/IArticle';
import type { TArticle, TEnrichedArticle } from '@/lib/types/TArticle';
import db from '@/api/db.json'


export function searchArticles(term: string) {
    return (db.items as TArticle[]).filter(article => article.title.toLowerCase().includes(term.toLowerCase()) || article.abstract.toLowerCase().includes(term.toLowerCase()))
}

export function applyArticleFilters(articles: TArticle[], filter: ArticleFilters) {
    const articleTypes = db.item_types;
    const files = db.files;
    const users = db.users;

    let filtered = articles;

    if (filter.category) {
        const type = articleTypes.find(item => item.name.toLowerCase() === filter.category.toLowerCase());
        if (type) {
            filtered = filtered.filter(article => article.item_type_id === type.id);
        }
    }

    if (filter.fileType) {
        filtered = filtered.filter(article => {
            const articleFiles = files.filter(file => file.item_id === article.id);
            return articleFiles.some(file => file.mime_type.toLowerCase().includes(filter.fileType.toLowerCase()));
        });
    }

    if (filter.author) {
        filtered = filtered.filter(article => {
            const user = users.find(u => u.id === article.submitter_id);
            return user && user.full_name.toLowerCase().includes(filter.author.toLowerCase());
        });
    }

    if (filter.year && filter.year.length > 0) {
        filtered = filtered.filter(article => {
            const articleYear = new Date(article.created_at).getFullYear();
            return filter.year.includes(articleYear);
        });
    }

    // Language filter - assuming language is not in db, skip or add if needed

    return filtered;
}

export function getArticles(term?: string, filter?: ArticleFilters, page: number = 1, limit: number = 10) {
    const allArticles = db.items as TArticle[];

    let filteredArticles = allArticles;

    if (term) {
        filteredArticles = searchArticles(term);
    }

    if (filter) {
        filteredArticles = applyArticleFilters(filteredArticles, filter);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredArticles.length;

    const enrichedArticles: TEnrichedArticle[] = paginatedArticles.map(article => {
        const files = db.files.filter(file => file.item_id === article.id);
        const fileType = files.length > 0 ? files[0].mime_type : '';
        const submitter = db.users.find(user => user.id === article.submitter_id)?.full_name || '';
        const imageFile = files.find(file => file.mime_type.startsWith('image/'));
        const imageUrl = imageFile ? imageFile.file_path : (article.thumbnail || null);
        const itemType = db.item_types.find(type => type.id === article.item_type_id);
        const itemTypeName = itemType ? itemType.name : '';
        const collection = db.collections.find(col => col.id === article.collection_id);
        const collectionName = collection ? collection.name : '';
        const community = db.communities.find(com => com.id === collection?.community_id);
        const communityName = community ? community.name : '';

        return {
            ...article,
            fileType,
            submitter,
            imageUrl,
            itemTypeName,
            collectionName,
            communityName
        };
    });

    const result = {
        articles: enrichedArticles,
        hasMore,
        total: filteredArticles.length,
        page,
        limit
    };

    // Simulate delay
    return new Promise(resolve => setTimeout(() => resolve(result), 1000));
}

export function getArticleById(id: string): TArticle | undefined {
    const allArticles = db.items as TArticle[];
    return allArticles.find(article => article.id === id);
}

export function getArticleFiles(articleId: string) {
    return db.files.filter(file => file.item_id === articleId);
}

export function getArticleAuthor(articleId: string) {
    const article = getArticleById(articleId);
    if (!article) return null;
    return db.users.find(user => user.id === article.submitter_id);
}

export function getCategories() {
    return db.item_types.map(type => type.name);
}

export function getAuthors() {
    return db.users.map(user => user.full_name);
}

export function getYears() {
    const allArticles = db.items as TArticle[];
    const years = allArticles.map(article => new Date(article.created_at).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
}
