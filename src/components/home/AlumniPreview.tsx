import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchPublicAlumni } from "@/api/alumni";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { PublicAlumniProfile } from "@/types/alumni";

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Alumni Card Component
const AlumniCard = ({
  alumniMember,
}: {
  alumniMember: PublicAlumniProfile;
}) => {
  return (
    <div className="flex flex-col items-center text-center group min-w-[140px] flex-shrink-0">
      <div className="mb-3 relative">
        <Avatar className="w-24 h-24 border-4 border-primary/20 group-hover:border-primary transition-all duration-300 group-hover:scale-110">
          {alumniMember.profile_photo_url ? (
            <AvatarImage
              src={alumniMember.profile_photo_url}
              alt={alumniMember.full_name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {getInitials(alumniMember.full_name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <h4 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
        {alumniMember.full_name}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {alumniMember.university}
      </p>
    </div>
  );
};

export const AlumniPreview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["public-alumni-preview"],
    queryFn: () => fetchPublicAlumni({ limit: 20 }),
  });

  const alumni = data && data.length > 0 ? data : [];
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const buttonAnimation = useScrollAnimation({ threshold: 0.2 });

  // Hide section if no alumni data after loading
  if (!isLoading && alumni.length === 0) {
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
          <p className="text-primary font-medium mb-2">Our Community</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Internship Alumni
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our growing family of interns who have contributed to HEAL Pakistan's mission 
            and continue to be ambassadors of change.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="relative mb-10 overflow-hidden">
            {/* Fade gradient on left */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-accent to-transparent z-10 pointer-events-none" />
            {/* Fade gradient on right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-accent to-transparent z-10 pointer-events-none" />
            
            {/* Auto-scrolling container */}
            <div className="overflow-hidden pb-4">
              <div className="flex gap-6 animate-scroll-left">
                {/* First set of alumni */}
                {alumni.map((alumniMember) => (
                  <AlumniCard
                    key={`first-${alumniMember.id}`}
                    alumniMember={alumniMember}
                  />
                ))}
                {/* Duplicate set for seamless loop */}
                {alumni.map((alumniMember) => (
                  <AlumniCard
                    key={`second-${alumniMember.id}`}
                    alumniMember={alumniMember}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          ref={buttonAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-700 ${
            buttonAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <Button asChild className="gap-2">
            <Link to="/alumni">
              See All Alumni
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
