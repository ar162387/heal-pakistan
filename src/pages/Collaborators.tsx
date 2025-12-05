import { Layout } from "@/components/layout/Layout";
import { Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const collaborators = [
  {
    name: "Kashmir Institute of International Relations (KIIR)",
    description: "A research institute focused on international relations, human rights, and conflict resolution in South Asia.",
    focus: "Human Rights & Advocacy",
  },
  {
    name: "Al Kahf Educational Foundation",
    description: "An educational organization dedicated to providing quality education and supporting underprivileged students.",
    focus: "Education & Scholarships",
  },
  {
    name: "Pakistan Social Alliance (PSA)",
    description: "A coalition of civil society organizations working together for social development and community welfare.",
    focus: "Social Development",
  },
];

const Collaborators = () => {
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
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {collaborators.map((collab, index) => (
              <div key={index} className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-3">
                  {collab.focus}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{collab.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{collab.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 bg-accent p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Partner With Us</h3>
            <p className="text-muted-foreground mb-6">
              Interested in collaborating with HEAL Pakistan? We welcome partnerships with organizations 
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
