import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Megaphone, Users, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Heart,
    title: "Humanity",
    description: "Humanitarian initiatives including food drives, healthcare camps, and disaster relief to serve underserved communities.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: BookOpen,
    title: "Education Empowerment",
    description: "Educational programs, workshops, and scholarships to empower youth with knowledge and skills for a brighter future.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Megaphone,
    title: "Awareness",
    description: "Awareness campaigns on health, environment, social issues, and civic responsibility to create informed citizens.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Users,
    title: "Leadership",
    description: "Leadership development programs, mentorship, and internships to nurture the next generation of Pakistani leaders.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
];

export const ProgramsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">What We Do</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Programs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HEAL stands for Humanity, Education, Awareness, and Leadership - the four pillars 
            that guide all our initiatives across Pakistan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <div 
              key={program.title}
              className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className={`w-16 h-16 ${program.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <program.icon className={`h-8 w-8 ${program.color}`} />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-3">{program.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
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
