import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicEvents } from "@/api/events";
import { PublicEvent } from "@/types/events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const coverImage = (event: PublicEvent) =>
  event.hero_image_url || event.gallery?.[0]?.image_url || null;

const getEventStatus = (event: PublicEvent) => {
  const now = new Date();
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;

  if (start > now) return { label: "Upcoming", className: "bg-blue-600 text-white" };
  if (end && now > end) return { label: "Completed", className: "bg-slate-700 text-white" };
  return { label: "Ongoing", className: "bg-emerald-600 text-white" };
};

// Event Card Component with animation
const EventCard = ({
  event,
  index,
}: {
  event: PublicEvent;
  index: number;
}) => {
  const cardAnimation = useScrollAnimation({
    threshold: 0.1,
    delay: index * 100,
  });

  const imageUrl = coverImage(event);

  return (
    <Link
      ref={cardAnimation.ref as React.RefObject<HTMLAnchorElement>}
      to={`/events/${event.slug}`}
      className={`bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-700 hover:scale-105 ${
        cardAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="aspect-video overflow-hidden relative">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        )}
        <Badge className={`absolute top-3 right-3 ${getEventStatus(event).className}`}>
          {getEventStatus(event).label}
        </Badge>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(event.starts_at).toLocaleDateString()}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </div>
    </Link>
  );
};

export const EventsSection = () => {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["public-events", "featured"],
    queryFn: () => fetchPublicEvents({ featuredOnly: true, limit: 6 }),
  });

  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const buttonAnimation = useScrollAnimation({ threshold: 0.2 });

  // Hide section if no events after loading
  if (!isLoading && !isError && (!events || events.length === 0)) {
    return null;
  }

  // Filter events to only show those with images
  const eventsWithImages = events?.filter((event) => coverImage(event) !== null) ?? [];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-primary font-medium mb-2">Stay Updated</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us in our upcoming events and be part of the change. Together, we can make a difference.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && <p className="text-center text-destructive">Could not load events.</p>}

        {!isLoading && !isError && eventsWithImages.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsWithImages.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}

        {!isLoading && !isError && eventsWithImages.length > 0 && (
          <div
            ref={buttonAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mt-10 transition-all duration-700 ${
              buttonAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button asChild className="gap-2">
              <Link to="/events">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
