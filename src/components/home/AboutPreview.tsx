import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, BookOpen, Users } from "lucide-react";

export const AboutPreview = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-medium mb-2">About Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At HEAL Pakistan, we inspire humanity and foster healing through our initiative to 
              reach the unreached. We empower the youth with education and awareness, cultivating 
              a compassionate generation dedicated to uplifting communities across our nation.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Founded by Habib ur Rehman and co-founded by Vaneeza Khan, HEAL Pakistan works with 
              university chapters across Pakistan to create meaningful impact through humanitarian 
              work, education empowerment, awareness campaigns, and leadership development.
            </p>
            <Button asChild className="gap-2">
              <Link to="/about">
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Humanity</h3>
              <p className="text-sm text-muted-foreground">Serving those in need with compassion</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Education</h3>
              <p className="text-sm text-muted-foreground">Empowering through knowledge</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Leadership</h3>
              <p className="text-sm text-muted-foreground">Building future leaders</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
