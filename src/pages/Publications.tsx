import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, User, ArrowRight, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchFilteredPublicPublications, fetchPublicPublicationFilters } from "@/api/publications";
import { useQuery } from "@tanstack/react-query";
import { PublicPublication } from "@/types/publications";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { buildExcerpt } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const coverImage = (publication: PublicPublication) =>
  publication.cover_image_url || null;

const typeLabel: Record<PublicPublication["type"], string> = {
  article: "Article",
  media: "Media",
};

const excerpt = (content: string) => buildExcerpt(content, 220);

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [authorFilter, setAuthorFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<PublicPublication["type"] | "">("");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: categoryFilter || undefined,
      author: authorFilter || undefined,
      type: typeFilter || undefined,
    }),
    [authorFilter, categoryFilter, debouncedSearch, typeFilter],
  );

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["publications", "public", filters.search, filters.category, filters.author, filters.type],
    queryFn: () => fetchFilteredPublicPublications(filters),
    keepPreviousData: true,
  });

  const { data: filterOptions, isLoading: isFiltersLoading } = useQuery({
    queryKey: ["publications", "public", "filter-options"],
    queryFn: fetchPublicPublicationFilters,
  });

  const publications = data ?? [];
  const categories = filterOptions?.categories ?? [];
  const authors = filterOptions?.authors ?? [];

  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCategoryFilter(undefined);
    setAuthorFilter(undefined);
    setTypeFilter("");
  };

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

          <div className="bg-muted/50 border border-border rounded-lg p-4 lg:p-6 mb-8 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Filter className="h-4 w-4" />
              <span>Search & Filters</span>
              {isFetching && <span className="text-xs">(Updating results...)</span>}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={categoryFilter ?? "all"}
                onValueChange={(value) => setCategoryFilter(value === "all" ? undefined : value)}
                disabled={isFiltersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={authorFilter ?? "all"}
                onValueChange={(value) => setAuthorFilter(value === "all" ? undefined : value)}
                disabled={isFiltersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={typeFilter || "all"}
                onValueChange={(value) => setTypeFilter(value === "all" ? "" : (value as PublicPublication["type"]))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={resetFilters} disabled={!searchTerm && !categoryFilter && !authorFilter && !typeFilter}>
                Clear filters
              </Button>
              {filterOptions && (
                <p className="text-xs text-muted-foreground">
                  {categories.length} categories • {authors.length} authors
                </p>
              )}
            </div>
          </div>

          {!isLoading && publications.length === 0 ? (
            <p className="text-muted-foreground">No publications yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {publications.map((pub) => {
                const imageUrl = coverImage(pub);
                return (
                  <article
                    key={pub.id}
                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                  >
                    {imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={pub.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
