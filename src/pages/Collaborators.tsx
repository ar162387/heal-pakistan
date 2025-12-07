import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Building, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchPublicTeamMembers } from "@/api/team";

const Collaborators = () => {
  const { data: teamMembers = [], isLoading, isError } = useQuery({
    queryKey: ["public-team-members"],
    queryFn: fetchPublicTeamMembers,
  });

  const collaborators = useMemo(
    () => teamMembers.filter((m) => m.role === "collaborator"),
    [teamMembers],
  );

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Collaborators
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            We work with like-minded organizations to amplify our impact and reach more communities.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading collaborators...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Failed to load collaborators. Please try again later.</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Collaborators will be published here soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {collaborators.map((collab) => (
                <div key={collab.id} className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    {collab.photo_url ? (
                      <img src={collab.photo_url} alt={collab.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  {collab.designation && (
                    <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-3">
                      {collab.designation}
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">{collab.name}</h3>
                  {collab.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{collab.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 bg-accent p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Partner With Us</h3>
            <p className="text-muted-foreground mb-6">
              Interested in collaborating with HEAL Pakistan? We welcome partnerships
              that share our vision of reaching the unreached.
            </p>
            <Button asChild className="gap-2">
              <Link to="/contact">
                Get in Touch <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collaborators;
