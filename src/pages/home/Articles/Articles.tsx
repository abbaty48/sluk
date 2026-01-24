import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ArticleSuspense } from "./ArticlesSuspense";
import { ArticlesContent } from "./ArticlesContent";
import { Suspense } from "react";

export function Articles() {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    fallback={
                        <div className="text-center text-destructive p-4">
                            <h2>Failed to load articles.</h2>
                            <button onClick={() => { reset(); }} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded">
                                Retry </button>
                        </div>
                    }
                >
                    <Suspense fallback={<ArticleSuspense />}>
                        <ArticlesContent />
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    )
}
