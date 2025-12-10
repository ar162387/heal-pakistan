import { Layout } from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { usePublicPrograms } from "@/hooks/use-programs";

const Programs = () => {
  const { data: programs, isLoading } = usePublicPrograms();
  const items = programs ?? [];

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Programs</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Discover the initiatives powering our mission across Pakistan.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Programs will appear here once they are added in the admin panel.
            </div>
          ) : (
            <div className="space-y-12">
              {items.map((program, index) => (
                <div
                  key={program.id}
                  className={`flex flex-col lg:flex-row gap-8 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className="lg:w-1/2 w-full">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted shadow-md">
                      {program.image_url ? (
                        <img src={program.image_url} alt={program.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                          Image coming soon
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:w-1/2 w-full space-y-4">
                    <div className="space-y-2">
                      <h2 className="font-serif text-2xl font-bold text-foreground">{program.title}</h2>
                      <p className="text-muted-foreground">
                        {program.summary?.trim() || "Details will be added soon."}
                      </p>
                    </div>
                    <div className="bg-accent/60 p-6 rounded-lg shadow-sm space-y-4">
                      <h3 className="font-semibold text-lg text-foreground">Key Activities</h3>
                      {program.key_activities?.length ? (
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {program.key_activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Activities will be listed soon.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
