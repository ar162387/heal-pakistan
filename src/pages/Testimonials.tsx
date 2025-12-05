import { Layout } from "@/components/layout/Layout";
import { Quote } from "lucide-react";

const leaderTestimonials = [
  {
    name: "Dr. Ahmad Bilal",
    title: "Professor, National Defence University",
    quote: "HEAL Pakistan is doing remarkable work in empowering youth. Their programs blend education with practical leadership skills.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Prof. Nadia Hussain",
    title: "Dean, IIUI Faculty of Social Sciences",
    quote: "The dedication of HEAL Pakistan volunteers is truly inspiring. They represent the best of Pakistani youth.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
];

const internTestimonials = [
  {
    name: "Sana Malik",
    university: "FJWU",
    batch: "2024",
    quote: "My internship at HEAL Pakistan transformed my perspective. I learned leadership skills and gained invaluable experience in community service.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Faisal Ahmed",
    university: "NUML",
    batch: "2024",
    quote: "HEAL Pakistan gave me the platform to make a real difference. The mentorship and hands-on experience were exceptional.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Ayesha Noor",
    university: "QAU",
    batch: "2023",
    quote: "Being part of HEAL Pakistan was life-changing. I developed skills I never knew I had and made friends for life.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Hassan Ali",
    university: "NDU Islamabad",
    batch: "2023",
    quote: "The exposure to real humanitarian work and leadership opportunities at HEAL Pakistan shaped my career aspirations.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

const Testimonials = () => {
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

      {/* Leader Testimonials */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">From Our Supporters</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leaderTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-8 rounded-lg shadow-md relative">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/20" />
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intern Testimonials */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">From Our Interns</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {internTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
                <p className="text-sm text-muted-foreground italic text-center mb-4">"{testimonial.quote}"</p>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground text-sm">{testimonial.name}</h3>
                  <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                  <p className="text-xs text-primary">Batch {testimonial.batch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
