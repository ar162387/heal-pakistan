import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const alumniPreview = [
  { name: "Ahmed Khan", university: "NDU Islamabad", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Sara Ali", university: "IIUI", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
  { name: "Bilal Ahmed", university: "NUML", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Fatima Zahra", university: "FJWU", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Usman Tariq", university: "QAU", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Ayesha Malik", university: "Iqra University", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
];

export const AlumniPreview = () => {
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
          {alumniPreview.map((alumni, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-colors mb-3">
                <img 
                  src={alumni.image} 
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-foreground text-sm">{alumni.name}</h4>
              <p className="text-xs text-muted-foreground">{alumni.university}</p>
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
