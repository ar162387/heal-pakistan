import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Youth Leadership Summit 2024",
    date: "January 15, 2025",
    location: "Islamabad",
    description: "A gathering of young leaders from across Pakistan to discuss national issues and solutions.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Education Empowerment Workshop",
    date: "February 5, 2025",
    location: "Rawalpindi",
    description: "Interactive workshop on modern education techniques and career counseling for students.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Community Health Camp",
    date: "February 20, 2025",
    location: "Rural Punjab",
    description: "Free medical checkups and health awareness campaign for underserved communities.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
  },
];

export const EventsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Stay Updated</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us in our upcoming events and be part of the change. Together, we can make a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="gap-2">
            <Link to="/events">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
