import { Layout } from "@/components/layout/Layout";
import { Heart, Users } from "lucide-react";

const founders = [
  { name: "Habib ur Rehman", role: "Founder", image: null },
  { name: "Vaneeza Khan", role: "Co-Founder", image: null },
];

const cabinetMembers = [
  { name: "Cabinet Member 1", role: "Position", image: null },
  { name: "Cabinet Member 2", role: "Position", image: null },
  { name: "Cabinet Member 3", role: "Position", image: null },
  { name: "Cabinet Member 4", role: "Position", image: null },
  { name: "Cabinet Member 5", role: "Position", image: null },
  { name: "Cabinet Member 6", role: "Position", image: null },
  { name: "Cabinet Member 7", role: "Position", image: null },
  { name: "Cabinet Member 8", role: "Position", image: null },
];

const Team = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Team
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Meet the dedicated individuals leading HEAL Pakistan's mission to reach the unreached.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">Leadership</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {founders.map((founder, index) => (
              <div key={index} className="bg-card p-8 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{founder.name}</h3>
                <p className="text-primary font-medium">{founder.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cabinet */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-4">Cabinet Members</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Our cabinet members bring diverse expertise and passion to drive HEAL Pakistan's initiatives forward.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {cabinetMembers.map((member, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            * Names and photos will be updated soon
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
