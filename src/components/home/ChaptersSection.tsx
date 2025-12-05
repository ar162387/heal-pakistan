import { GraduationCap } from "lucide-react";

const chapters = [
  "National Defence University (NDU), Islamabad",
  "International Islamic University Islamabad (IIUI)",
  "National University of Modern Languages (NUML), Islamabad",
  "Iqra University",
  "Fatima Jinnah Women University (FJWU), Rawalpindi",
  "Quaid-i-Azam University (QAU), Islamabad",
];

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter, index) => (
            <div 
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-5 flex items-center gap-4 hover:bg-primary-foreground/20 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="font-medium text-sm">{chapter}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-primary-foreground/70 text-sm mt-8">
          More chapters announcing soon!
        </p>
      </div>
    </section>
  );
};
