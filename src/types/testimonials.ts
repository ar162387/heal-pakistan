export type TestimonialCategory = "supporter" | "intern";

export interface Testimonial {
  id: string;
  category: TestimonialCategory;
  name: string;
  quote: string;
  role?: string | null;
  institute?: string | null;
  university?: string | null;
  batch?: string | null;
  photo_url?: string | null;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicTestimonial
  extends Omit<Testimonial, "created_by" | "is_published" | "updated_at"> {}
