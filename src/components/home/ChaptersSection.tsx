import { GraduationCap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// TODO: Load chapters from backend API when available
export const ChaptersSection = () => {
  const contentAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div
          ref={contentAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-700 ${
            contentAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-primary-foreground/80 font-medium mb-2">Our Network</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            University Chapters
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            HEAL Pakistan operates through dedicated chapters across leading universities in Pakistan, 
            empowering students to lead change in their communities.
          </p>
          <p className="text-primary-foreground/90 text-lg">
            Chapters coming soon!
          </p>
        </div>
      </div>
    </section>
  );
};
