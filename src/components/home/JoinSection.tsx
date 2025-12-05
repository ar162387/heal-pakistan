import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, HandHeart, Building } from "lucide-react";

export const JoinSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Get Involved</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join HEAL Pakistan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be part of HEAL Pakistan and work for change. Together, we can reach the unreached 
            and build a compassionate nation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Become a Member</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our community and access exclusive events, networking, and growth opportunities.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/join">Apply Now</Link>
            </Button>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HandHeart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Volunteer</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contribute your time and skills to make a difference in communities across Pakistan.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/join">Get Started</Link>
            </Button>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Partner With Us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organizations can collaborate with us to amplify impact and reach more communities.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
