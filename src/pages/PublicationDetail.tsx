import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPublicPublication } from "@/api/publications";
import { Calendar, ArrowLeft, ExternalLink, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import RichTextContent from "@/components/RichTextContent";

const PublicationDetail = () => {
  const { publicationId } = useParams();

  const { data: publication, isLoading, isError } = useQuery({
    queryKey: ["public-publication", publicationId],
    queryFn: () => fetchPublicPublication(publicationId ?? ""),
    enabled: Boolean(publicationId),
  });

  const coverImage = publication?.cover_image_url || null;

  return (
    <Layout>
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm mb-2">Publication detail</p>
            <h1 className="font-serif text-3xl font-bold text-primary-foreground">{publication?.title ?? "Publication"}</h1>
          </div>
          <Button asChild variant="secondary">
            <Link to="/publications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to publications
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          {isLoading && <p className="text-muted-foreground">Loading publication...</p>}
          {isError && <p className="text-destructive">Could not load this publication.</p>}
          {!isLoading && !publication && !isError && (
            <p className="text-muted-foreground">Publication not found or no longer published.</p>
          )}

          {publication && (
            <>
              {coverImage && (
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-video w-full">
                    <img src={coverImage} alt={publication.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs capitalize">
                  {publication.type}
                </Badge>
                {publication.category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {publication.category}
                  </Badge>
                )}
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {publication.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(publication.published_on).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {publication.external_url && (
                  <Button asChild variant="ghost" size="sm" className="gap-2">
                    <a href={publication.external_url} target="_blank" rel="noreferrer">
                      External link <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <RichTextContent html={publication.content} placeholder="No content provided yet." />

              {!publication.content && publication.external_url && (
                <p className="text-sm text-muted-foreground">
                  This publication links to an external resource. Use the button above to read it.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PublicationDetail;
