export type TArticle = {
    id: string;
    title: string;
    status: string;
    abstract: string;
    item_type_id: number;
    collection_id: number;
    submitter_id: string;
    embargo_until: string | null;
    created_at: string;
    updated_at: string;
    views: number;
    downloads: number;
    pages?: number;
    publisher?: string;
    thumbnail?: string;
    hasVideo?: boolean;
};

export type TEnrichedArticle = TArticle & {
    fileType: string;
    submitter: string;
    imageUrl: string | null;
    itemTypeName: string;
    collectionName: string;
    communityName: string;
};
