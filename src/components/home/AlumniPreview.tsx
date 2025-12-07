import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fetchPublicAlumni } from "@/api/alumni";

const fallbackAlumni = [
  { full_name: "Alumni Member", university: "HEAL Pakistan", profile_photo_url: "/placeholder.svg" },
];

export const AlumniPreview = () => {
  const { data } = useQuery({
    queryKey: ["public-alumni-preview"],
    queryFn: () => fetchPublicAlumni({ limit: 6 }),
  });

  const alumni = data && data.length > 0 ? data.slice(0, 6) : fallbackAlumni;

  return (
    <section className="py-16 lg:py-24 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Our Community</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Internship Alumni
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our growing family of interns who have contributed to HEAL Pakistan's mission 
            and continue to be ambassadors of change.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {alumni.map((alumniMember, index) => (
            <div 
              key={alumniMember.id ?? index}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-colors mb-3">
                <img 
                  src={alumniMember.profile_photo_url || "/placeholder.svg"} 
                  alt={alumniMember.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-foreground text-sm">{alumniMember.full_name}</h4>
              <p className="text-xs text-muted-foreground">{alumniMember.university}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
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
