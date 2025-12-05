import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, Upload, Quote } from "lucide-react";

const mockTestimonials = [
  { id: 1, name: "Dr. Ahmed Khan", designation: "Education Minister", quote: "HEAL Pakistan is doing remarkable work for youth empowerment.", image: "/placeholder.svg" },
  { id: 2, name: "Sara Ahmed", designation: "Alumni 2023", quote: "My internship experience transformed my perspective on community service.", image: "/placeholder.svg" },
  { id: 3, name: "Prof. Ali Hassan", designation: "NDU Professor", quote: "The leadership programs have produced outstanding student leaders.", image: "/placeholder.svg" },
  { id: 4, name: "Fatima Zahra", designation: "Chapter Lead FJWU", quote: "Being part of HEAL Pakistan has been the most rewarding experience.", image: "/placeholder.svg" },
];

const TestimonialsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage quotes from leaders and participants</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Testimonial</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation / Title</Label>
                <Input id="designation" placeholder="e.g., Education Minister, Alumni 2023" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">Quote / Testimonial</Label>
                <Textarea id="quote" placeholder="Enter the testimonial text..." rows={4} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">Add Testimonial</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTestimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <Quote className="h-6 w-6 text-primary/30 mb-2" />
                  <p className="text-sm italic text-muted-foreground mb-3">"{testimonial.quote}"</p>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
