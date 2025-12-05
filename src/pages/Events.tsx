import { Layout } from "@/components/layout/Layout";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Youth Leadership Summit 2025",
    date: "January 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Islamabad Convention Center",
    description: "A gathering of young leaders from across Pakistan to discuss national issues, share ideas, and network with like-minded individuals.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Education Empowerment Workshop",
    date: "February 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "NUML Auditorium, Islamabad",
    description: "Interactive workshop on modern education techniques, career counseling, and skill development for students.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Community Health Camp",
    date: "February 20, 2025",
    time: "8:00 AM - 6:00 PM",
    location: "Rural Punjab",
    description: "Free medical checkups, health awareness sessions, and medicine distribution for underserved communities.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
];

const pastEvents = [
  {
    id: 4,
    title: "Winter Clothing Drive 2024",
    date: "December 2024",
    description: "Distributed warm clothing to over 500 families in need across Islamabad and Rawalpindi.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Mental Health Awareness Seminar",
    date: "November 2024",
    description: "Expert-led seminar on mental health awareness attended by 200+ students from partner universities.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
  },
];

const Events = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Events
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Join us in our upcoming events and be part of the change.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-lg overflow-hidden shadow-md flex flex-col lg:flex-row">
                <div className="lg:w-1/3">
                  <img src={event.image} alt={event.title} className="w-full h-64 lg:h-full object-cover" />
                </div>
                <div className="lg:w-2/3 p-6 lg:p-8">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6">{event.description}</p>
                  <Button>Register Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Past Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-lg overflow-hidden shadow-md">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-primary font-medium mb-2">{event.date}</p>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
