import { GraduationCap } from "lucide-react";

// TODO: Load chapters from backend API when available
export const ChaptersSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary-foreground/80 font-medium mb-2">Our Network</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            University Chapters
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            HEAL Pakistan operates through dedicated chapters across leading universities in Pakistan, 
            empowering students to lead change in their communities.
          </p>
        </div>

        <div className="text-center">
          <p className="text-primary-foreground/90 text-lg">
            Chapters coming soon!
          </p>
        </div>
      </div>
    </section>
  );
};
