import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Quote } from "lucide-react";
import { fetchPublicTestimonials } from "@/api/testimonials";
import { PublicTestimonial } from "@/types/testimonials";

const Testimonials = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: () => fetchPublicTestimonials(),
  });

  const testimonials: PublicTestimonial[] = data ?? [];

  const { supporters, interns } = useMemo(() => {
    const supportersList = testimonials.filter((t) => t.category === "supporter");
    const internsList = testimonials.filter((t) => t.category === "intern");
    return { supporters: supportersList, interns: internsList };
  }, [testimonials]);

  const placeholder = "/placeholder.svg";

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Testimonials
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Hear from leaders and interns who have been part of the HEAL Pakistan journey.
          </p>
        </div>
      </section>

      {/* Supporter Testimonials */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">From Our Supporters</h2>

          {isLoading && <p className="text-center text-muted-foreground">Loading testimonials...</p>}
          {isError && <p className="text-center text-destructive">Failed to load testimonials.</p>}

          {!isLoading && !isError && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {supporters.map((testimonial) => (
                <div key={testimonial.id} className="bg-card p-8 rounded-lg shadow-md relative">
                  <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/20" />
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.photo_url || placeholder}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {[testimonial.role, testimonial.institute].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && supporters.length === 0 && (
            <p className="text-center text-muted-foreground">No supporter testimonials yet.</p>
          )}
        </div>
      </section>

      {/* Intern Testimonials */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">From Our Interns</h2>

          {isLoading && <p className="text-center text-muted-foreground">Loading testimonials...</p>}
          {isError && <p className="text-center text-destructive">Failed to load testimonials.</p>}

          {!isLoading && !isError && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {interns.map((testimonial) => (
                <div key={testimonial.id} className="bg-card p-6 rounded-lg shadow-md">
                  <img
                    src={testimonial.photo_url || placeholder}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                  />
                  <p className="text-sm text-muted-foreground italic text-center mb-4">"{testimonial.quote}"</p>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground text-sm">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                    {testimonial.batch && <p className="text-xs text-primary">Batch {testimonial.batch}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && interns.length === 0 && (
            <p className="text-center text-muted-foreground">No intern testimonials yet.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
