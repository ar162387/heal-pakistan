import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <p className="text-primary font-medium mb-4 animate-fade-in">Welcome to</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4">
            HEAL Pakistan
          </h1>
          <p className="text-2xl md:text-3xl text-secondary-foreground/90 font-serif italic mb-6">
            Reach the Unreached
          </p>
          <p className="text-lg text-secondary-foreground/80 mb-8 leading-relaxed max-w-xl">
            Inspiring humanity and fostering healing through our initiative to reach the unreached. 
            Empowering youth with education and awareness, cultivating a compassionate generation 
            dedicated to uplifting communities across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/about">
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20">
              <Link to="/join">Join Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
