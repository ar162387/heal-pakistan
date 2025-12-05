import { Layout } from "@/components/layout/Layout";
import { Heart, Target, Eye } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About HEAL Pakistan
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Learn about our journey, mission, and the vision that drives us to reach the unreached.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At HEAL Pakistan, we inspire humanity and foster healing through our initiative to 
                reach the unreached. We empower the youth with education and awareness, cultivating 
                a compassionate generation dedicated to uplifting communities across our nation.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To create a Pakistan where every community has access to education, healthcare, 
                and opportunities for growth. We envision a nation led by compassionate, 
                educated young leaders committed to positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What HEAL Stands For */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            What HEAL Stands For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { letter: "H", word: "Humanity", desc: "Serving those in need with compassion and dignity" },
              { letter: "E", word: "Education", desc: "Empowering minds through knowledge and skills" },
              { letter: "A", word: "Awareness", desc: "Creating informed and responsible citizens" },
              { letter: "L", word: "Leadership", desc: "Nurturing the leaders of tomorrow" },
            ].map((item) => (
              <div key={item.letter} className="bg-card p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-foreground">{item.letter}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{item.word}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Our Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-1">Habib ur Rehman</h3>
              <p className="text-primary font-medium mb-3">Founder</p>
              <p className="text-sm text-muted-foreground">
                Visionary leader dedicated to empowering Pakistani youth through education and humanitarian work.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-1">Vaneeza Khan</h3>
              <p className="text-primary font-medium mb-3">Co-Founder</p>
              <p className="text-sm text-muted-foreground">
                Passionate advocate for youth development and community empowerment across Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
