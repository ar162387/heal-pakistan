import { Layout } from "@/components/layout/Layout";
import { Calendar, User, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicPublications } from "@/api/publications";
import { useQuery } from "@tanstack/react-query";
import { PublicPublication } from "@/types/publications";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { buildExcerpt } from "@/lib/utils";

const coverImage = (publication: PublicPublication) =>
  publication.cover_image_url || "/placeholder.svg?height=400&width=600";

const typeLabel: Record<PublicPublication["type"], string> = {
  article: "Article",
  media: "Media",
};

const excerpt = (content: string) => buildExcerpt(content, 220);

const Publications = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publications", "public"],
    queryFn: () => fetchPublicPublications(),
  });

  const publications = data ?? [];

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Publications & Blogs
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Read our latest articles, research, and insights on education, leadership, and social change.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">Latest Publications</h2>
            {isLoading && <p className="text-sm text-muted-foreground">Loading publications...</p>}
            {isError && <p className="text-sm text-destructive">Failed to load publications.</p>}
          </div>

          {!isLoading && publications.length === 0 ? (
            <p className="text-muted-foreground">No publications yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {publications.map((pub) => (
                <article
                  key={pub.id}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={coverImage(pub)}
                      alt={pub.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {typeLabel[pub.type]}
                      </Badge>
                      {pub.category && (
                        <Badge variant="secondary" className="text-xs">
                          {pub.category}
                        </Badge>
                      )}
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {pub.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" /> {pub.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(pub.published_on).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{excerpt(pub.content)}</p>
                    <div className="flex items-center gap-3">
                      <Button variant="link" className="p-0 h-auto gap-2" asChild>
                        <Link to={`/publications/${pub.id}`}>
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {pub.external_url && (
                        <Button variant="ghost" size="sm" className="gap-2" asChild>
                          <a href={pub.external_url} target="_blank" rel="noopener noreferrer">
                            External link <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                    )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
