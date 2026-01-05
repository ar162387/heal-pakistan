import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, HandHeart, Building } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Join Card Component with animation
const JoinCard = ({
  icon: Icon,
  title,
  description,
  link,
  linkText,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  link: string;
  linkText: string;
  index: number;
}) => {
  const cardAnimation = useScrollAnimation({
    threshold: 0.2,
    delay: index * 100,
  });

  return (
    <div
      ref={cardAnimation.ref as React.RefObject<HTMLDivElement>}
      className={`bg-card p-8 rounded-lg shadow-md text-center transition-all duration-700 hover:shadow-lg hover:scale-105 ${
        cardAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button asChild variant="outline" size="sm">
        <Link to={link}>{linkText}</Link>
      </Button>
    </div>
  );
};

export const JoinSection = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
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
          <JoinCard
            icon={UserPlus}
            title="Become a Member"
            description="Join our community and access exclusive events, networking, and growth opportunities."
            link="/join"
            linkText="Apply Now"
            index={0}
          />
          <JoinCard
            icon={HandHeart}
            title="Volunteer"
            description="Contribute your time and skills to make a difference in communities across Pakistan."
            link="/join"
            linkText="Get Started"
            index={1}
          />
          <JoinCard
            icon={Building}
            title="Partner With Us"
            description="Organizations can collaborate with us to amplify impact and reach more communities."
            link="/contact"
            linkText="Contact Us"
            index={2}
          />
        </div>
      </div>
    </section>
  );
};
