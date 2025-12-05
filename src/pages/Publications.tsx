import { Layout } from "@/components/layout/Layout";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const publications = [
  {
    id: 1,
    title: "The Role of Youth in Nation Building",
    author: "Habib ur Rehman",
    date: "December 15, 2024",
    excerpt: "Exploring how Pakistani youth can contribute to national development through education, leadership, and community service.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    category: "Leadership",
  },
  {
    id: 2,
    title: "Education as a Tool for Social Change",
    author: "Vaneeza Khan",
    date: "November 28, 2024",
    excerpt: "Analyzing the transformative power of education in addressing social inequalities and empowering communities.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    category: "Education",
  },
  {
    id: 3,
    title: "Humanitarian Response: Lessons from the Field",
    author: "HEAL Pakistan Team",
    date: "October 10, 2024",
    excerpt: "Key insights and lessons learned from our humanitarian initiatives across Pakistan.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop",
    category: "Humanity",
  },
  {
    id: 4,
    title: "Mental Health Awareness in Pakistani Universities",
    author: "Dr. Amna Siddiqui",
    date: "September 5, 2024",
    excerpt: "Addressing the growing need for mental health support and awareness among Pakistani students.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    category: "Awareness",
  },
];

const Publications = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Publications & Blogs
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Read our latest articles, research, and insights on education, leadership, and social change.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {publications.map((pub) => (
              <article key={pub.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={pub.image} 
                    alt={pub.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
                    {pub.category}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {pub.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" /> {pub.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {pub.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{pub.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto gap-2">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
