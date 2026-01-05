import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePublicPrograms } from "@/hooks/use-programs";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Program Card Component with animation
const ProgramCard = ({
  program,
  index,
}: {
  program: { id: string; title: string; image_url?: string | null; summary?: string | null };
  index: number;
}) => {
  const cardAnimation = useScrollAnimation({
    threshold: 0.1,
    delay: index * 100,
  });

  return (
    <div
      ref={cardAnimation.ref as React.RefObject<HTMLDivElement>}
      className={`bg-card rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-700 hover:scale-105 hover:shadow-lg ${
        cardAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      {program.image_url && (
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={program.image_url}
            alt={program.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-lg text-foreground">{program.title}</h3>
        {program.summary?.trim() && (
          <p className="text-sm text-muted-foreground line-clamp-4">
            {program.summary.trim()}
          </p>
        )}
      </div>
    </div>
  );
};

export const ProgramsSection = () => {
  const { data: programs, isLoading } = usePublicPrograms(4);
  const items = programs ?? [];
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const buttonAnimation = useScrollAnimation({ threshold: 0.2 });

  // Hide section if no programs after loading
  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-accent">
      <div className="container mx-auto px-4">
        <div
          ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-primary font-medium mb-2">What We Do</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Our Programs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the initiatives we run across Pakistan and the impact they create.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && (
            <div className="sm:col-span-2 lg:col-span-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {items.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>

        <div
          ref={buttonAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center mt-10 transition-all duration-700 ${
            buttonAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <Button asChild variant="outline" className="gap-2">
            <Link to="/programs">
              View All Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
