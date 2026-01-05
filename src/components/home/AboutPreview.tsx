import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, BookOpen, Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Value Card Component with animation
const ValueCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) => {
  const cardAnimation = useScrollAnimation({
    threshold: 0.2,
    delay: index * 100,
  });

  return (
    <div
      ref={cardAnimation.ref as React.RefObject<HTMLDivElement>}
      className={`bg-card p-6 rounded-lg shadow-md text-center transition-all duration-700 hover:scale-105 hover:shadow-lg ${
        cardAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export const AboutPreview = () => {
  const { data: settings } = useSiteSettings();
  const introText =
    settings?.about_intro ||
    "At HEAL Pakistan, we inspire humanity and foster healing through our initiative to reach the unreached. We empower the youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across our nation.";

  const contentAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            ref={contentAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${
              contentAnimation.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <p className="text-primary font-medium mb-2">About Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {introText}
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
            <ValueCard
              icon={Heart}
              title="Humanity"
              description="Serving those in need with compassion"
              index={0}
            />
            <ValueCard
              icon={BookOpen}
              title="Education"
              description="Empowering through knowledge"
              index={1}
            />
            <ValueCard
              icon={Users}
              title="Leadership"
              description="Building future leaders"
              index={2}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
