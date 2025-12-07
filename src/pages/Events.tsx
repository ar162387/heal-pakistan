import { Layout } from "@/components/layout/Layout";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPublicEvents } from "@/api/events";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PublicEvent } from "@/types/events";

const coverImage = (event: PublicEvent) =>
  event.hero_image_url || event.gallery?.[0]?.image_url || "/placeholder.svg";

const getEventStatus = (event: PublicEvent) => {
  const now = new Date();
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;

  if (start > now) return { label: "Upcoming", className: "bg-blue-600 text-white" };
  if (end && now > end) return { label: "Completed", className: "bg-slate-700 text-white" };
  return { label: "Ongoing", className: "bg-emerald-600 text-white" };
};

const Events = () => {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["public-events", "all"],
    queryFn: () => fetchPublicEvents(),
  });

  const { upcoming, past } = useMemo(() => {
    if (!events) return { upcoming: [] as PublicEvent[], past: [] as PublicEvent[] };
    const now = new Date();
    const upcomingEvents = events.filter((event) => new Date(event.starts_at) >= now);
    const pastEvents = events.filter((event) => new Date(event.starts_at) < now);
    return {
      upcoming: upcomingEvents,
      past: pastEvents.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()),
    };
  }, [events]);

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

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">Upcoming Events</h2>
            {isLoading && <p className="text-sm text-muted-foreground">Loading events...</p>}
            {isError && <p className="text-sm text-destructive">Failed to load events.</p>}
          </div>

          {upcoming.length === 0 && !isLoading ? (
            <p className="text-muted-foreground">No upcoming events right now. Check back soon!</p>
          ) : (
            <div className="space-y-8">
              {upcoming.map((event) => (
                <div key={event.id} className="bg-card rounded-lg overflow-hidden shadow-md flex flex-col lg:flex-row">
                  <Link to={`/events/${event.slug}`} className="lg:w-1/3">
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img src={coverImage(event)} alt={event.title} className="w-full h-full object-cover" />
                      <Badge className={`absolute top-3 right-3 ${getEventStatus(event).className}`}>
                        {getEventStatus(event).label}
                      </Badge>
                    </div>
                  </Link>
                  <div className="lg:w-2/3 p-6 lg:p-8">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {new Date(event.starts_at).toLocaleDateString()}
                      </span>
                      {event.ends_at && (
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Ends {new Date(event.ends_at).toLocaleDateString()}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> {event.location}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-6">{event.description}</p>
                    <Button asChild>
                      <Link to={`/events/${event.slug}`}>View details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Past Events</h2>
          {past.length === 0 && !isLoading ? (
            <p className="text-muted-foreground">No past events to show yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
            {past.map((event) => (
              <Link key={event.id} to={`/events/${event.slug}`} className="bg-card rounded-lg overflow-hidden shadow-md">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={coverImage(event)} alt={event.title} className="w-full h-full object-cover" />
                  <Badge className={`absolute top-3 right-3 ${getEventStatus(event).className}`}>
                    {getEventStatus(event).label}
                  </Badge>
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary font-medium mb-2">
                    {new Date(event.starts_at).toLocaleDateString()}
                  </p>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
