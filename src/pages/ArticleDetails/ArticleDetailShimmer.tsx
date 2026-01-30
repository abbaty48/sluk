export function ArticleDetailShimmer() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-40 bg-muted rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image Shimmer */}
          <div className="relative w-full h-64 md:h-96 bg-muted rounded-xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-lr from-muted via-muted/50 to-muted animate-shimmer"></div>
          </div>

          {/* Title Shimmer */}
          <div className="space-y-4 mb-8">
            <div className="h-12 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Shimmer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 border">
                <div className="h-8 bg-muted rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-li from-muted via-muted/50 to-muted animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Shimmer */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border">
                <div className="h-6 bg-muted rounded w-24 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-12 bg-muted rounded w-full mt-6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
