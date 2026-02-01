import type { TEnrichedArticle } from "@/lib/types/TArticle";
import { LucideVideo } from "lucide-react";
import { Link } from "react-router";


export function Article(props: TEnrichedArticle) {
  const item = props;

  return (
    <Link key={item.id} to={`/article/${item.id}`} className="block h-fit">
      <article className="relative bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex flex-col ">
        {item.hasVideo && (
          <div className="absolute -top-1 -right-1 rounded-4xl p-2 bg-background/85">
            <LucideVideo strokeWidth={0.6} />
          </div>
        )}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-3/12 max-h-80 object-cover rounded-tr-md rounded-tl-md mb-3"
          />
        )}
        <section className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {item.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {item.abstract}
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            {item.itemTypeName && <p>{item.itemTypeName}</p>}
            {item.collectionName && <p>{item.collectionName}</p>}
            {item.communityName && <p>{item.communityName}</p>}
            {item.fileType && <p>{item.fileType}</p>}
            <p>Submitter: {item.submitter || "Unknown"}</p>
            <p>
              Status: {item.status} | Created:{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>
            <p>Views: {item.views} | Downloads: {item.downloads}</p>
            {item.pages && <div>Pages: {item.pages}</div>}
            {item.publisher && <div>Publisher: {item.publisher}</div>}
            {item.hasVideo && <div>Has Video: Yes</div>}
          </div>
        </section>
      </article>
    </Link>
  );
}
