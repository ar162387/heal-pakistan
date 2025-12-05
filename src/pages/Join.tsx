import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, HandHeart, GraduationCap } from "lucide-react";

const Join = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Join HEAL Pakistan
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Be part of a movement that's reaching the unreached and building a compassionate Pakistan.
          </p>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Become a Member</h3>
              <p className="text-sm text-muted-foreground">Join our community and access exclusive events and opportunities.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Volunteer</h3>
              <p className="text-sm text-muted-foreground">Contribute your time and skills to make a difference.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Internship</h3>
              <p className="text-sm text-muted-foreground">Gain experience and develop leadership skills.</p>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-md">
            <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">Application Form</h2>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name *</label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
                  <Input placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">City *</label>
                  <Input placeholder="Enter your city" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">University / Organization</label>
                <Input placeholder="Enter your university or organization" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">How would you like to join? *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Become a Member</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="internship">Apply for Internship</SelectItem>
                    <SelectItem value="donor">Support as Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Why do you want to join HEAL Pakistan?</label>
                <Textarea placeholder="Tell us about yourself and your motivation..." rows={4} />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Join;
