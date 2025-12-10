import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createMessage } from "@/api/messages";
import { useSiteSettings } from "@/hooks/use-site-settings";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();

  const contactEmail = settings?.contact_email || "contact@healpakistan.org";
  const contactPhone = settings?.contact_phone || "+92 300 1234567";
  const contactAddress = settings?.contact_address || "Islamabad, Pakistan";

  const mutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      toast({ title: "Message sent", description: "We will get back to you soon." });
      setForm(emptyForm);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Unexpected error, please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our programs, want to volunteer, or 
                interested in partnering with us, feel free to reach out.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">{contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">{contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">{contactAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Office Hours</h3>
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Subject *</label>
                  <Input
                    placeholder="What is this regarding?"
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                  <Textarea
                    placeholder="Your message..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
