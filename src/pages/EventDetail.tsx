import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPublicEvent } from "@/api/events";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

const EventDetail = () => {
  const { eventId } = useParams();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["public-event", eventId],
    queryFn: () => fetchPublicEvent(eventId ?? ""),
    enabled: Boolean(eventId),
  });

  const coverImage = event?.hero_image_url || event?.gallery?.[0]?.image_url || "/placeholder.svg";

  return (
    <Layout>
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm mb-2">Event details & gallery</p>
            <h1 className="font-serif text-3xl font-bold text-primary-foreground">
              {event?.title ?? "Event"}
            </h1>
          </div>
          <Button asChild variant="secondary">
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to events
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          {isLoading && <p className="text-muted-foreground">Loading event...</p>}
          {isError && <p className="text-destructive">Could not load this event.</p>}
          {!isLoading && !event && !isError && (
            <p className="text-muted-foreground">Event not found or no longer published.</p>
          )}

          {event && (
            <>
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="aspect-video w-full">
                  <img src={coverImage} alt={event.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Badge variant={new Date(event.starts_at) >= new Date() ? "default" : "secondary"}>
                  {new Date(event.starts_at) >= new Date() ? "Upcoming" : "Completed"}
                </Badge>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.starts_at).toLocaleString()}
                </span>
                {event.ends_at && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ends {new Date(event.ends_at).toLocaleString()}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-foreground">{event.description}</p>
              </div>

              {event.gallery && event.gallery.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-foreground">Event Gallery</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.gallery.map((image) => (
                      <div key={image.id} className="rounded-lg overflow-hidden shadow-sm">
                        <img src={image.image_url} alt={event.title} className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
