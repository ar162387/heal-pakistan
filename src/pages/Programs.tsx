import { Layout } from "@/components/layout/Layout";
import { Heart, BookOpen, Megaphone, Users } from "lucide-react";

const programs = [
  {
    icon: Heart,
    title: "Humanity",
    description: "Our humanitarian initiatives focus on serving underserved communities across Pakistan.",
    activities: [
      "Food distribution drives for underprivileged families",
      "Healthcare camps in rural areas",
      "Disaster relief and emergency response",
      "Winter clothing drives",
      "Clean water initiatives",
    ],
  },
  {
    icon: BookOpen,
    title: "Education Empowerment",
    description: "We believe education is the key to transforming lives and communities.",
    activities: [
      "Free tutoring programs for students",
      "Scholarship programs for deserving students",
      "Career counseling and guidance workshops",
      "Book donation drives",
      "Digital literacy programs",
    ],
  },
  {
    icon: Megaphone,
    title: "Awareness",
    description: "Creating informed citizens through awareness campaigns on critical issues.",
    activities: [
      "Health awareness seminars",
      "Environmental conservation campaigns",
      "Mental health awareness programs",
      "Civic responsibility workshops",
      "Social media awareness drives",
    ],
  },
  {
    icon: Users,
    title: "Leadership",
    description: "Nurturing the next generation of Pakistani leaders through comprehensive programs.",
    activities: [
      "Youth leadership summits",
      "Internship programs",
      "Mentorship connections",
      "Public speaking workshops",
      "Project management training",
    ],
  },
];

const Programs = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Programs
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Discover the four pillars that guide all our initiatives across Pakistan.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {programs.map((program, index) => (
              <div 
                key={program.title}
                className={`flex flex-col lg:flex-row gap-8 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/3">
                  <div className="bg-card p-8 rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <program.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-3">{program.title}</h2>
                    <p className="text-muted-foreground">{program.description}</p>
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <div className="bg-accent p-8 rounded-lg">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Key Activities</h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {program.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
